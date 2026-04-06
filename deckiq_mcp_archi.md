# DeckIQ — MCP Servers + Backend Master Prompt

You are building the complete backend + MCP layer for **DeckIQ** — an AI-powered PPT generation SaaS — entirely in **Next.js 14 (App Router)**. No Python. No FastAPI. Everything is JavaScript/Node.js.

You have two reference documents:
- `UI_theme.md` — design tokens, colors, fonts
- `DeckIQ_Build_Plan.md` — full app architecture, DB schema, auth flow, page specs

Read both documents fully before writing any code.

---

## STACK — NO EXCEPTIONS

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router |
| MCP Servers | `@modelcontextprotocol/sdk` (SSE transport) |
| MCP Client | `@modelcontextprotocol/sdk` MultiClient |
| PPT Generation | `pptxgenjs` |
| AI Orchestration | `langchain` + `@langchain/community` |
| Web Search | Tavily API or SerpAPI |
| Images | Pexels API |
| Database | Supabase (PostgreSQL via Prisma) |
| ORM | Prisma |
| Storage | Supabase Storage |
| Thumbnail | `sharp` + `libreoffice-convert` or `pptx-to-png` |
| Auth | Custom JWT (access token useState, refresh HttpOnly cookie) |
| Payments | Razorpay |
| Deployment | Vercel |

---

## INSTALL ALL DEPENDENCIES FIRST

```bash
npx create-next-app@latest deckiq --javascript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd deckiq

npm install @modelcontextprotocol/sdk
npm install pptxgenjs
npm install langchain @langchain/community @langchain/openai
npm install @supabase/supabase-js
npm install prisma @prisma/client
npm install jsonwebtoken bcryptjs
npm install razorpay
npm install framer-motion
npm install sharp
npm install axios
npm install cookies-next
npm install tavily
npm install @anthropic-ai/sdk

npx prisma init
```

---

## FOLDER STRUCTURE — BUILD EXACTLY THIS

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.js
│   │   │   ├── login/route.js
│   │   │   ├── refresh/route.js
│   │   │   └── logout/route.js
│   │   ├── generate/route.js          ← main generation endpoint
│   │   ├── generations/route.js       ← fetch user's PPTs
│   │   └── payments/
│   │       ├── create-order/route.js
│   │       └── verify/route.js
│   ├── dashboard/page.jsx
│   ├── generations/page.jsx
│   ├── login/page.jsx
│   ├── signup/page.jsx
│   ├── terms/page.jsx
│   └── page.jsx
├── components/
│   ├── LandingPage/
│   └── Dashboard/
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── lib/
│   ├── prisma.js
│   ├── supabase.js
│   ├── auth.js
│   └── mcp/
│       ├── client.js                  ← MCP MultiClient setup
│       ├── servers/
│       │   ├── content_server.js
│       │   ├── design_server.js
│       │   ├── ppt_server.js
│       │   └── export_server.js
│       └── agent.js                   ← LangChain orchestrator
└── mcp-servers/                       ← standalone MCP server processes
    ├── content/
    │   └── index.js
    ├── design/
    │   └── index.js
    ├── ppt/
    │   └── index.js
    └── export/
        └── index.js
```

---

## PRISMA SCHEMA

Update `prisma/schema.prisma` to exactly this:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  password    String
  credits     Int      @default(3)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  ppTs        PPT[]
  ratings     Rating[]
}

model PPT {
  id           String   @id @default(cuid())
  userId       String
  title        String
  theme        String
  slideCount   Int
  fileUrl      String        // Supabase Storage URL for .pptx file
  thumbnailUrl String?       // Supabase Storage URL for slide 1 PNG (nullable for v1)
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id])
  ratings      Rating[]
}

model Rating {
  id        String   @id @default(cuid())
  userId    String
  pptId     String
  score     Int
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  ppt       PPT      @relation(fields: [pptId], references: [id])
}
```

After writing this run:
```bash
npx prisma generate
npx prisma db push
```

---

## ENVIRONMENT VARIABLES

