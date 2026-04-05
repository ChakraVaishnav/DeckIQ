'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

const PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 3,
    price: '₹19',
    priceNum: 1900,
    description: 'Perfect to try',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 10,
    price: '₹49',
    priceNum: 4900,
    description: 'Most Popular',
    popular: true,
  },
  {
    id: 'power',
    name: 'Power',
    credits: 25,
    price: '₹99',
    priceNum: 9900,
    description: 'Best value',
    popular: false,
  },
]

export default function BuyCreditsModal({ onClose, authFetch }) {
  const [loading, setLoading] = useState(null)
  const [success, setSuccess] = useState(null)
  const { user, login, accessToken } = useAuth()

  const handleBuy = async (pack) => {
    setLoading(pack.id)
    try {
      // Create order
      const orderRes = await authFetch('/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ pack: pack.id }),
      })

      if (!orderRes.ok) {
        alert('Failed to create order. Try again.')
        setLoading(null)
        return
      }

      const { orderId, keyId } = await orderRes.json()

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: pack.priceNum,
        currency: 'INR',
        name: 'DeckIQ',
        description: `${pack.credits} Generation Credits`,
        order_id: orderId,
        handler: async (response) => {
          // Verify payment
          const verifyRes = await authFetch('/api/payments/verify', {
            method: 'POST',
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              pack: pack.id,
            }),
          })

          if (verifyRes.ok) {
            const data = await verifyRes.json()
            setSuccess({ credits: pack.credits, newTotal: data.newCredits })
            // Update user in context
            if (user) {
              login(accessToken, { ...user, credits: data.newCredits })
            }
          } else {
            alert('Payment verification failed. Contact support.')
          }
        },
        prefill: { email: user?.email || '' },
        theme: { color: '#5B4CF5' },
        modal: { ondismiss: () => setLoading(null) },
      }

      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Load Razorpay script dynamically
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          const rzp = new window.Razorpay(options)
          rzp.open()
        }
        document.body.appendChild(script)
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card p-8 w-full max-w-lg"
        >
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Credits Added!
              </h3>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted">
                +{success.credits} credits added. You now have{' '}
                <span className="text-accent-primary font-medium">{success.newTotal} credits</span>.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-accent-primary hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-component transition-colors duration-150 text-sm"
              >
                Start Generating
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-light-text-primary dark:text-dark-text-primary">
                  Buy Credits
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-component text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {PACKS.map((pack) => (
                  <div
                    key={pack.id}
                    className={`relative text-center p-4 rounded-card border-2 transition-colors ${
                      pack.popular
                        ? 'border-accent-primary bg-accent-subtle-light dark:bg-accent-subtle-dark'
                        : 'border-light-text-muted/20 dark:border-dark-text-muted/20 bg-light-bg-primary dark:bg-dark-bg-primary'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-primary text-white text-xs px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
                      {pack.name}
                    </p>
                    <p className="text-3xl font-medium text-accent-primary mb-0.5">
                      {pack.credits}
                    </p>
                    <p className="text-xs text-light-text-muted dark:text-dark-text-muted mb-3">
                      credits
                    </p>
                    <p className="text-base font-medium text-light-text-primary dark:text-dark-text-primary mb-0.5">
                      {pack.price}
                    </p>
                    <p className="text-xs text-light-text-muted dark:text-dark-text-muted mb-3">
                      {pack.description}
                    </p>
                    <button
                      onClick={() => handleBuy(pack)}
                      disabled={loading !== null}
                      className={`w-full py-1.5 px-3 rounded-component text-xs font-medium transition-colors duration-150 ${
                        pack.popular
                          ? 'bg-accent-primary hover:bg-indigo-600 text-white disabled:opacity-60'
                          : 'border border-light-text-muted/30 dark:border-dark-text-muted/30 hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated text-light-text-primary dark:text-dark-text-primary disabled:opacity-60'
                      }`}
                    >
                      {loading === pack.id ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : 'Buy'}
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-light-text-muted dark:text-dark-text-muted">
                Payments powered by Razorpay. All purchases are non-refundable.
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

