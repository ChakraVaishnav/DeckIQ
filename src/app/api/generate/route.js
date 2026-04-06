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
// ─── Groq API ──────────────────────────────────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = 'llama-3.3-70b-versatile'

async function callGroq(prompt, maxTokens) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    })
  })
  if (!res.ok) {
    const errText = await res.text()
    console.error('Groq Error:', errText)
    throw new Error('Groq API Error')
  }
  const data = await res.json()
  return data.choices[0].message.content.trim()
}

function parseJsonArray(text) {
  try {
    const match = text.match(/\[[\s\S]*?\]/)
    return match ? JSON.parse(match[0]) : []
  } catch { return [] }
}

function parseJsonObject(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/)
    return match ? JSON.parse(match[0]) : {}
  } catch { return {} }
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
  // 1. ONE compressed API call for all presentation metadata and structure
  const masterRaw = await callGroq(
    `Create a highly professional presentation outline about "${topic}".
Output ONLY valid JSON matching this exact structure:
{
  "presentationTitle": "Engaging 5-8 word title",
  "subtitle": "A one-sentence engaging subtitle",
  "theme": "Pick one: ${THEME_KEYS.join(', ')}",
  "imageKeyword": "1-2 words representing the main topic for a stock photo search",
  "slideTitles": ["Title 1", "Title 2"], // Generate exactly ${slideCount} strings
  "conclusionBullets": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"] // Exactly 3 takeaway strings
}`, 800
  )

  let layoutData = {}
  try {
    const match = masterRaw.match(/\{[\s\S]*\}/)
    layoutData = match ? JSON.parse(match[0]) : {}
  } catch (err) {
    // Silent fail for production, fallbacks kick in
  }

  // Fallbacks in case LLM structure gets slightly corrupted
  const presentationTitle = layoutData.presentationTitle || topic
  const subtitle = layoutData.subtitle || `Comprehensive overview of ${topic}`
  const suggestedTheme = THEME_KEYS.includes(layoutData.theme) ? layoutData.theme : 'minimal_light'
  const mainImageQuery = layoutData.imageKeyword || topic

  let titles = Array.isArray(layoutData.slideTitles) ? layoutData.slideTitles : []
  if (titles.length !== Number(slideCount)) {
    titles = Array.from({ length: Number(slideCount) }, (_, i) => titles[i] || `Section ${i + 1}`)
  }

  let conclusionData = Array.isArray(layoutData.conclusionBullets) ? layoutData.conclusionBullets : []
  const conclusionBullets = conclusionData.length >= 3 ? conclusionData.slice(0, 3) : ['Key insights discussed', 'Actionable next steps identified', 'Thank you for your attention']

  // 2. Bullets for each slide generated in parallel (preventing massive token timeouts)
  const slides = await Promise.all(
    titles.map(async (title) => {
      const raw = await callGroq(
        `Write exactly 5 concise bullet points for a slide titled "${title}" inside a deck about "${presentationTitle}".
Output ONLY valid JSON matching this exact structure:
{
  "imageKeyword": "1-2 words representing this slide for a stock photo search",
  "bullets": [
    "First point about the topic",
    "Second informative detail",
    "Third important concept",
    "Fourth key consideration",
    "Fifth concluding point"
  ]
}`, 150
      )
      const data = parseJsonObject(raw)
      let bullets = Array.isArray(data.bullets) ? data.bullets : parseJsonArray(raw)
      return {
        title,
        bullets: bullets.length >= 5 ? bullets.slice(0, 5) : Array.from({ length: 5 }, (_, i) => bullets[i] || `Key point about ${title}`),
        imageQuery: data.imageKeyword || title,
      }
    })
  )

  return { presentationTitle, subtitle, slides, conclusionBullets, suggestedTheme, mainImageQuery }
}

async function fetchImagesFromSerper(query, num = 10) {
  const apiKey = process.env.SERPER_API_KEY

  try {
    const res = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, num })
    })
    const data = await res.json()
    if (data.images && data.images.length > 0) {
      return data.images.map(img => img.imageUrl)
    }
  } catch (err) { }
  return []
}

// ─── Native Image Validator (to prevent broken PPTX renders) ───────────────
async function getValidBase64Images(query, neededCount) {
  // Ask for extra URLs in case many are broken hotlinks
  const urls = await fetchImagesFromSerper(query, neededCount + 10)
  const validImages = []
  
  // Try to fetch them in parallel with a strict 2s timeout
  const promises = urls.map(async (url) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      
      const res = await fetch(url, { 
        signal: controller.signal, 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' } 
      })
      clearTimeout(timeoutId)
      
      if (!res.ok) return null
      
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.startsWith('image/')) return null
      
      // Some PPTX viewers fail on webp, standard jpegs/pngs are safer but we embed everything we can get
      const format = contentType.split('/')[1] || 'jpeg'
      const arrayBuffer = await res.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      
      return `image/${format};base64,${base64}`
    } catch {
      return null
    }
  })

  // Harvest successful ones
  const results = await Promise.all(promises)
  for (const b64 of results) {
    if (b64) validImages.push(b64)
    if (validImages.length >= neededCount) break
  }
  
  return validImages
}

