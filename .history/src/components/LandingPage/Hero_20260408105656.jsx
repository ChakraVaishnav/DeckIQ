'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 2a10 10 0 0 1 10 10" />
        <circle cx="12" cy="12" r="6" /><path d="M12 8v8M8 12h8" />
      </svg>
    ),
    title: 'AI Slide Content',
    desc: 'Researches and writes concise, relevant bullet points for every slide automatically.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: 'Google Image Integration',
    desc: 'Automatically pairs relevant contextual images out of billions of search results via Serper API.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'Multiple Themes',
    desc: '20+ professional design themes ranging from dark tech to minimal, creative, and more.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Web Search Powered',
    desc: 'Real-time web research ensures your slides contain accurate, up-to-date information.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: 'Instant Download',
    desc: 'Your fully formatted .pptx file is delivered within seconds — ready to present anywhere.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V22H4V12" />
        <path d="M22 7H2v5h20V7z" />
        <path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    title: 'Credit System',
    desc: 'Start with 100 free credits to test the full power of our engine before committing to any subscriptions.',
  },
]

// Phase boundaries:
// 0.00 – 0.10 : fake deck fades in, cards are invisible
// 0.10 – 0.25 : fake deck fades OUT, 3 step cards spread in
// 0.25 – 0.45 : 3 step cards hold steady, heading = "Three steps…"
// 0.45 – 0.60 : 3 cards split → 6 feature cards emerge from behind each; heading morphs
// 0.60 – 1.00 : feature cards hold

