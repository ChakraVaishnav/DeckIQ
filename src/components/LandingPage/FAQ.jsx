'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const FAQS = [
  {
    q: 'What is DeckIQ?',
    a: 'DeckIQ is an AI-powered presentation generator. Enter a topic, pick a theme, and get a fully designed .pptx file in seconds — ready to use in PowerPoint, Google Slides, or Keynote.',
  },
  {
    q: 'How many free generations do I get?',
    a: 'Every new account starts with 3 free credits — no card required. Use them to try DeckIQ before you decide to buy more.',
  },
  {
    q: 'What is 1 credit?',
    a: '1 credit = 1 PPT generation, regardless of slide count. Whether you generate 5 slides or 15, it costs 1 credit.',
  },
  {
    q: 'Can I choose my own theme?',
    a: 'Yes. DeckIQ suggests the best theme automatically based on your topic, but you can override and pick any of our 20+ professional themes.',
  },
  {
    q: 'What format is the output?',
    a: 'You get a standard .pptx file that works natively with Microsoft PowerPoint, Google Slides, and Apple Keynote.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. Your generated files are stored securely in the cloud and only accessible to your account. We do not share or sell your data.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-light-text-muted/10 dark:border-dark-text-muted/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-4 text-left gap-4 group"
      >
        <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary group-hover:text-accent-primary transition-colors">
          {q}
        </span>
        <span className={`flex-shrink-0 w-5 h-5 text-light-text-muted dark:text-dark-text-muted transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <section className="py-20 bg-light-bg-elevated/30 dark:bg-dark-bg-elevated/10">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}