Create `.env.local`:

```env
DATABASE_URL=your_supabase_postgres_connection_string

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_STORAGE_BUCKET=deckiq-ppts

JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars

TAVILY_API_KEY=your_tavily_key
PEXELS_API_KEY=your_pexels_key
ANTHROPIC_API_KEY=your_anthropic_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

MCP_CONTENT_SERVER_URL=http://localhost:3001
MCP_DESIGN_SERVER_URL=http://localhost:3002
MCP_PPT_SERVER_URL=http://localhost:3003
MCP_EXPORT_SERVER_URL=http://localhost:3004
```

---

## PART 1 — MCP SERVERS

Build 4 standalone MCP servers in `src/mcp-servers/`. Each runs as a separate Node.js process on its own port using SSE transport. Each server file is self-contained with its own `package.json`.

---

### SERVER 1 — content_server (`src/mcp-servers/content/index.js`)

**Responsibility:** Decides ALL content that goes into the deck. Runs first in the pipeline.

**Port:** 3001

```javascript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { z } from 'zod'
import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import Anthropic from '@anthropic-ai/sdk'

const server = new McpServer({ name: 'content-server', version: '1.0.0' })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const tavilySearch = new TavilySearchResults({ maxResults: 3, apiKey: process.env.TAVILY_API_KEY })

// Helper: call Claude for content generation
async function askClaude(prompt) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  })
  return msg.content[0].text
}
```

**Tools to implement:**

**Tool 1: `generate_slide_titles`**
- Input: `{ topic: string, slideCount: number }`
- Logic: Call Claude with prompt — "Generate exactly {slideCount} slide titles for a presentation on '{topic}'. Return as a JSON array of strings only, no other text."
- Parse JSON array from response
- Return: `{ titles: string[] }`

**Tool 2: `generate_intro_slide`**
- Input: `{ topic: string }`
- Logic: Call Claude — "Write a compelling 1-sentence subtitle for the intro/title slide of a presentation on '{topic}'. Return only the subtitle text."
- Return: `{ subtitle: string }`

**Tool 3: `generate_conclusion`**
- Input: `{ topic: string, titles: string[] }`
- Logic: Call Claude — "Write 3 concise conclusion bullet points for a presentation on '{topic}' that covered: {titles.join(', ')}. Return as JSON array of strings."
- Return: `{ bullets: string[] }`

**Tool 4: `search_web_per_slide`**
- Input: `{ slideTitle: string, topic: string }`
- Logic: Use Tavily search with query `${slideTitle} ${topic}`. Return top 3 results concatenated as context text.
- Return: `{ context: string }`

**Tool 5: `write_bullets`**
- Input: `{ slideTitle: string, context: string, bulletCount: number }`
- Logic: Call Claude — "Given this web research: {context}. Write exactly {bulletCount} concise bullet points for a slide titled '{slideTitle}'. Return as JSON array of strings only."
- Default bulletCount: 4
- Return: `{ bullets: string[] }`

**Tool 6: `write_speaker_notes`**
- Input: `{ slideTitle: string, bullets: string[] }`
- Logic: Call Claude — "Write 2-3 sentences of speaker notes for a slide titled '{slideTitle}' with these bullet points: {bullets.join(', ')}. Return only the notes text."
- Return: `{ notes: string }`

**Tool 7: `suggest_chart_type`**
- Input: `{ slideTitle: string, bullets: string[] }`
- Logic: Call Claude — "Based on this slide title '{slideTitle}' and bullets, should this slide have a chart? If yes return JSON: {hasChart: true, chartType: 'bar'|'pie'|'line', reason: string}. If no return {hasChart: false}."
- Return: `{ hasChart: boolean, chartType?: string, reason?: string }`

Start the server:
```javascript
const transport = new SSEServerTransport('/sse', res)
await server.connect(transport)
```

---

### SERVER 2 — design_server (`src/mcp-servers/design/index.js`)