function ScrollSequence() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Fake deck ──────────────────────────────────────────────────────────────
  // Visible only at the very start, gone before cards spread
  const deckOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.28], [0, 1, 1, 0])
  const deckScale = useTransform(scrollYProgress, [0, 0.08, 0.22, 0.28], [0.92, 1, 1, 0.85])
  const deckY = useTransform(scrollYProgress, [0, 0.08], [20, 0])

  // ── Section headings ──────────────────────────────────────────────────────
  const stepsTitleOpacity = useTransform(
    scrollYProgress, [0.12, 0.20, 0.42, 0.50], [0, 1, 1, 0]
  )
  const stepsTitleY = useTransform(scrollYProgress, [0.12, 0.20], [24, 0])

  const featuresTitleOpacity = useTransform(
    scrollYProgress, [0.50, 0.60], [0, 1]
  )
  const featuresTitleY = useTransform(scrollYProgress, [0.50, 0.60], [24, 0])

  // ── 3 Step cards ──────────────────────────────────────────────────────────
  // Cards stay visible, then move out of screen before fading
  const stepOpacity = useTransform(
    scrollYProgress, [0.18, 0.28, 0.55, 0.60], [0, 1, 1, 0]
  )
  const stepY = useTransform(scrollYProgress, [0.18, 0.28], [40, 0])
  const stepScale = useTransform(scrollYProgress, [0.18, 0.28], [0.82, 1])

  // Step card motion values (avoid calling hooks inside render loops)
  // Card 1: spreads left then exits off-screen left
  const step1X = useTransform(scrollYProgress, [0.18, 0.30, 0.40, 0.55], [0, -380, -380, -1200])
  const step1Rotate = useTransform(scrollYProgress, [0.18, 0.40, 0.55], [0, 0, -45])

  // Card 2: stays centered then exits off-screen top and scales down
  const step2X = useTransform(scrollYProgress, [0.18, 0.30], [0, 0])
  const step2Y = useTransform(scrollYProgress, [0.18, 0.28, 0.40, 0.55], [40, 0, 0, -900])
  const step2Scale = useTransform(scrollYProgress, [0.18, 0.28, 0.40, 0.55], [0.82, 1, 1, 0.4])

  // Card 3: spreads right then exits off-screen right
  const step3X = useTransform(scrollYProgress, [0.18, 0.30, 0.40, 0.55], [0, 380, 380, 1200])
  const step3Rotate = useTransform(scrollYProgress, [0.18, 0.40, 0.55], [0, 0, 45])

  // ── Feature cards (6 cards, start stacked in the center then fan out) ──────
  const featureGroupOpacity = useTransform(scrollYProgress, [0.46, 0.52], [0, 1])
  const featureT = useTransform(scrollYProgress, [0.46, 0.66], [0, 1])

  const clamp01 = (v) => Math.min(1, Math.max(0, v))
  const staggerT = (v, index) => {
    const start = index * 0.09
    const end = start + 0.45
    return clamp01((v - start) / (end - start))
  }

  // Final 3×2 positions (relative offsets from center).
  // These values are tuned for the current canvas width.
  const pos = [
    { x: -320, y: -150 },
    { x: 0, y: -150 },
    { x: 320, y: -150 },
    { x: -320, y: 150 },
    { x: 0, y: 150 },
    { x: 320, y: 150 },
  ]

  const f0t = useTransform(featureT, (v) => staggerT(v, 0))
  const f1t = useTransform(featureT, (v) => staggerT(v, 1))
  const f2t = useTransform(featureT, (v) => staggerT(v, 2))
  const f3t = useTransform(featureT, (v) => staggerT(v, 3))
  const f4t = useTransform(featureT, (v) => staggerT(v, 4))
  const f5t = useTransform(featureT, (v) => staggerT(v, 5))

  const f0x = useTransform(f0t, [0, 1], [0, pos[0].x])
  const f0y = useTransform(f0t, [0, 1], [0, pos[0].y])
  const f0s = useTransform(f0t, [0, 1], [0.06, 1])
  const f0o = useTransform(f0t, [0, 1], [0, 1])

  const f1x = useTransform(f1t, [0, 1], [0, pos[1].x])
  const f1y = useTransform(f1t, [0, 1], [0, pos[1].y])
  const f1s = useTransform(f1t, [0, 1], [0.06, 1])
  const f1o = useTransform(f1t, [0, 1], [0, 1])

  const f2x = useTransform(f2t, [0, 1], [0, pos[2].x])
  const f2y = useTransform(f2t, [0, 1], [0, pos[2].y])
  const f2s = useTransform(f2t, [0, 1], [0.06, 1])
  const f2o = useTransform(f2t, [0, 1], [0, 1])

  const f3x = useTransform(f3t, [0, 1], [0, pos[3].x])
  const f3y = useTransform(f3t, [0, 1], [0, pos[3].y])
  const f3s = useTransform(f3t, [0, 1], [0.06, 1])
  const f3o = useTransform(f3t, [0, 1], [0, 1])

  const f4x = useTransform(f4t, [0, 1], [0, pos[4].x])
  const f4y = useTransform(f4t, [0, 1], [0, pos[4].y])
  const f4s = useTransform(f4t, [0, 1], [0.06, 1])
  const f4o = useTransform(f4t, [0, 1], [0, 1])

  const f5x = useTransform(f5t, [0, 1], [0, pos[5].x])
  const f5y = useTransform(f5t, [0, 1], [0, pos[5].y])
  const f5s = useTransform(f5t, [0, 1], [0.06, 1])
  const f5o = useTransform(f5t, [0, 1], [0, 1])

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative h-[500vh] bg-light-bg-primary dark:bg-dark-bg-primary"
    >
      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden overflow-x-clip"
        style={{ perspective: '1200px' }}
      >

        {/* ── "Three steps" heading ── */}
        <motion.div
          style={{ opacity: stepsTitleOpacity, y: stepsTitleY, position: 'absolute', top: '13%' }}
          className="text-center px-6 w-full pointer-events-none"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
            Three steps to your perfect deck
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-xl mx-auto">
            From idea to polished presentation in under a minute.
          </p>
        </motion.div>

        {/* ── "Features" heading ── */}
        <motion.div
          style={{ opacity: featuresTitleOpacity, y: featuresTitleY, position: 'absolute', top: '10%' }}
          className="text-center px-6 w-full pointer-events-none"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
            Features
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-2xl mx-auto">
            Everything you need to present better
          </p>
        </motion.div>

        {/* ── Canvas ── */}
        <div className="relative w-full max-w-275 mx-auto mt-20 h-130 flex items-center justify-center" style={{ perspective: '1200px' }}>

          {/* ─── Fake PPT deck (only visible at start, gone before cards spread) ─── */}
          <motion.div
            style={{ y: deckY, scale: deckScale, opacity: deckOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-dark-bg-surface border border-dark-text-muted/20 rounded-card overflow-hidden shadow-xl z-20 will-change-transform"
          >
            <div className="h-1.5 bg-accent-primary" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded bg-accent-primary/20 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B4CF5" strokeWidth="2.5">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">The Future of Climate Technology</div>
                  <div className="text-dark-text-muted text-xs mt-0.5">Generated by DeckIQ</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  {['Renewable innovation', 'Carbon capture tech', 'Smart grid systems'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0" />
                      <div className="text-xs text-dark-text-muted">{item}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-dark-bg-elevated rounded-component p-3">
                  <div className="flex items-end gap-1 h-12">
                    {[40, 65, 45, 80, 70, 90, 75].map((h, i) => (
                      <div key={i} className="flex-1 bg-accent-primary/60 rounded-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="text-2xs text-dark-text-muted mt-1 text-center">Growth 2020–2026</div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-dark-text-muted/10 pt-3">
                <div className="flex gap-2">
                  {['Dark Tech', '10 slides'].map((tag, i) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? 'bg-accent-primary/20 text-accent-primary' : 'bg-dark-bg-elevated text-dark-text-muted'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-2xs text-dark-text-muted">2 / 10</div>
              </div>
            </div>
          </motion.div>

          {/* ─── 3 Step cards ─────────────────────────────────────────────────── */}
          {/* Card 1 exits left, Card 2 exits up, Card 3 exits right */}
          {[
            { x: step1X, y: stepY, scale: stepScale, rotate: step1Rotate },
            { x: step2X, y: step2Y, scale: step2Scale, rotate: 0 },
            { x: step3X, y: stepY, scale: stepScale, rotate: step3Rotate },
          ].map((mv, i) => (
            <motion.div
              key={STEPS[i].num}
              style={{
                x: mv.x,
                y: mv.y,
                scale: mv.scale,
                opacity: stepOpacity,
                rotate: mv.rotate,
                position: 'absolute',
                willChange: 'transform, opacity',
                zIndex: 20,
              }}
              className="w-72 bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 rounded-card p-6 shadow-xl origin-center"
            >
              <div className="absolute -bottom-4 -right-2 text-8xl font-medium text-accent-primary/8 dark:text-accent-primary/10 select-none leading-none pointer-events-none">
                {STEPS[i].num}
              </div>
              <div className="w-10 h-10 rounded-component bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center mb-4">
                <span className="text-accent-primary text-sm font-medium">{STEPS[i].num}</span>
              </div>
              <h3 className="text-md font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                {STEPS[i].title}
              </h3>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
                {STEPS[i].desc}
              </p>
            </motion.div>
          ))}

          {/* ─── 6 Feature cards (Start from CENTER then go to positions) ─────── */}
          <motion.div
            style={{
              opacity: featureGroupOpacity,
              position: 'absolute',
              willChange: 'transform, opacity',
              zIndex: 10,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="grid grid-cols-3 gap-6 w-full max-w-240 px-4">
              {FEATURES.map((f, i) => {
                const mv =
                  i === 0 ? { x: f0x, y: f0y, scale: f0s, opacity: f0o } :
                  i === 1 ? { x: f1x, y: f1y, scale: f1s, opacity: f1o } :
                  i === 2 ? { x: f2x, y: f2y, scale: f2s, opacity: f2o } :
                  i === 3 ? { x: f3x, y: f3y, scale: f3s, opacity: f3o } :
                  i === 4 ? { x: f4x, y: f4y, scale: f4s, opacity: f4o } :
                  { x: f5x, y: f5y, scale: f5s, opacity: f5o }

                return (
                  <motion.div
                    key={f.title}
                    style={{
                      x: mv.x,
                      y: mv.y,
                      scale: mv.scale,
                      opacity: mv.opacity,
                      willChange: 'transform, opacity',
                    }}
                    className="group bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 hover:border-accent-primary/30 rounded-card p-5 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center text-accent-primary mb-4">
                      {f.icon}
                    </div>
                    <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                      {f.title}
                    </h3>
                    <p className="text-xs text-light-text-muted dark:text-dark-text-muted leading-relaxed">
                      {f.desc}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default function Hero() {
  return (
    <>
      <section className="relative pt-32 pb-32 bg-light-bg-primary dark:bg-dark-bg-primary overflow-x-hidden">
        <div className="relative w-full px-6 sm:px-10 lg:px-16 flex flex-col items-center mt-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-subtle-light dark:bg-accent-subtle-dark border border-accent-primary/20 text-accent-primary text-xs font-medium mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                AI-Powered Presentations
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-hero font-medium text-light-text-primary dark:text-dark-text-primary leading-tight max-w-4xl mb-6 relative z-10"
              style={{ lineHeight: 1.15 }}
            >
              Create Stunning Decks,
              <br />
              <span className="text-accent-primary">Powered by Intelligence.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-xl mb-8 leading-relaxed relative z-10"
            >
              Pick a topic. Choose a theme. DeckIQ researches, designs, and builds
              your presentation — in seconds.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 mb-4 relative z-10">
              <Link
                href="/signup"
                className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-3 px-7 rounded-component transition-colors duration-150 text-sm whitespace-nowrap"
              >
                Generate Your First Deck →
              </Link>
              <button
                onClick={() => {
                  document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="border border-light-text-muted/30 dark:border-dark-text-muted/30 hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated text-light-text-primary dark:text-dark-text-primary py-3 px-7 rounded-component transition-colors duration-150 text-sm whitespace-nowrap"
              >
                See How It Works
              </button>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm font-medium text-accent-primary mb-12 relative z-10">
              🎉 Limited Offer: 100 FREE credits for new users (valid until end of April)
            </motion.p>
          </motion.div>
        </div>
      </section>

      <ScrollSequence />
    </>
  )
}