'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar'
import Footer from '@/components/LandingPage/Footer'
import { useAuth } from '@/context/AuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function ProfileContent() {
  const { user, authFetch } = useAuth()
  
  // Normal change password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  // Forgot password flow state
  const [isForgotMode, setIsForgotMode] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  const handleNormalChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    setLoading(true)
    setMsg({ type: '', text: '' })

    try {
      const res = await authFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to change password')
      
      setMsg({ type: 'success', text: 'Password successfully updated!' })
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    }
    setLoading(false)
  }

  const handleSendOtp = async () => {
    setLoading(true)
    setMsg({ type: '', text: '' })
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: user.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP')
      
      setOtpSent(true)
      setMsg({ type: 'success', text: 'OTP sent to your email.' })
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    }
    setLoading(false)
  }

  const handleResetWithOtp = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    setLoading(true)
    setMsg({ type: '', text: '' })
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', email: user.email, otp, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')
      
      setMsg({ type: 'success', text: 'Password reset successfully!' })
      setIsForgotMode(false)
      setOtpSent(false)
      setOtp(''); setNewPassword(''); setConfirmPassword('')
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    }
    setLoading(false)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-3xl font-medium text-light-text-primary dark:text-dark-text-primary">
            Profile Settings
          </h1>
          <p className="mt-1.5 text-sm text-light-text-muted dark:text-dark-text-muted">
            Manage your account and security settings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* USER DETAILS */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="md:col-span-1 space-y-6">
            <div className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card p-6">
              <div className="w-16 h-16 rounded-full bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center mb-4 text-accent-primary font-bold text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {user.username}
              </h2>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-4">
                {user.email}
              </p>
              
              <div className="pt-4 border-t border-light-text-muted/10 dark:border-dark-text-muted/10">
                <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Available Credits</p>
                <p className="text-2xl font-bold text-accent-primary">{user.credits}</p>
              </div>
            </div>
          </motion.div>

          {/* PASSWORD SETTINGS */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="md:col-span-2">
            <div className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card p-6 md:p-8">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-1">
                Change Password
              </h3>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-6">
                Ensure your account is using a long, random password to stay secure.
              </p>

              {msg.text && (
                <div className={`p-4 rounded-component mb-6 text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'}`}>
                  {msg.text}
                </div>
              )}

              <AnimatePresence mode="wait">
                {!isForgotMode ? (
                  <motion.form key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleNormalChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="w-full bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          required minLength={6}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required minLength={6}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="w-full bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <button type="button" onClick={() => { setIsForgotMode(true); setMsg({ type:'', text:'' }); setCurrentPassword('') }} className="text-sm text-accent-primary hover:underline">
                        Forgot current password?
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-component transition-colors text-sm disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Password'}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {!otpSent ? (
                      <div className="space-y-4">
                        <p className="text-sm text-light-text-muted dark:text-dark-text-muted">
                          We will send a 6-digit OTP to <strong>{user.email}</strong>.
                        </p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-component transition-colors text-sm disabled:opacity-50"
                          >
                            {loading ? 'Sending...' : 'Send OTP'}
                          </button>
                          <button onClick={() => { setIsForgotMode(false); setMsg({ type:'', text:'' }) }} className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleResetWithOtp} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                            Enter OTP
                          </label>
                          <input
                            type="text"
                            required maxLength={6}
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="123456"
                            className="w-full bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all outline-none tracking-widest font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                              New Password
                            </label>
                            <input
                              type="password"
                              required minLength={6}
                              value={newPassword}
                              onChange={e => setNewPassword(e.target.value)}
                              className="w-full bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              required minLength={6}
                              value={confirmPassword}
                              onChange={e => setConfirmPassword(e.target.value)}
                              className="w-full bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-component transition-colors text-sm disabled:opacity-50"
                          >
                            {loading ? 'Verifying...' : 'Reset Password'}
                          </button>
                          <button type="button" onClick={() => { setIsForgotMode(false); setOtpSent(false); setMsg({ type:'', text:'' }) }} className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary">
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