**Responsibility:** Picks ONE theme for the ENTIRE deck (not per slide). Fetches images. This runs ONCE per generation — not per slide.

**Port:** 3002

**Tools to implement:**

**Tool 1: `pick_theme`**
- Input: `{ topic: string, tone: string }`
- tone options: "professional" | "creative" | "educational" | "startup" | "minimal"
- Logic: Call Claude — "Pick the single best theme for a presentation on '{topic}' with a '{tone}' tone. Choose from: {AVAILABLE_THEMES list}. Return only the theme name string."
- AVAILABLE_THEMES constant at top of file:
```javascript
const AVAILABLE_THEMES = [
  'dark_tech', 'minimal_light', 'corporate_blue', 'vibrant_creative',
  'nature_green', 'berlin', 'slate_dark', 'warm_terracotta', 'ocean_depth',
  'berry_bold', 'coral_energy', 'midnight_exec', 'vintage_wood',
  'circuit_board', 'celestial', 'sage_calm', 'cherry_bold',
  'droplet_fresh', 'golden_exec', 'pastel_soft'
]
```
- Validate response is in AVAILABLE_THEMES, fallback to 'minimal_light'
- Return: `{ theme: string }`

**Tool 2: `fetch_slide_image`**
- Input: `{ slideTitle: string, topic: string }`
- Logic: Call Pexels API `https://api.pexels.com/v1/search?query={slideTitle} {topic}&per_page=1`
- Download image, convert to base64
- Return: `{ imageBase64: string, imageUrl: string, attribution: string }`

**Tool 3: `get_available_themes`**
- Input: none
- Logic: Return the full AVAILABLE_THEMES array with metadata
- Return: `{ themes: Array<{ name: string, vibe: string, goodFor: string }> }`
- Include vibe and goodFor descriptions for each theme so frontend can display them nicely

---

### SERVER 3 — ppt_server (`src/mcp-servers/ppt/index.js`)

**Responsibility:** Builds the actual .pptx file using pptxgenjs. Loads theme template. Inserts content and images.

**Port:** 3003

```javascript
import PptxGenJS from 'pptxgenjs'
import fs from 'fs'
import path from 'path'

const TEMP_DIR = '/tmp/deckiq'
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })

// Theme config — maps theme name to pptxgenjs styling
const THEME_CONFIG = {
  dark_tech: {
    background: { color: '0F0F14' },
    titleColor: '00DCFF',
    bodyColor: 'DCDCDC',
    titleFont: 'Arial Black',
    bodyFont: 'Calibri',
    titleSize: 32,
    bodySize: 16,
  },
  minimal_light: {
    background: { color: 'FFFFFF' },
    titleColor: '0F0F14',
    bodyColor: '3C3C3C',
    titleFont: 'Georgia',
    bodyFont: 'Calibri Light',
    titleSize: 32,
    bodySize: 16,
  },
  corporate_blue: {
    background: { color: '1E2761' },
    titleColor: 'FFFFFF',
    bodyColor: 'CADCFC',
    titleFont: 'Calibri',
    bodyFont: 'Calibri',
    titleSize: 32,
    bodySize: 16,
  },
  // ... add all 20 themes following same pattern
}
```

**Tools to implement:**

**Tool 1: `create_presentation`**
- Input: `{ sessionId: string, title: string, theme: string }`
- Logic:
  - Create new PptxGenJS instance
  - Apply theme from THEME_CONFIG
  - Create title slide with presentation title
  - Save instance reference to a Map keyed by sessionId (in-memory, same process)
  - Write initial file to `/tmp/deckiq/{sessionId}.pptx`
- Return: `{ success: boolean, sessionId: string }`

**Tool 2: `add_slide`**
- Input: `{ sessionId: string, title: string, bullets: string[], speakerNotes: string, theme: string }`
- Logic:
  - Load pptx from `/tmp/deckiq/{sessionId}.pptx`
  - Add new slide with theme styling
  - Add title text box with theme titleColor and titleFont
  - Add bullets text box with theme bodyColor and bodyFont
  - Add speaker notes
  - Save back to `/tmp/deckiq/{sessionId}.pptx`
