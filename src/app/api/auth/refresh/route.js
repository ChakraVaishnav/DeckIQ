import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyRefreshToken, signAccessToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token.' }, { status: 401 })
    }

    let payload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      return NextResponse.json({ error: 'Invalid or expired refresh token.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, username: true, credits: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 401 })
    }

    const access_token = signAccessToken({ userId: user.id, email: user.email })
    return NextResponse.json({ access_token, user })
  } catch (err) {
    console.error('[refresh]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

