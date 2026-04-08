import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, username, password } = await request.json()

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Check uniqueness
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })
    if (existing) {
      if (existing.email === email) {
        return NextResponse.json({ error: 'Email already in use.' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Username already taken.' }, { status: 409 })
    }

    // Hash and create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword, credits: 100 },
      select: { id: true, email: true, username: true, credits: true },
    })

    // Generate tokens
    const access_token = signAccessToken({ userId: user.id, email: user.email })
    const refresh_token = signRefreshToken({ userId: user.id })

    // Build response with refresh token as HttpOnly cookie
    const response = NextResponse.json({ access_token, user }, { status: 201 })
    response.cookies.set('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