- Return: `{ success: boolean, slideNumber: number }`

**Tool 3: `add_slide_with_image`**
- Input: `{ sessionId: string, title: string, bullets: string[], speakerNotes: string, theme: string, imageBase64: string }`
- Logic:
  - Same as add_slide but with 2-column layout
  - Left column (60% width): title + bullets
  - Right column (40% width): image
  - Image added using `prs.addImage({ data: imageBase64, ... })`
- Return: `{ success: boolean, slideNumber: number }`

**Tool 4: `save_presentation`**
- Input: `{ sessionId: string }`
- Logic:
  - Ensure file exists at `/tmp/deckiq/{sessionId}.pptx`
  - Read file as buffer
  - Return buffer as base64 string
- Return: `{ fileBase64: string, fileSizeKb: number }`

**Tool 5: `rebuild_with_theme`**
- Input: `{ sessionId: string, newTheme: string, slidesData: Array<{title, bullets, speakerNotes, imageBase64?}> }`
- Logic:
  - This is called when user switches theme AFTER initial generation
  - Create brand new PptxGenJS instance with newTheme
  - Re-add all slides from slidesData with new theme styling
  - Content is the same — only visual theme changes
  - Save to `/tmp/deckiq/{sessionId}_v2.pptx`
- Return: `{ fileBase64: string }`

---

### SERVER 4 — export_server (`src/mcp-servers/export/index.js`)

**Responsibility:** Uploads final .pptx to Supabase Storage. Generates thumbnail. Returns URLs. Called ONLY after user confirms theme.

**Port:** 3004

```javascript
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'deckiq-ppts'
```

**Tools to implement:**

**Tool 1: `upload_pptx`**
- Input: `{ fileBase64: string, userId: string, title: string, sessionId: string }`
- Logic:
  - Convert base64 to Buffer
  - Generate filename: `{userId}/{sessionId}_{timestamp}.pptx`
  - Upload to Supabase Storage bucket
  - Get public URL using `supabase.storage.from(BUCKET).getPublicUrl(filename)`
- Return: `{ fileUrl: string, fileName: string }`

**Tool 2: `generate_and_upload_thumbnail`**
- Input: `{ fileBase64: string, userId: string, sessionId: string }`
- Logic:
  - Convert base64 pptx to Buffer
  - Use `sharp` to generate a placeholder thumbnail OR
  - Use `pptx-to-png` npm package to convert slide 1 to PNG
  - If conversion fails — generate a styled placeholder PNG using sharp (DeckIQ branded, shows deck title)
  - Upload PNG to Supabase Storage at `{userId}/{sessionId}_thumb.png`
  - Get public URL
- Return: `{ thumbnailUrl: string }`
- Note: Wrap entire function in try/catch — if thumbnail generation fails, return `{ thumbnailUrl: null }` so it never blocks the main flow

**Tool 3: `cleanup_temp`**
- Input: `{ sessionId: string }`
- Logic: Delete `/tmp/deckiq/{sessionId}.pptx` and any variant files after successful upload
- Return: `{ success: boolean }`

---

## PART 2 — MCP CLIENT

Build `src/lib/mcp/client.js`:

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'

// Create one client per server
async function createMCPClient(serverUrl, serverName) {
  const client = new Client({ name: `deckiq-${serverName}`, version: '1.0.0' })
  const transport = new SSEClientTransport(new URL(`${serverUrl}/sse`))
  await client.connect(transport)
  return client
}

// Call a tool on a specific server
export async function callTool(client, toolName, args) {
  const result = await client.callTool({ name: toolName, arguments: args })
  return JSON.parse(result.content[0].text)
}

