import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken, extractBearerToken } from '@/lib/auth'

export async function GET(request) {
  const token = extractBearerToken(request)
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let payload
  try {
    payload = verifyAccessToken(token)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit')) || 50

  const ppts = await prisma.pPT.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, title: true, theme: true, slideCount: true, fileUrl: true, createdAt: true },
  })

  return NextResponse.json({ ppts })
}

export async function DELETE(request) {
  const token = extractBearerToken(request)
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let payload
  try {
    payload = verifyAccessToken(token)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { pptId } = await request.json()
  if (!pptId) return NextResponse.json({ error: 'pptId required' }, { status: 400 })

  // Verify ownership
  const ppt = await prisma.pPT.findUnique({ where: { id: pptId } })
  if (!ppt || ppt.userId !== payload.userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Delete ratings first (FK constraint)
  await prisma.rating.deleteMany({ where: { pptId } })
  await prisma.pPT.delete({ where: { id: pptId } })

  return NextResponse.json({ success: true })
}

