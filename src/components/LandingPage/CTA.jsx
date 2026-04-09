'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function CTA() {
  return (
    <section className="py-20 bg-light-bg-surface dark:bg-dark-bg-surface relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-accent-primary/6 dark:bg-accent-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-6 sm:px-10 lg:px-16 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl sm:text-3xl font-medium text-light-text-primary dark:text-dark-text-primary mb-4" style={{ lineHeight: 1.15 }}>
            Your next great presentation starts here.
          </h2>
          <Link
            href="/signup"
            className="inline-block bg-accent-primary hover:bg-indigo-600 text-white font-medium py-3.5 px-8 rounded-component transition-colors duration-150 text-base"
          >
            Start for Free — No Card Needed
          </Link>
          <p className="mt-3 text-xs text-light-text-muted dark:text-dark-text-muted">
            3 free generations on signup.
          </p>
        </motion.div>
      </div>
    </section>
  )
}