// Initialize all 4 clients
export async function initMCPClients() {
  const [contentClient, designClient, pptClient, exportClient] = await Promise.all([
    createMCPClient(process.env.MCP_CONTENT_SERVER_URL, 'content'),
    createMCPClient(process.env.MCP_DESIGN_SERVER_URL, 'design'),
    createMCPClient(process.env.MCP_PPT_SERVER_URL, 'ppt'),
    createMCPClient(process.env.MCP_EXPORT_SERVER_URL, 'export'),
  ])
  return { contentClient, designClient, pptClient, exportClient }
}
```

---

## PART 3 — AGENT ORCHESTRATOR

Build `src/lib/mcp/agent.js`:

This is the brain. It calls MCP tools in the correct order and streams progress back to the frontend.

```javascript
import { initMCPClients, callTool } from './client.js'
import { nanoid } from 'nanoid'

export async function runDeckIQAgent({ topic, slideCount, tone = 'professional', onProgress }) {
  const sessionId = nanoid()
  const clients = await initMCPClients()
  const { contentClient, designClient, pptClient, exportClient } = clients

  // Progress helper — streams step updates to frontend
  const progress = (step, message) => onProgress?.({ step, message, sessionId })

  try {
    // ─── PHASE 1: CONTENT ────────────────────────────────────────
    progress(1, 'Planning your deck...')
    const { titles } = await callTool(contentClient, 'generate_slide_titles', { topic, slideCount })

    progress(2, 'Writing intro slide...')
    const { subtitle } = await callTool(contentClient, 'generate_intro_slide', { topic })

    // For each slide: search + write bullets + speaker notes (parallel where possible)
    progress(3, 'Researching content for each slide...')
    const slidesContent = await Promise.all(
      titles.map(async (title) => {
        const { context } = await callTool(contentClient, 'search_web_per_slide', { slideTitle: title, topic })
        const { bullets } = await callTool(contentClient, 'write_bullets', { slideTitle: title, context, bulletCount: 4 })
        const { notes } = await callTool(contentClient, 'write_speaker_notes', { slideTitle: title, bullets })
        return { title, bullets, notes }
      })
    )

    progress(4, 'Writing conclusion...')
    const { bullets: conclusionBullets } = await callTool(contentClient, 'generate_conclusion', { topic, titles })

    // ─── PHASE 2: DESIGN ─────────────────────────────────────────
    progress(5, 'Choosing the perfect theme...')
    const { theme } = await callTool(designClient, 'pick_theme', { topic, tone })

    progress(6, 'Fetching images for slides...')
    const slidesWithImages = await Promise.all(
      slidesContent.map(async (slide) => {
        const { imageBase64, imageUrl } = await callTool(designClient, 'fetch_slide_image', {
          slideTitle: slide.title,
          topic
        })
        return { ...slide, imageBase64, imageUrl }
      })
    )

    // ─── PHASE 3: BUILD PPT ──────────────────────────────────────
    progress(7, 'Building your presentation...')
    await callTool(pptClient, 'create_presentation', { sessionId, title: topic, theme })

    // Add intro slide
    await callTool(pptClient, 'add_slide', {
      sessionId,
      title: topic,
      bullets: [subtitle],
      speakerNotes: `Welcome to this presentation on ${topic}.`,
      theme
    })

    // Add content slides
    for (const slide of slidesWithImages) {
      if (slide.imageBase64) {
        await callTool(pptClient, 'add_slide_with_image', {
          sessionId,
          title: slide.title,
          bullets: slide.bullets,
          speakerNotes: slide.notes,
          theme,
          imageBase64: slide.imageBase64
        })
      } else {
        await callTool(pptClient, 'add_slide', {
          sessionId,
          title: slide.title,
          bullets: slide.bullets,
          speakerNotes: slide.notes,
          theme
        })
      }
    }

    // Add conclusion slide
    await callTool(pptClient, 'add_slide', {
      sessionId,
      title: 'Key Takeaways',
      bullets: conclusionBullets,
      speakerNotes: 'Summarize the key points discussed.',
      theme
    })

    progress(8, 'Finalizing your deck...')
    const { fileBase64, fileSizeKb } = await callTool(pptClient, 'save_presentation', { sessionId })

    // Return everything needed — DO NOT upload to Supabase yet
    // Upload only happens after user confirms theme
    return {
      sessionId,
      theme,
      suggestedTheme: theme,
      fileBase64,
      fileSizeKb,
      slideCount: titles.length + 2, // +intro +conclusion
      slidesData: [
        { title: topic, bullets: [subtitle], speakerNotes: `Welcome to ${topic}.` },
        ...slidesWithImages,
        { title: 'Key Takeaways', bullets: conclusionBullets, speakerNotes: 'Summarize key points.' }
      ],
      availableThemes: (await callTool(designClient, 'get_available_themes', {})).themes
    }

  } catch (error) {
    console.error('[DeckIQ Agent Error]', error)
    throw error
  }
}

