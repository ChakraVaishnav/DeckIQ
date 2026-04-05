'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

const DeckIQLogo = () => (
  <span className="text-xl font-medium text-light-text-primary dark:text-dark-text-primary">
    Deck<span className="text-accent-primary">IQ</span>
  </span>
)

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '', general: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed) return

    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        const err = data.error || 'Something went wrong.'
        if (err.toLowerCase().includes('email')) setErrors({ email: err })
        else if (err.toLowerCase().includes('username')) setErrors({ username: err })
        else if (err.toLowerCase().includes('password')) setErrors({ password: err })
        else setErrors({ general: err })
        return
      }

      login(data.access_token, data.user)
      router.push('/dashboard')
    } catch {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = (field) =>
    `w-full bg-light-bg-primary dark:bg-dark-bg-primary border ${
      errors[field]
        ? 'border-red-500/50 focus:ring-red-500/30'
        : 'border-light-text-muted/30 dark:border-dark-text-muted/30 focus:ring-accent-primary/50 focus:border-accent-primary'
    } rounded-component px-4 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-muted/50 dark:placeholder:text-dark-text-muted/50 focus:outline-none focus:ring-2 transition-all`

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[420px]"
      >
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to home
        </Link>

        <div className="text-center mb-8">
          <Link href="/">
            <DeckIQLogo />
          </Link>
        </div>

        <div className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card p-8">
          <h1 className="text-2xl font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
            Create your account
          </h1>
          <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-6">
            Start with 3 free generations — no card needed
          </p>

          {errors.general && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-component text-sm text-red-400">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-text-muted dark:text-dark-text-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className={fieldClass('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-muted dark:text-dark-text-muted mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="yourname"
                required
                className={fieldClass('username')}
              />
              {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-muted dark:text-dark-text-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  className={`${fieldClass('password')} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-accent-primary cursor-pointer rounded"
              />
              <label htmlFor="terms" className="text-sm text-light-text-muted dark:text-dark-text-muted cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-accent-primary hover:underline font-medium">
                  Terms &amp; Conditions
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full bg-accent-primary hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-5 rounded-component transition-colors duration-150 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-light-text-muted dark:text-dark-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

