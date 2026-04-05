import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { verifyAccessToken, extractBearerToken } from '@/lib/auth'

const PACK_CREDITS = {
  starter: 3,
  pro: 10,
  power: 25,
}

export async function POST(request) {
  const token = extractBearerToken(request)
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let payload
  try {
    payload = verifyAccessToken(token)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, pack } = await request.json()

  // Verify HMAC signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  const creditsToAdd = PACK_CREDITS[pack]
  if (!creditsToAdd) {
    return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })
  }

  // Add credits to user
  const updatedUser = await prisma.user.update({
    where: { id: payload.userId },
    data: { credits: { increment: creditsToAdd } },
    select: { credits: true },
  })

  return NextResponse.json({ success: true, newCredits: updatedUser.credits })
}