// Called when user switches theme OR confirms theme
export async function rebuildWithTheme({ sessionId, newTheme, slidesData, onProgress }) {
  const clients = await initMCPClients()
  const { pptClient } = clients

  onProgress?.({ step: 1, message: 'Applying new theme...' })

  const { fileBase64 } = await callTool(pptClient, 'rebuild_with_theme', {
    sessionId,
    newTheme,
    slidesData
  })

  return { fileBase64 }
}

// Called when user clicks "Confirm & Save" — uploads to Supabase
export async function confirmAndUpload({ fileBase64, userId, title, theme, slideCount, sessionId, onProgress }) {
  const clients = await initMCPClients()
  const { exportClient } = clients

  onProgress?.({ step: 1, message: 'Uploading your deck...' })
  const { fileUrl } = await callTool(exportClient, 'upload_pptx', {
    fileBase64, userId, title, sessionId
  })

  onProgress?.({ step: 2, message: 'Generating preview...' })
  const { thumbnailUrl } = await callTool(exportClient, 'generate_and_upload_thumbnail', {
    fileBase64, userId, sessionId
  })

  // Cleanup temp files
  await callTool(exportClient, 'cleanup_temp', { sessionId })

  return { fileUrl, thumbnailUrl }
}
```

---

## PART 4 — GENERATE API ROUTE

Build `src/app/api/generate/route.js` as a **streaming** endpoint:

```javascript
import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { runDeckIQAgent, rebuildWithTheme, confirmAndUpload } from '@/lib/mcp/agent'

