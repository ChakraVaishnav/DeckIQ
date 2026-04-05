import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, credits: true, password: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const { password: _, ...safeUser } = user
    const access_token = signAccessToken({ userId: user.id, email: user.email })
    const refresh_token = signRefreshToken({ userId: user.id })

    const response = NextResponse.json({ access_token, user: safeUser })
    response.cookies.set('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

