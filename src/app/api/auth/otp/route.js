import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import dns from 'dns'

// Force IPv4 resolution to prevent ENETUNREACH errors with Gmail's IPv6
dns.setDefaultResultOrder('ipv4first')

// Simple helper to hash
const hashPassword = async (pass) => bcrypt.hash(pass, 10)

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

export async function POST(req) {
  try {
    const body = await req.json()
    const { action, email, otp, newPassword } = body

    if (!action || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 1. SEND OTP
    if (action === 'send') {
      // Clear old OTPs for this user
      await prisma.otp.deleteMany({ where: { userId: user.id } })

      // Generate 6 digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 mins

      await prisma.otp.create({
        data: {
          userId: user.id,
          code,
          expiresAt,
        },
      })

      // Send email
      try {
        await transporter.sendMail({
          from: `"DeckIQ Team" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Your DeckIQ Password Reset OTP',
          html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #5B4CF5;">DeckIQ Password Reset</h2>
              <p>Hello ${user.username},</p>
              <p>You requested to reset your password. Use the following OTP to proceed:</p>
              <div style="background: #f4f4f5; padding: 16px; text-align: center; font-size: 24px; letter-spacing: 4px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
                ${code}
              </div>
              <p>This code is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
              <p>If you did not request this, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 30px;" />
              <p style="font-size: 12px; color: #888;">DeckIQ Team</p>
            </div>
          `,
        })
      } catch (err) {
        console.error('Email send err:', err)
        return NextResponse.json({ error: 'Failed to send email. Check SMTP settings.' }, { status: 500 })
      }

      return NextResponse.json({ message: 'OTP sent successfully' })
    }

    // 2. VERIFY OTP
    if (action === 'verify') {
      if (!otp) return NextResponse.json({ error: 'OTP required' }, { status: 400 })

      const record = await prisma.otp.findFirst({
        where: { userId: user.id, code: otp },
      })

      if (!record || record.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
      }

      return NextResponse.json({ message: 'OTP verified' })
    }

    // 3. RESET PASSWORD
    if (action === 'reset') {
      if (!otp || !newPassword) return NextResponse.json({ error: 'OTP and new password required' }, { status: 400 })

      const record = await prisma.otp.findFirst({
        where: { userId: user.id, code: otp },
      })

      if (!record || record.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
      }

      const hashedPassword = await hashPassword(newPassword)

      // Update password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      })

      // Delete used OTP
      await prisma.otp.deleteMany({ where: { userId: user.id } })

      return NextResponse.json({ message: 'Password updated successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (err) {
    console.error('[OTP API error]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