export async function POST(request) {
  // 1. Verify JWT access token from Authorization header
  const token = request.headers.get('authorization')?.split(' ')[1]
  const payload = verifyAccessToken(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, topic, slideCount, tone, sessionId, newTheme, slidesData, fileBase64, title, theme } = await request.json()

  // 2. Handle different actions
  if (action === 'generate') {
    // Check credits
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || user.credits < 1) {
      return NextResponse.json({ error: 'No credits remaining' }, { status: 403 })
    }

    // Deduct credit immediately
    await prisma.user.update({
      where: { id: payload.userId },
      data: { credits: { decrement: 1 } }
    })

    // Stream progress using ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data) => {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`))
        }

        try {
          const result = await runDeckIQAgent({
            topic, slideCount, tone,
            onProgress: (progress) => send({ type: 'progress', ...progress })
          })

          send({ type: 'complete', ...result })
          controller.close()
        } catch (error) {
          // Restore credit on failure
          await prisma.user.update({
            where: { id: payload.userId },
            data: { credits: { increment: 1 } }
          })
          send({ type: 'error', message: error.message })
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  }

  if (action === 'change_theme') {
    // User switched theme — rebuild PPT with new theme, no credit deduction
    const result = await rebuildWithTheme({ sessionId, newTheme, slidesData })
    return NextResponse.json(result)
  }

  if (action === 'confirm') {
    // User confirmed theme — upload to Supabase and save to DB
    const { fileUrl, thumbnailUrl } = await confirmAndUpload({
      fileBase64, userId: payload.userId, title, theme,
      slideCount, sessionId
    })

    // Save PPT record to DB
    const ppt = await prisma.pPT.create({
      data: {
        userId: payload.userId,
        title,
        theme,
        slideCount,
        fileUrl,
        thumbnailUrl: thumbnailUrl || null,
      }
    })

    return NextResponse.json({ ppt, fileUrl, thumbnailUrl })
  }
}
```

---

## PART 5 — FRONTEND GENERATION FLOW

The dashboard generation UI must handle these 3 stages:

### Stage 1 — Input
User enters topic + slide count + tone → calls `/api/generate` with `action: 'generate'`

### Stage 2 — Theme Selection (shown after generation completes)
```
┌─────────────────────────────────────────────────┐
│  DeckIQ picked this theme for you               │
│                                                 │
│  [THEME PREVIEW CARD — large, shows theme name] │
│                                                 │
│  Or choose another theme:                       │
│  [scroll row of all 20 theme cards]             │
│                                                 │
│  [Keep This Theme & Save]  [Change Theme]       │
└─────────────────────────────────────────────────┘
```

- When user clicks a different theme → call `/api/generate` with `action: 'change_theme'`
- Show loading spinner while rebuilding (fast, ~3-5s)
- When user clicks "Keep This Theme & Save" → call `/api/generate` with `action: 'confirm'`
- Only after confirm: show download button

### Stage 3 — Download
```
┌─────────────────────────────────────────────────┐
│  ✅ Your deck is ready!                         │
│                                                 │
│  [Thumbnail or styled card]                     │
│  Title: {topic}                                 │
│  Theme: {theme}  Slides: {slideCount}           │
│                                                 │
│  [⬇ Download .pptx]  [View in Generations]     │
└─────────────────────────────────────────────────┘
```

---

## PART 6 — RUNNING SERVERS LOCALLY

Add to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:mcp": "concurrently \"node src/mcp-servers/content/index.js\" \"node src/mcp-servers/design/index.js\" \"node src/mcp-servers/ppt/index.js\" \"node src/mcp-servers/export/index.js\"",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:mcp\""
  }
}
```

```bash
npm install concurrently --save-dev
npm run dev:all
```

---

## PART 7 — SUPABASE STORAGE SETUP

In Supabase dashboard:
1. Create a new Storage bucket named `deckiq-ppts`
2. Set bucket to **private** (not public)
3. Add RLS policy: users can only read their own files
4. The service role key bypasses RLS — use it server-side only

Folder structure inside bucket:
```
deckiq-ppts/
├── {userId}/
│   ├── {sessionId}_{timestamp}.pptx     ← PPT file
│   └── {sessionId}_thumb.png            ← Thumbnail
```

---

## BUILD ORDER

Follow this exactly:

1. Prisma schema + `npx prisma db push`
2. `.env.local` with all keys
3. `src/lib/prisma.js` — Prisma singleton
4. `src/lib/supabase.js` — Supabase client
5. `src/lib/auth.js` — JWT sign/verify helpers
6. `src/mcp-servers/content/index.js` — content_server
7. `src/mcp-servers/design/index.js` — design_server
8. `src/mcp-servers/ppt/index.js` — ppt_server
9. `src/mcp-servers/export/index.js` — export_server
10. `src/lib/mcp/client.js` — MCP client
11. `src/lib/mcp/agent.js` — orchestrator
12. `src/app/api/generate/route.js` — streaming API
13. `src/app/api/generations/route.js` — fetch user PPTs
14. Auth API routes (signup, login, refresh, logout)
15. AuthContext + ThemeContext
16. Dashboard UI with 3-stage generation flow
17. Generations page
18. Payments (Razorpay)
19. Landing page components

---

## QUALITY RULES

- Every MCP tool must have proper input validation using `zod`
- Every tool must be wrapped in try/catch and return `{ error: string }` on failure
- The agent must restore credits if generation fails
- Upload to Supabase ONLY after user confirms theme — never before
- `thumbnailUrl` is nullable — never let thumbnail failure block the generation flow
- All 4 MCP servers must be running before `/api/generate` is called
- Use `nanoid` for all sessionIds
- Temp files in `/tmp/deckiq/` must be cleaned up after every confirmed generation