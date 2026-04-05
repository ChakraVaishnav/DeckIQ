'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 3,
    price: '₹19',
    desc: 'Perfect to try',
    cta: 'Get Starter',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 10,
    price: '₹49',
    desc: 'Most Popular',
    cta: 'Get Pro',
    popular: true,
  },
  {
    id: 'power',
    name: 'Power',
    credits: 25,
    price: '₹99',
    desc: 'Best value',
    cta: 'Get Power',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-light-bg-elevated/50 dark:bg-dark-bg-elevated/20">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-xl mx-auto">
            Start free. Buy credits only when you need more.
          </p>
        </motion.div>

        {/* Free tier note */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-subtle-light dark:bg-accent-subtle-dark border border-accent-primary/20 rounded-full text-sm text-accent-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
              <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
            Every new account gets 3 free generations to start
          </span>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {PACKS.map((pack) => (
            <motion.div
              key={pack.id}
              variants={fadeUp}
              className={`relative text-center bg-light-bg-surface dark:bg-dark-bg-surface rounded-card p-6 border-2 transition-colors ${
                pack.popular
                  ? 'border-accent-primary shadow-accent-primary/10 shadow-lg'
                  : 'border-light-text-muted/20 dark:border-dark-text-muted/20'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                  <span className="bg-accent-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-md font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
                {pack.name}
              </h3>

              <div className="text-5xl font-medium text-accent-primary mb-1">
                {pack.credits}
              </div>
              <div className="text-sm text-light-text-muted dark:text-dark-text-muted mb-4">
                credits
              </div>

              <div className="text-2xl font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
                {pack.price}
              </div>
              <div className="text-xs text-light-text-muted dark:text-dark-text-muted mb-6">
                {pack.desc}
              </div>

              <Link
                href="/signup"
                className={`block w-full py-2.5 px-4 rounded-component text-sm font-medium transition-colors duration-150 ${
                  pack.popular
                    ? 'bg-accent-primary hover:bg-indigo-600 text-white'
                    : 'border border-light-text-muted/30 dark:border-dark-text-muted/30 hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated text-light-text-primary dark:text-dark-text-primary'
                }`}
              >
                {pack.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-xs text-light-text-muted dark:text-dark-text-muted mt-8"
        >
          1 credit = 1 presentation, regardless of slide count. All purchases non-refundable.
        </motion.p>
      </div>
    </section>
  )
}


