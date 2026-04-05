import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { verifyAccessToken, extractBearerToken } from '@/lib/auth'

const PACKS = {
  starter: { amount: 1900, credits: 3, name: 'Starter' },
  pro: { amount: 4900, credits: 10, name: 'Pro' },
  power: { amount: 9900, credits: 25, name: 'Power' },
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request) {
  const token = extractBearerToken(request)
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    verifyAccessToken(token)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { pack } = await request.json()
  const packConfig = PACKS[pack]
  if (!packConfig) {
    return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })
  }

  try {
    const order = await razorpay.orders.create({
      amount: packConfig.amount,
      currency: 'INR',
      receipt: `deckiq_${pack}_${Date.now()}`,
      notes: { pack, credits: packConfig.credits },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: packConfig.amount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      credits: packConfig.credits,
      packName: packConfig.name,
    })
  } catch (err) {
    console.error('[create-order]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

