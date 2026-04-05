'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const ALL_THEMES = [
  { value: 'auto', label: 'Auto-select theme' },
  { value: 'dark_tech', label: 'Dark Tech' },
  { value: 'minimal_light', label: 'Minimal Light' },
  { value: 'corporate_blue', label: 'Corporate Blue' },
  { value: 'vibrant_creative', label: 'Vibrant Creative' },
  { value: 'nature_green', label: 'Nature Green' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'slate_dark', label: 'Slate Dark' },
  { value: 'coral_energy', label: 'Coral Energy' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'arctic', label: 'Arctic' },
  { value: 'terracotta', label: 'Terracotta' },
  { value: 'ocean_depths', label: 'Ocean Depths' },
  { value: 'sakura', label: 'Sakura' },
  { value: 'desert_sand', label: 'Desert Sand' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'neon_noir', label: 'Neon Noir' },
  { value: 'pastel_dream', label: 'Pastel Dream' },
  { value: 'urban_grey', label: 'Urban Grey' },
  { value: 'golden_hour', label: 'Golden Hour' },
]

const SLIDE_OPTIONS = [5, 7, 10, 15]

const STEPS = [
  { step: 1, label: 'Planning slides...' },
  { step: 2, label: 'Researching content...' },
  { step: 3, label: 'Adding images...' },
  { step: 4, label: 'Saving your deck...' },
]

export default function GenerateInput({ onGenerated, authFetch }) {
  const [topic, setTopic] = useState('')
  const [slideCount, setSlideCount] = useState(7)
  const [theme, setTheme] = useState('auto')
  const [status, setStatus] = useState('idle') // idle | generating | done | error
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setStatus('generating')
    setCurrentStep(0)
    setErrorMsg('')

    try {
      const res = await authFetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ topic, slideCount, theme }),
      })

      if (res.status === 403) {
        setStatus('error')
        setErrorMsg('No credits remaining. Please purchase more.')
        return
      }

      if (!res.ok) {
        setStatus('error')
        setErrorMsg('Generation failed. Please try again.')
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n').filter((l) => l.startsWith('data: '))

        for (const line of lines) {
          try {
            const event = JSON.parse(line.slice(6))
            if (event.step === 'done') {
              setResult({ ...event, topic })
              setStatus('done')
              if (onGenerated) onGenerated()
            } else if (event.step === 'error') {
              setStatus('error')
              setErrorMsg(event.message || 'An error occurred.')
            } else if (typeof event.step === 'number') {
              setCurrentStep(event.step)
            }
          } catch {}
        }
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setTopic('')
    setResult(null)
    setCurrentStep(0)
    setErrorMsg('')
  }

  return (
    <div className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card p-6">
      {status === 'idle' && (
        <div className="space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="What's your presentation about?"
            className="w-full bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-3 text-base text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-muted/50 dark:placeholder:text-dark-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="flex-1 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all cursor-pointer"
            >
              {SLIDE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} slides</option>
              ))}
            </select>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="flex-1 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-2.5 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all cursor-pointer"
            >
              {ALL_THEMES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <button
              onClick={handleGenerate}
              disabled={!topic.trim()}
              className="bg-accent-primary hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-component transition-colors duration-150 text-sm whitespace-nowrap"
            >
              Generate Deck ✦
            </button>
          </div>
        </div>
      )}

      {status === 'generating' && (
        <div className="py-2 space-y-5">
          <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
            Generating your presentation...
          </p>
          <div className="space-y-3">
            {STEPS.map(({ step, label }) => {
              const done = currentStep > step
              const active = currentStep === step
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: currentStep >= step ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 transition-all duration-300 ${
                    done
                      ? 'bg-green-500 text-white'
                      : active
                      ? 'bg-accent-primary text-white ring-4 ring-accent-primary/20'
                      : 'bg-light-bg-elevated dark:bg-dark-bg-elevated text-light-text-muted dark:text-dark-text-muted'
                  }`}>
                    {done ? (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 6 5 9 10 3"/>
                      </svg>
                    ) : step}
                  </div>
                  <span className={`text-sm ${
                    currentStep >= step
                      ? 'text-light-text-primary dark:text-dark-text-primary'
                      : 'text-light-text-muted dark:text-dark-text-muted'
                  }`}>
                    {label}
                  </span>
                  {active && (
                    <div className="ml-auto w-4 h-4 border-2 border-accent-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {status === 'done' && result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-green-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span className="text-sm font-medium">Your deck is ready!</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                {result.topic}
              </p>
              <p className="text-xs text-light-text-muted dark:text-dark-text-muted mt-0.5">
                {slideCount} slides · {ALL_THEMES.find(t => t.value === theme)?.label || theme}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <a
                href={result.fileUrl}
                download
                className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-component transition-colors duration-150 text-sm flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download .pptx
              </a>
              <button
                onClick={handleReset}
                className="border border-light-text-muted/30 dark:border-dark-text-muted/30 hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated text-light-text-muted dark:text-dark-text-muted py-2 px-4 rounded-component transition-colors duration-150 text-sm"
              >
                New deck
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span className="text-sm">{errorMsg}</span>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-accent-primary hover:underline"
          >
            ← Try again
          </button>
        </div>
      )}
    </div>
  )
}

