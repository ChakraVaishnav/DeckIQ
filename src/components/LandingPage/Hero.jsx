'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
// 0.00 – 0.30 : "Three steps" visible (no animation)
// 0.30 – 0.50 : All 3 cards hold and showcase (no animation)
// 0.50 – 0.60 : All 3 cards exit together (scale + fade)
// 0.60 – 0.70 : Features heading fades in
// 0.70 – 1.00 : All 6 feature cards spawn with epic stagger + scale

function ScrollSequence() {
  const containerRef = useRef(null)
  const step1Ref = useRef(null)
  const step2Ref = useRef(null)
  const step3Ref = useRef(null)
  const stepsTitleRef = useRef(null)
  const featuresTitleRef = useRef(null)
  const featuresContainerRef = useRef(null)
  const featureCardsRef = useRef([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,       // ← heavier scrub = feels slower and more deliberate
        markers: false,
      },
    })

    // Steps visible from 0–0.30, set initial state
    if (stepsTitleRef.current) {
      gsap.set(stepsTitleRef.current, { opacity: 1, y: 0 })
      tl.to(stepsTitleRef.current, { opacity: 0, y: -30, duration: 0.1 }, 0.30)
    }

    if (step1Ref.current) {
      gsap.set(step1Ref.current, { opacity: 1, x: 0, y: 0, rotateZ: 0, scale: 1 })
      // Flies left + rotates
      tl.to(step1Ref.current, {
        opacity: 0, x: -220, y: -60, rotateZ: -25, scale: 0.7,
        duration: 0.14, ease: 'power2.in',
      }, 0.30)
    }

    if (step2Ref.current) {
      gsap.set(step2Ref.current, { opacity: 1, x: 0, y: 0, rotateX: 0, scale: 1 })
      // Flips straight up (3D flip)
      tl.to(step2Ref.current, {
        opacity: 0, y: -240, rotateX: 45, scale: 0.8,
        duration: 0.14, ease: 'power2.in',
      }, 0.34)   // slight stagger
    }

    if (step3Ref.current) {
      gsap.set(step3Ref.current, { opacity: 1, x: 0, y: 0, rotateZ: 0, scale: 1 })
      // Flies right + rotates opposite
      tl.to(step3Ref.current, {
        opacity: 0, x: 220, y: -60, rotateZ: 25, scale: 0.7,
        duration: 0.14, ease: 'power2.in',
      }, 0.38)   // slight stagger
    }

    // Features title fades in slowly
    if (featuresTitleRef.current) {
      tl.fromTo(featuresTitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.18 },
        0.50
      )
    }

    // Features container
    if (featuresContainerRef.current) {
      tl.fromTo(featuresContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.08 },
        0.62
      )
    }

    // Feature cards: FLIP IN from rotateX (card-turning effect)
    if (featureCardsRef.current.length > 0) {
      featureCardsRef.current.forEach((card, index) => {
        tl.fromTo(card,
          {
            opacity: 0,
            rotateX: 65,          // ← starts face-down, flips toward viewer
            y: 30,
            scale: 0.75,
            transformOrigin: 'center top',
            transformPerspective: 600,
          },
          {
            opacity: 1,
            rotateX: 0,
            y: 0,
            scale: 1,
            duration: 0.22,       // ← slow and satisfying
            ease: 'power3.out',
            transformOrigin: 'center top',
            transformPerspective: 600,
          },
          0.65 + index * 0.10    // ← 0.10 stagger between each card
        )
      })
    }

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-[400vh] bg-light-bg-primary dark:bg-dark-bg-primary"
    >
      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-32 pb-12 overflow-hidden overflow-x-clip"
        style={{ perspective: '1200px' }}
      >
        {/* ── "Three steps" heading ── */}
        <div
          ref={stepsTitleRef}
          className="text-center px-6 w-full pointer-events-none absolute top-[20%]"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
            Three steps to your perfect deck
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-xl mx-auto">
            From idea to polished presentation in under a minute.
          </p>
        </div>

        {/* ── "Features" heading ── */}
        <div
          ref={featuresTitleRef}
          className="text-center px-6 w-full pointer-events-none absolute top-[12%]"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
            Features
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-2xl mx-auto">
            Everything you need to present better
          </p>
        </div>

        {/* ── Canvas ── */}
        <div className="relative w-full max-w-275 mx-auto mt-8 h-100 flex items-center justify-center" style={{ perspective: '1200px' }}>
          {/* ─── Step 1 (Left) ─── */}
          <div
            ref={step1Ref}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 rounded-card p-6 shadow-xl z-20"
            style={{ marginLeft: '-420px' }}
          >
            <div className="absolute -bottom-4 -right-2 text-8xl font-medium text-accent-primary/8 dark:text-accent-primary/10 select-none leading-none pointer-events-none">
              {STEPS[0].num}
            </div>
            <div className="w-10 h-10 rounded-component bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center mb-4">
              <span className="text-accent-primary text-sm font-medium">{STEPS[0].num}</span>
            </div>
            <h3 className="text-md font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              {STEPS[0].title}
            </h3>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
              {STEPS[0].desc}
            </p>
          </div>

          {/* ─── Step 2 (Center) ─── */}
          <div
            ref={step2Ref}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 rounded-card p-6 shadow-xl z-20"
          >
            <div className="absolute -bottom-4 -right-2 text-8xl font-medium text-accent-primary/8 dark:text-accent-primary/10 select-none leading-none pointer-events-none">
              {STEPS[1].num}
            </div>
            <div className="w-10 h-10 rounded-component bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center mb-4">
              <span className="text-accent-primary text-sm font-medium">{STEPS[1].num}</span>
            </div>
            <h3 className="text-md font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              {STEPS[1].title}
            </h3>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
              {STEPS[1].desc}
            </p>
          </div>

          {/* ─── Step 3 (Right) ─── */}
          <div
            ref={step3Ref}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 rounded-card p-6 shadow-xl z-20"
            style={{ marginLeft: '420px' }}
          >
            <div className="absolute -bottom-4 -right-2 text-8xl font-medium text-accent-primary/8 dark:text-accent-primary/10 select-none leading-none pointer-events-none">
              {STEPS[2].num}
            </div>
            <div className="w-10 h-10 rounded-component bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center mb-4">
              <span className="text-accent-primary text-sm font-medium">{STEPS[2].num}</span>
            </div>
            <h3 className="text-md font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              {STEPS[2].title}
            </h3>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
              {STEPS[2].desc}
            </p>
          </div>

          {/* ─── Feature Cards Grid ─── */}
          <div
            ref={featuresContainerRef}
            className="absolute inset-0 flex items-center justify-center w-full z-30"
          >
            <div className="grid grid-cols-3 gap-6 w-full max-w-240 px-4">
              {FEATURES.map((f, idx) => (
                <div
                  key={f.title}
                  ref={(el) => {
                    if (el) featureCardsRef.current[idx] = el
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StaticHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-light-bg-primary dark:bg-dark-bg-primary py-20"
    >
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
            Three steps to your perfect deck
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-xl mx-auto">
            From idea to polished presentation in under a minute.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="relative bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 rounded-card p-6 shadow-lg"
            >
              <div className="absolute -bottom-4 -right-2 text-8xl font-medium text-accent-primary/8 dark:text-accent-primary/10 select-none leading-none pointer-events-none">
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
            </div>
          ))}
        </div>

        <div className="text-center mt-14 mb-8">
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
            Features
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-2xl mx-auto">
            Everything you need to present better
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 rounded-card p-5 shadow-lg"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = () => setIsMobile(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <>
      {/* Hero Section with 2-Column Layout */}
      <section className="relative pt-40 pb-32 bg-light-bg-primary dark:bg-dark-bg-primary overflow-x-hidden">
        <div className="relative w-full px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Column - Text Content */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col justify-center"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-subtle-light dark:bg-accent-subtle-dark border border-accent-primary/20 text-accent-primary text-xs font-medium mb-6 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                  AI-Powered Presentations
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl font-medium text-light-text-primary dark:text-dark-text-primary leading-tight mb-6"
              >
                Create Stunning Decks,
                <br />
                <span className="text-accent-primary">Powered by Intelligence.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-light-text-muted dark:text-dark-text-muted mb-8 leading-relaxed"
              >
                Pick a topic. Choose a theme. DeckIQ researches, designs, and builds
                your presentation — in seconds.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-3 mb-6">
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

              <motion.p variants={fadeUp} className="text-sm font-medium text-accent-primary">
                🎉 Limited Offer: 100 FREE credits for new users (valid until end of April)
              </motion.p>
            </motion.div>

            {/* Right Column - Fake Deck */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md bg-dark-bg-surface border border-dark-text-muted/20 rounded-card overflow-hidden shadow-xl">
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scroll Sequence or Static Version */}
      {isMobile ? <StaticHowItWorks /> : <ScrollSequence />}
    </>
  )
}