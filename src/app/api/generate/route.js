/**
 * DeckIQ — Generate API Route (Inline, Vercel)
 *
 * action: 'generate' → AI generates slide content, returns data + suggested theme (NO upload yet)
 * action: 'confirm'  → builds PPTX with chosen theme, uploads to Supabase, saves DB, returns fileUrl
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken, extractBearerToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import PptxGenJS from 'pptxgenjs'
import { nanoid } from 'nanoid'
import { InferenceClient } from '@huggingface/inference'

// ─── HuggingFace Qwen via InferenceClient ────────────────────────────────────
const hfClient = new InferenceClient(process.env.HUGGINGFACE_TOKEN)
const HF_MODEL = 'Qwen/Qwen2.5-7B-Instruct:together'

async function callQwen(prompt, maxTokens = 512) {
  const chatCompletion = await hfClient.chatCompletion({
    model: HF_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7,
  })
  return chatCompletion.choices[0].message.content.trim()
}

function parseJsonArray(text) {
  try {
    const match = text.match(/\[[\s\S]*?\]/)
    return match ? JSON.parse(match[0]) : []
  } catch { return [] }
}

// ─── Theme list (shared with frontend) ────────────────────────────────────
const THEME_KEYS = [
  'dark_tech', 'minimal_light', 'corporate_blue', 'vibrant_creative',
  'nature_green', 'berlin', 'slate_dark', 'coral_energy',
  'midnight', 'arctic', 'emerald', 'neon_noir', 'golden_hour',
  'ocean_depths', 'pastel_dream', 'cherry_blossom', 'sapphire_glow',
  'nordic_frost', 'retro_pop', 'cyberpunk', 'autumn_leaves',
  'monochrome', 'vintage_sepia', 'neon_sunset', 'desert_sand'
]

const THEMES = {
  dark_tech: { bg: '0F0F14', title: '00DCFF', body: 'DCDCDC', accent: '5B4CF5', tf: 'Arial', bf: 'Calibri' },
  minimal_light: { bg: 'FFFFFF', title: '0F0F14', body: '3C3C3C', accent: '5B4CF5', tf: 'Georgia', bf: 'Calibri' },
  corporate_blue: { bg: '1E2761', title: 'FFFFFF', body: 'CADCFC', accent: '3B82F6', tf: 'Calibri', bf: 'Calibri' },
  vibrant_creative: { bg: 'FF6B6B', title: 'FFFFFF', body: 'FFFFFF', accent: 'FFE66D', tf: 'Arial', bf: 'Arial' },
  nature_green: { bg: '1A3A2A', title: 'E8F5E9', body: 'C8E6C9', accent: '66BB6A', tf: 'Arial', bf: 'Calibri' },
  berlin: { bg: '1C1C1E', title: 'F2F2F7', body: 'E5E5EA', accent: 'FF9500', tf: 'Arial', bf: 'Arial' },
  slate_dark: { bg: '1E293B', title: 'F8FAFC', body: 'CBD5E1', accent: '94A3B8', tf: 'Calibri', bf: 'Calibri' },
  coral_energy: { bg: 'FF4500', title: 'FFFFFF', body: 'FFE4D6', accent: 'FFD700', tf: 'Arial', bf: 'Arial' },
  midnight: { bg: '0D1117', title: 'C9D1D9', body: '8B949E', accent: '58A6FF', tf: 'Courier New', bf: 'Calibri' },
  arctic: { bg: 'EFF6FF', title: '1E3A5F', body: '334155', accent: '2563EB', tf: 'Calibri', bf: 'Calibri' },
  emerald: { bg: '064E3B', title: 'ECFDF5', body: 'A7F3D0', accent: '10B981', tf: 'Calibri', bf: 'Calibri' },
  neon_noir: { bg: '09090B', title: 'E4E4E7', body: 'A1A1AA', accent: 'A855F7', tf: 'Courier New', bf: 'Courier New' },
  golden_hour: { bg: '78350F', title: 'FEF3C7', body: 'FDE68A', accent: 'F59E0B', tf: 'Georgia', bf: 'Georgia' },
  ocean_depths: { bg: '003049', title: 'FCBF49', body: 'EAE2B7', accent: 'F77F00', tf: 'Calibri', bf: 'Calibri' },
  pastel_dream: { bg: 'FFF1FB', title: '6B21A8', body: '9333EA', accent: 'EC4899', tf: 'Georgia', bf: 'Calibri' },
  cherry_blossom: { bg: 'FFF0F5', title: 'C71585', body: '8B008B', accent: 'FF69B4', tf: 'Georgia', bf: 'Calibri' },
  sapphire_glow: { bg: '000080', title: 'E0FFFF', body: 'ADD8E6', accent: '00BFFF', tf: 'Arial', bf: 'Arial' },
  nordic_frost: { bg: 'ECEFF4', title: '2E3440', body: '4C566A', accent: '88C0D0', tf: 'Arial', bf: 'Arial' },
  retro_pop: { bg: 'FFD54F', title: 'D84315', body: 'F4511E', accent: '4FC3F7', tf: 'Arial', bf: 'Arial' },
  cyberpunk: { bg: '000000', title: 'FF003C', body: 'FCE205', accent: '00F0FF', tf: 'Courier New', bf: 'Courier New' },
  autumn_leaves: { bg: 'FFF8E1', title: '3E2723', body: '5D4037', accent: 'FF8F00', tf: 'Georgia', bf: 'Georgia' },
  monochrome: { bg: 'FFFFFF', title: '000000', body: '333333', accent: '666666', tf: 'Arial', bf: 'Arial' },
  vintage_sepia: { bg: 'F4ECD8', title: '5C4033', body: '654321', accent: '8B4513', tf: 'Georgia', bf: 'Calibri' },
  neon_sunset: { bg: '240046', title: 'FF9E00', body: 'FF9100', accent: 'E0AAFF', tf: 'Arial', bf: 'Arial' },
  desert_sand: { bg: 'EDC9AF', title: '4A3C31', body: '614A36', accent: 'CC7722', tf: 'Calibri', bf: 'Calibri' },
}

// ─── Content generation ───────────────────────────────────────────────────
async function generateContent(topic, slideCount) {
  // 1. Generate a proper presentation title from the user's raw prompt
  const titleRaw = await callQwen(
    `The user wants a presentation about: "${topic}"
Generate a concise, professional presentation title (5-8 words max).
Return ONLY the title text. No quotes, no punctuation at end.
Example: "The Rise of AI in Modern Healthcare"`, 60
  )
  const presentationTitle = titleRaw.replace(/^["']|["']$/g, '').trim() || topic

  // 2. Slide titles
  const titlesRaw = await callQwen(
    `Generate exactly ${slideCount} slide titles for a professional presentation titled "${presentationTitle}" about "${topic}".
Return ONLY a JSON array of strings. No markdown, no explanation.
Example: ["Introduction", "Key Concepts", "Analysis"]
Must have exactly ${slideCount} items.`
  )
  let titles = parseJsonArray(titlesRaw)
  if (titles.length !== slideCount) {
    titles = Array.from({ length: slideCount }, (_, i) => titles[i] || `Section ${i + 1}`)
  }

  // 3. Subtitle + theme in parallel
  const [subtitleRaw, themeRaw] = await Promise.all([
    callQwen(`Write a one-sentence subtitle for a presentation titled "${presentationTitle}". Return ONLY the subtitle, no quotes.`, 80),
    callQwen(`Pick the best theme for a presentation about "${topic}". Choose from: ${THEME_KEYS.join(', ')}. Return ONLY the theme name.`, 20),
  ])

  const subtitle = subtitleRaw.replace(/^["']|["']$/g, '').trim()
  const suggestedTheme = THEME_KEYS.find(t => themeRaw.toLowerCase().includes(t)) || 'minimal_light'

  // 4. Bullets for each slide (parallel)
  const slides = await Promise.all(
    titles.map(async (title) => {
      const raw = await callQwen(
        `Write 5 concise bullet points for a slide titled "${title}" in a presentation about "${topic}".
Return ONLY a JSON array of 5 strings. Each under 12 words. Be specific and informative.`
      )
      const bullets = parseJsonArray(raw)
      return {
        title,
        bullets: bullets.length >= 5 ? bullets.slice(0, 5) : Array.from({ length: 5 }, (_, i) => bullets[i] || `Key point about ${title}`),
      }
    })
  )

  // 5. Conclusion
  const conclusionRaw = await callQwen(
    `Write 3 key takeaway bullet points for a presentation on "${topic}" covering: ${titles.join(', ')}.
Return ONLY a JSON array of 3 strings. Each under 15 words.`, 200
  )
  const conclusion = parseJsonArray(conclusionRaw)
  const conclusionBullets = conclusion.length >= 3 ? conclusion.slice(0, 3) : ['Key insights explored in depth', 'Actionable next steps identified', 'Thank you for your attention']

  return { presentationTitle, subtitle, slides, conclusionBullets, suggestedTheme }
}

async function fetchImageFromPexels(query) {
  if (!process.env.PEXELS_API_KEY) return null
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: { Authorization: process.env.PEXELS_API_KEY },
    })
    const data = await res.json()
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.large2x || data.photos[0].src.large
    }
  } catch (err) {
    console.error('Pexels error:', err)
  }
  return null
}

// ─── PPTX builder (with images) ─────────────────────────────────────────────
async function buildPptx(presentationTitle, slides, subtitle, conclusionBullets, theme) {
  const tc = THEMES[theme] || THEMES.minimal_light
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_16x9'
  pptx.author = 'DeckIQ'
  pptx.title = presentationTitle

  // Fetch images concurrently
  const [titleImg, ...slideImgs] = await Promise.all([
    fetchImageFromPexels(presentationTitle || subtitle || 'presentation'),
    ...slides.map(s => fetchImageFromPexels(s.title))
  ])
  const conclusionImg = await fetchImageFromPexels('summary conclusion key takeaways')

  // Title slide
  const ts = pptx.addSlide()
  ts.background = { color: tc.bg }
  ts.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: tc.accent } })
  ts.addShape('rect', { x: 0, y: 5.53, w: '100%', h: 0.1, fill: { color: tc.accent } })
  
  if (titleImg) {
    ts.addImage({ path: titleImg, x: 5.5, y: 0.8, w: 4.0, h: 4.0, sizing: { type: 'cover' } })
    ts.addText(presentationTitle, { x: 0.6, y: 1.3, w: 4.8, h: 2.0, fontSize: 36, bold: true, color: tc.title, fontFace: tc.tf, align: 'left' })
    ts.addText(subtitle, { x: 0.6, y: 3.5, w: 4.8, h: 0.6, fontSize: 15, color: tc.accent, fontFace: tc.bf, align: 'left' })
    ts.addText('Generated by DeckIQ', { x: 0.6, y: 4.9, w: 4.8, h: 0.4, fontSize: 10, color: tc.body, fontFace: tc.bf, align: 'left' })
  } else {
    ts.addText(presentationTitle, { x: 0.6, y: 1.3, w: 8.8, h: 2.0, fontSize: 36, bold: true, color: tc.title, fontFace: tc.tf, align: 'center' })
    ts.addText(subtitle, { x: 0.6, y: 3.5, w: 8.8, h: 0.6, fontSize: 15, color: tc.accent, fontFace: tc.bf, align: 'center' })
    ts.addText('Generated by DeckIQ', { x: 0.6, y: 4.9, w: 8.8, h: 0.4, fontSize: 10, color: tc.body, fontFace: tc.bf, align: 'center' })
  }

  // Content slides
  for (let i = 0; i < slides.length; i++) {
    const { title, bullets } = slides[i]
    const slide = pptx.addSlide()
    const imgUrl = slideImgs[i]
    
    slide.background = { color: tc.bg }
    slide.addShape('rect', { x: 0, y: 0, w: 0.08, h: 5.63, fill: { color: tc.accent } })

    if (imgUrl) {
      if (i % 2 === 0) {
        // Image on Right
        slide.addImage({ path: imgUrl, x: 5.8, y: 1.02, w: 3.7, h: 4.2, sizing: { type: 'cover' } })
        slide.addText(title, { x: 0.3, y: 0.22, w: 9.2, h: 0.75, fontSize: 24, bold: true, color: tc.title, fontFace: tc.tf })
        slide.addShape('line', { x: 0.3, y: 1.02, w: 5.2, h: 0, line: { color: tc.accent, width: 1 } })
        slide.addText(bullets.map(b => `• ${b}`).join('\n'), { x: 0.3, y: 1.18, w: 5.2, h: 4.1, fontSize: 15, color: tc.body, fontFace: tc.bf, valign: 'top', paraSpaceAfter: 8 })
      } else {
        // Image on Left
        slide.addImage({ path: imgUrl, x: 0.3, y: 1.02, w: 3.7, h: 4.2, sizing: { type: 'cover' } })
        slide.addText(title, { x: 0.3, y: 0.22, w: 9.2, h: 0.75, fontSize: 24, bold: true, color: tc.title, fontFace: tc.tf })
        slide.addShape('line', { x: 4.3, y: 1.02, w: 5.2, h: 0, line: { color: tc.accent, width: 1 } })
        slide.addText(bullets.map(b => `• ${b}`).join('\n'), { x: 4.3, y: 1.18, w: 5.2, h: 4.1, fontSize: 15, color: tc.body, fontFace: tc.bf, valign: 'top', paraSpaceAfter: 8 })
      }
    } else {
      // No Image layout
      slide.addText(title, { x: 0.3, y: 0.22, w: 9.2, h: 0.75, fontSize: 24, bold: true, color: tc.title, fontFace: tc.tf })
      slide.addShape('line', { x: 0.3, y: 1.02, w: 9.2, h: 0, line: { color: tc.accent, width: 1 } })
      slide.addText(bullets.map(b => `• ${b}`).join('\n'), { x: 0.3, y: 1.18, w: 9.2, h: 4.1, fontSize: 15, color: tc.body, fontFace: tc.bf, valign: 'top', paraSpaceAfter: 8 })
    }
    
    slide.addText(`${i + 2}`, { x: 9.1, y: 5.15, w: 0.6, h: 0.3, fontSize: 10, color: tc.accent, fontFace: tc.bf, align: 'right' })
  }

  // Conclusion slide
  const cs = pptx.addSlide()
  cs.background = { color: tc.bg }
  cs.addShape('rect', { x: 0, y: 0, w: 0.08, h: 5.63, fill: { color: tc.accent } })
  
  if (conclusionImg) {
    cs.addText('Key Takeaways', { x: 0.3, y: 0.22, w: 9.2, h: 0.75, fontSize: 24, bold: true, color: tc.title, fontFace: tc.tf })
    cs.addShape('line', { x: 0.3, y: 1.02, w: 5.2, h: 0, line: { color: tc.accent, width: 1 } })
    cs.addText(conclusionBullets.map(b => `• ${b}`).join('\n'), { x: 0.3, y: 1.18, w: 5.2, h: 4.1, fontSize: 16, color: tc.body, fontFace: tc.bf, valign: 'top', paraSpaceAfter: 14 })
    cs.addImage({ path: conclusionImg, x: 5.8, y: 1.02, w: 3.7, h: 4.2, sizing: { type: 'cover' } })
  } else {
    cs.addText('Key Takeaways', { x: 0.3, y: 0.22, w: 9.2, h: 0.75, fontSize: 24, bold: true, color: tc.title, fontFace: tc.tf })
    cs.addShape('line', { x: 0.3, y: 1.02, w: 9.2, h: 0, line: { color: tc.accent, width: 1 } })
    cs.addText(conclusionBullets.map(b => `• ${b}`).join('\n'), { x: 0.3, y: 1.18, w: 9.2, h: 4.1, fontSize: 16, color: tc.body, fontFace: tc.bf, valign: 'top', paraSpaceAfter: 14 })
  }

  return pptx.write({ outputType: 'nodebuffer' })
}


function sendEvent(controller, data) {
  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`))
}

// ─── Main handler ──────────────────────────────────────────────────────────
export async function POST(request) {
  const token = extractBearerToken(request)
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let payload
  try { payload = verifyAccessToken(token) }
  catch { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }) }

  const body = await request.json()
  const { action = 'generate' } = body

  // ── ACTION: generate ─────────────────────────────────────────────────────
  // Generates slide content and returns it + suggested theme to frontend
  // Does NOT upload or save anything yet
  if (action === 'generate') {
    const { topic, slideCount = 7 } = body
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || user.credits < 1) {
      return NextResponse.json({ error: 'No credits remaining. Please buy more.' }, { status: 403 })
    }

    // Deduct credit upfront — restored if generation fails
    await prisma.user.update({ where: { id: payload.userId }, data: { credits: { decrement: 1 } } })

    const stream = new ReadableStream({
      async start(controller) {
        const send = (data) => sendEvent(controller, data)
        try {
          send({ step: 1, message: 'Planning your slide structure...' })
          const { presentationTitle, subtitle, slides, conclusionBullets, suggestedTheme } = await generateContent(topic, Number(slideCount))

          send({ step: 2, message: 'Writing slide content...' })

          send({ step: 3, message: 'Finalizing content...' })

          // Return all slide data to frontend — NO upload, NO file yet
          send({
            step: 'preview',
            suggestedTheme,
            availableThemes: THEME_KEYS,
            slidesData: {
              topic,
              title: presentationTitle,
              subtitle,
              slides,
              conclusionBullets,
              slideCount: slides.length + 2,
            },
          })
          controller.close()
        } catch (err) {
          console.error('[generate]', err)
          try { await prisma.user.update({ where: { id: payload.userId }, data: { credits: { increment: 1 } } }) } catch { }
          send({ step: 'error', message: 'Generation failed. Your credit has been restored.' })
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    })
  }

  // ── ACTION: confirm ──────────────────────────────────────────────────────
  // User confirmed theme — build PPTX, upload, save DB, return URL
  if (action === 'confirm') {
    const { theme, slidesData } = body
    const { topic, title: presentationTitle, subtitle, slides, conclusionBullets } = slidesData

    try {
      // Build PPTX with AI-generated title
      const buffer = await buildPptx(presentationTitle || topic, slides, subtitle, conclusionBullets, theme)

      // Upload to Supabase Storage
      const sessionId = nanoid()
      const safeTitle = topic.slice(0, 30).replace(/[^a-z0-9]/gi, '_')
      const fileName = `${payload.userId}/${sessionId}_${safeTitle}.pptx`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('deckiq-ppts')
        .upload(fileName, buffer, {
          contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabaseAdmin.storage.from('deckiq-ppts').getPublicUrl(fileName)

      // Save to DB
      const ppt = await prisma.pPT.create({
        data: {
          userId: payload.userId,
          title: topic,
          theme,
          slideCount: slides.length + 2,
          fileUrl: publicUrl,
        },
      })

      const updatedUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { credits: true },
      })

      return NextResponse.json({ success: true, fileUrl: publicUrl, pptId: ppt.id, credits: updatedUser.credits })
    } catch (err) {
      console.error('[confirm]', err)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
