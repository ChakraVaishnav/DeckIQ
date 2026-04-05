'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
}

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/>
        <circle cx="12" cy="12" r="6"/><path d="M12 8v8M8 12h8"/>
      </svg>
    ),
    title: 'AI Slide Content',
    desc: 'Researches and writes concise, relevant bullet points for every slide automatically.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    title: 'Pexels Image Integration',
    desc: 'Automatically adds high-quality, relevant images to slides via Pexels API.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: 'Multiple Themes',
    desc: '20+ professional design themes ranging from dark tech to minimal, creative, and more.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Web Search Powered',
    desc: 'Real-time web research ensures your slides contain accurate, up-to-date information.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    title: 'Instant Download',
    desc: 'Your fully formatted .pptx file is delivered within seconds — ready to present anywhere.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V22H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    title: 'Credit System',
    desc: 'Start with 3 free credits. Pay only for what you use — no subscriptions, no surprises.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-light-bg-elevated/50 dark:bg-dark-bg-elevated/20">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
            Everything you need to present better
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-xl mx-auto">
            DeckIQ packs a full presentation workflow into a single, simple tool.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="group bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 hover:border-accent-primary/30 rounded-card p-5 transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center text-accent-primary mb-4">
                {f.icon}
              </div>
              <h3 className="text-md font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


