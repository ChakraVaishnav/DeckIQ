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
];

// Fake slide mockup card that splits into 3 steps
function SlidePreview({ scrollYProgress }) {
  // Use scroll progress to dynamically "split" the cards apart as you scroll
  const step1x = useTransform(scrollYProgress, [0, 0.4, 1], [0, -250, -320]);
  const step1y = useTransform(scrollYProgress, [0, 0.4, 1], [0, 100, 100]);
  const step1rotate = useTransform(scrollYProgress, [0, 0.4, 1], [0, -5, -4]);
  const step1scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.8, 1, 1]);
  const step1opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 1]);

  const step2x = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0, 0]);
  const step2y = useTransform(scrollYProgress, [0, 0.4, 1], [0, 120, 120]);
  const step2rotate = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0, 0]);
  const step2scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.8, 1, 1]);
  const step2opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 1]);

  const step3x = useTransform(scrollYProgress, [0, 0.4, 1], [0, 250, 320]);
  const step3y = useTransform(scrollYProgress, [0, 0.4, 1], [0, 100, 100]);
  const step3rotate = useTransform(scrollYProgress, [0, 0.4, 1], [0, 5, 4]);
  const step3scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.8, 1, 1]);
  const step3opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 1]);

  // Main mockup card disappears/scales down as it splits
  const mainY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  const mainScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.5]);
  const mainOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 0.5, 0]);

  const stepTransforms = [
    { x: step1x, y: step1y, rotateZ: step1rotate, scale: step1scale, opacity: step1opacity },
    { x: step2x, y: step2y, rotateZ: step2rotate, scale: step2scale, opacity: step2opacity },
    { x: step3x, y: step3y, rotateZ: step3rotate, scale: step3scale, opacity: step3opacity },
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto -mb-16 mt-16 md:mt-24 h-[400px]">
      {/* 3 Steps Cards hidden behind the main card, spreading out on scroll */}
      {STEPS.map((step, i) => (
        <motion.div
          key={step.num}
          style={{ x: stepTransforms[i].x, y: stepTransforms[i].y, rotateZ: stepTransforms[i].rotateZ, scale: stepTransforms[i].scale, opacity: stepTransforms[i].opacity }}
          className="absolute top-0 left-0 w-full md:w-80 bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/15 dark:border-dark-text-muted/15 rounded-card p-6 shadow-xl origin-center"
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
        </motion.div>
      ))}

      {/* Main Mockup Card */}
      <motion.div
        style={{ y: mainY, scale: mainScale, opacity: mainOpacity }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-0 right-0 w-full max-w-xl mx-auto bg-dark-bg-surface border border-dark-text-muted/20 rounded-card overflow-hidden shadow-2xl z-10"
      >
        {/* Slide header bar */}
        <div className="h-1.5 bg-accent-primary" />
        <div className="p-6">
          {/* Slide title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded bg-accent-primary/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B4CF5" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div>
              <div className="text-white text-sm font-medium">The Future of Climate Technology</div>
              <div className="text-dark-text-muted text-xs mt-0.5">Generated by DeckIQ</div>
            </div>
          </div>

          {/* Slide content mockup */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              {['Renewable innovation', 'Carbon capture tech', 'Smart grid systems'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                  <div className="text-xs text-dark-text-muted">{item}</div>
                </div>
              ))}
            </div>
            <div className="bg-dark-bg-elevated rounded-component p-3">
              {/* Fake chart */}
              <div className="flex items-end gap-1 h-12">
                {[40, 65, 45, 80, 70, 90, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-accent-primary/60 rounded-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="text-2xs text-dark-text-muted mt-1 text-center">Growth 2020–2026</div>
            </div>
          </div>

          {/* Slide footer */}
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
    </div>
  )
}

export default function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // 3D Parallax sliding animations for the mockup - enhanced for premium feel
  const containerY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 40])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -10])
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, 5])

  return (
    // Increase height to allow scrolling for the animation sequence
    <section ref={containerRef} id="how-it-works" className="relative h-[250vh] bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-x-hidden" style={{ perspective: '1200px' }}>
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-primary/8 dark:bg-accent-primary/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full px-6 sm:px-10 lg:px-16 flex flex-col items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
          >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-subtle-light dark:bg-accent-subtle-dark border border-accent-primary/20 text-accent-primary text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
              AI-Powered Presentations
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-hero font-medium text-light-text-primary dark:text-dark-text-primary leading-tight max-w-3xl mb-6"
            style={{ lineHeight: 1.15 }}
          >
            Create Stunning Decks,
            <br />
            <span className="text-accent-primary">Powered by Intelligence.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-xl mb-8 leading-relaxed"
          >
            Pick a topic. Choose a theme. DeckIQ researches, designs, and builds
            your presentation — in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <Link
              href="/signup"
              className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-3 px-7 rounded-component transition-colors duration-150 text-sm whitespace-nowrap"
            >
              Generate Your First Deck →
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="border border-light-text-muted/30 dark:border-dark-text-muted/30 hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated text-light-text-primary dark:text-dark-text-primary py-3 px-7 rounded-component transition-colors duration-150 text-sm whitespace-nowrap"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Subtext */}
          <motion.p variants={fadeUp} className="text-sm font-medium text-accent-primary mb-12">
            🎉 Limited Offer: 100 FREE credits for new users (valid until end of April)
          </motion.p>
          </motion.div>

          {/* Mockup with Scroll Parallax */}
          <motion.div 
            variants={fadeUp} 
            className="w-full max-w-xl mx-auto absolute top-[70%] md:top-[80%] lg:top-full left-1/2 -translate-x-1/2 mt-12"
            style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -300]), opacity, scale, rotateX, rotateY, rotateZ, transformStyle: "preserve-3d" }}
          >
            <SlidePreview scrollYProgress={scrollYProgress} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}