// ─── PPTX builder (with images) ─────────────────────────────────────────────
async function buildPptx(mainImageQuery, presentationTitle, slides, subtitle, conclusionBullets, theme) {
  const tc = THEMES[theme] || THEMES.minimal_light
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_16x9'
  pptx.author = 'DeckIQ'
  pptx.title = presentationTitle

  // Fetch all images explicitly mapped as verified Base64 Buffers!
  const images = await getValidBase64Images(mainImageQuery || presentationTitle || 'presentation', slides.length + 1)

  // Title slide (no image as requested)
  const ts = pptx.addSlide()
  ts.background = { color: tc.bg }
  ts.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: tc.accent } })
  ts.addShape('rect', { x: 0, y: 5.53, w: '100%', h: 0.1, fill: { color: tc.accent } })

  ts.addText(presentationTitle, { x: 0.6, y: 1.3, w: 8.8, h: 2.0, fontSize: 36, bold: true, color: tc.title, fontFace: tc.tf, align: 'center' })
  ts.addText(subtitle, { x: 0.6, y: 3.5, w: 8.8, h: 0.6, fontSize: 15, color: tc.accent, fontFace: tc.bf, align: 'center' })
  ts.addText('Generated by DeckIQ', { x: 0.6, y: 4.9, w: 8.8, h: 0.4, fontSize: 10, color: tc.body, fontFace: tc.bf, align: 'center' })

  // Content slides
  for (let i = 0; i < slides.length; i++) {
    const { title, bullets } = slides[i]
    const slide = pptx.addSlide()
    const imgData = images[i] || null

    slide.background = { color: tc.bg }
    slide.addShape('rect', { x: 0, y: 0, w: 0.08, h: 5.63, fill: { color: tc.accent } })

    if (imgData) {
      if (i % 2 === 0) {
        // Image on Right
        slide.addImage({ data: imgData, x: 5.8, y: 1.02, w: 3.7, h: 4.2, sizing: { type: 'cover' } })
        slide.addText(title, { x: 0.3, y: 0.22, w: 9.2, h: 0.75, fontSize: 24, bold: true, color: tc.title, fontFace: tc.tf })
        slide.addShape('line', { x: 0.3, y: 1.02, w: 5.2, h: 0, line: { color: tc.accent, width: 1 } })
        slide.addText(bullets.map(b => `• ${b}`).join('\n'), { x: 0.3, y: 1.18, w: 5.2, h: 4.1, fontSize: 15, color: tc.body, fontFace: tc.bf, valign: 'top', paraSpaceAfter: 8 })
      } else {
        // Image on Left
        slide.addImage({ data: imgData, x: 0.3, y: 1.02, w: 3.7, h: 4.2, sizing: { type: 'cover' } })
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

  const conclusionImg = images[slides.length] || null
  if (conclusionImg) {
    cs.addText('Key Takeaways', { x: 0.3, y: 0.22, w: 9.2, h: 0.75, fontSize: 24, bold: true, color: tc.title, fontFace: tc.tf })
    cs.addShape('line', { x: 0.3, y: 1.02, w: 5.2, h: 0, line: { color: tc.accent, width: 1 } })
    cs.addText(conclusionBullets.map(b => `• ${b}`).join('\n'), { x: 0.3, y: 1.18, w: 5.2, h: 4.1, fontSize: 16, color: tc.body, fontFace: tc.bf, valign: 'top', paraSpaceAfter: 14 })
    cs.addImage({ data: conclusionImg, x: 5.8, y: 1.02, w: 3.7, h: 4.2, sizing: { type: 'cover' } })
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

    let user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })
    
    // Give 100 free credits if user is out or doesn't have enough
    if (user.credits < 1) {
      user = await prisma.user.update({
        where: { id: payload.userId },
        data: { credits: 100 }
      })
    }

    // Deduct credit upfront — restored if generation fails
    await prisma.user.update({ where: { id: payload.userId }, data: { credits: { decrement: 1 } } })

    const stream = new ReadableStream({
      async start(controller) {
        const send = (data) => sendEvent(controller, data)
        try {
          send({ step: 1, message: 'Planning your slide structure...' })
          const { presentationTitle, subtitle, slides, conclusionBullets, suggestedTheme, mainImageQuery } = await generateContent(topic, Number(slideCount))

          send({ step: 2, message: 'Writing slide content...' })

          send({ step: 3, message: 'Finding perfect images...' })
          const previewImages = await fetchImagesFromSerper(mainImageQuery || presentationTitle || 'presentation', slides.length + 1)

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
              mainImageQuery,
              imageUrls: previewImages,
              slideCount: slides.length + 2,
            },
          })
          controller.close()
        } catch (err) {
          console.error('[deckiq:generate] Critical generation error:', err)
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
    const { topic, title: presentationTitle, subtitle, slides, conclusionBullets, mainImageQuery } = slidesData

    try {
      // Build PPTX with AI-generated title
      const buffer = await buildPptx(mainImageQuery || topic, presentationTitle || topic, slides, subtitle, conclusionBullets, theme)

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
      console.error('[deckiq:confirm] Critical error building/saving PPTX:', err)
      return NextResponse.json({ error: 'Failed to build presentation' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
