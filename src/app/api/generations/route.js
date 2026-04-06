import { NextResponse } from 'next/server'
import { verifyAccessToken, extractBearerToken } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const payload = await verifyAccessToken(extractBearerToken(req))
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined

    const ppts = await prisma.pPT.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        theme: true,
        slideCount: true,
        fileUrl: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ ppts })
  } catch (error) {
    console.error('[deckiq:generations] GET Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const payload = await verifyAccessToken(extractBearerToken(req))
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { pptId } = body
    if (!pptId) return NextResponse.json({ error: 'pptId is required' }, { status: 400 })

    const ppt = await prisma.pPT.findUnique({ where: { id: pptId } })
    if (!ppt) return NextResponse.json({ error: 'Presentation not found' }, { status: 404 })

    if (ppt.userId !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
      const urlParts = ppt.fileUrl.split('/deckiq-ppts/')
      if (urlParts.length === 2) {
        const filePath = urlParts[1]
        await supabaseAdmin.storage.from('deckiq-ppts').remove([filePath])
      }
    } catch {
       // Silent fail for storage deletion, let DB delete proceed
    }

    await prisma.pPT.delete({ where: { id: pptId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[deckiq:generations] DELETE Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
