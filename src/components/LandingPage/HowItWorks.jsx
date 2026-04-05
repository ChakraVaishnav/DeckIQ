'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const STEPS = [
  {
    num: '01',
    title: 'Enter your topic',
    desc: 'Type what your presentation is about and choose how many slides you need. DeckIQ handles the rest.',
  },
  {
    num: '02',
    title: 'Pick a theme',
    desc: 'Browse 20+ professional themes — from dark tech to minimal light. Or let DeckIQ auto-select the best fit.',
  },
  {
    num: '03',
    title: 'Download your deck',
    desc: 'Your AI-generated .pptx file is ready in seconds. Open it in PowerPoint, Google Slides, or Keynote.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
            Three steps to your perfect deck
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-xl mx-auto">
            From idea to polished presentation in under a minute.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 rounded-card p-6 relative overflow-hidden"
            >
              {/* Background step number */}
              <div
                className="absolute -bottom-4 -right-2 text-8xl font-medium text-accent-primary/8 dark:text-accent-primary/10 select-none leading-none pointer-events-none"
                aria-hidden
              >
                {step.num}
              </div>

              <div className="w-10 h-10 rounded-component bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center mb-4">
                <span className="text-accent-primary text-sm font-medium">{step.num}</span>
              </div>

              <h3 className="text-md font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


