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
          <div className="text-center py-6 px-4">
            <div className="w-16 h-16 bg-accent-subtle-light dark:bg-accent-subtle-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎉</span>
            </div>
            <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
              Payments Coming Soon!
            </h2>
            <p className="text-base text-light-text-muted dark:text-dark-text-muted mb-8 leading-relaxed max-w-sm mx-auto">
              We are not currently integrated with our payment provider yet. Because of this, we are giving everyone <strong className="text-accent-primary font-bold">100 free credits</strong> to generate unlimited presentations! <br/><span className="text-xs text-accent-primary mt-2 block uppercase tracking-wide font-medium">Limited offer only valid until end of April</span>
            </p>
            <button
              onClick={onClose}
              className="bg-accent-primary hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/20 outline-none text-white font-medium py-3 px-8 rounded-component transition-all duration-200 text-sm shadow-md"
            >
              Awesome, thanks!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

