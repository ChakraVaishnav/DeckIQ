'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Theme visual configs for the picker UI
const THEME_VISUALS = {
  dark_tech:        { bg: '#0F0F14', accent: '#5B4CF5', title: '#00DCFF', body: '#DCDCDC', label: 'Dark Tech',        vibe: 'Futuristic & Bold' },
  minimal_light:    { bg: '#FFFFFF', accent: '#5B4CF5', title: '#0F0F14', body: '#3C3C3C', label: 'Minimal Light',    vibe: 'Clean & Professional' },
  corporate_blue:   { bg: '#1E2761', accent: '#3B82F6', title: '#FFFFFF', body: '#CADCFC', label: 'Corporate Blue',   vibe: 'Trustworthy & Formal' },
  vibrant_creative: { bg: '#FF6B6B', accent: '#FFE66D', title: '#FFFFFF', body: '#FFFFFF', label: 'Vibrant Creative', vibe: 'Bold & Energetic' },
  nature_green:     { bg: '#1A3A2A', accent: '#66BB6A', title: '#E8F5E9', body: '#C8E6C9', label: 'Nature Green',     vibe: 'Calm & Sustainable' },
  berlin:           { bg: '#1C1C1E', accent: '#FF9500', title: '#F2F2F7', body: '#E5E5EA', label: 'Berlin',           vibe: 'Modern & Urban' },
  slate_dark:       { bg: '#1E293B', accent: '#94A3B8', title: '#F8FAFC', body: '#CBD5E1', label: 'Slate Dark',       vibe: 'Sophisticated' },
  coral_energy:     { bg: '#FF4500', accent: '#FFD700', title: '#FFFFFF', body: '#FFE4D6', label: 'Coral Energy',     vibe: 'High Energy & Sales' },
  midnight:         { bg: '#0D1117', accent: '#58A6FF', title: '#C9D1D9', body: '#8B949E', label: 'Midnight',         vibe: 'Deep & Technical' },
  arctic:           { bg: '#EFF6FF', accent: '#2563EB', title: '#1E3A5F', body: '#334155', label: 'Arctic',           vibe: 'Fresh & Scientific' },
  emerald:          { bg: '#064E3B', accent: '#10B981', title: '#ECFDF5', body: '#A7F3D0', label: 'Emerald',          vibe: 'Premium & Growth' },
  neon_noir:        { bg: '#09090B', accent: '#A855F7', title: '#E4E4E7', body: '#A1A1AA', label: 'Neon Noir',        vibe: 'Cyber & Creative' },
  golden_hour:      { bg: '#78350F', accent: '#F59E0B', title: '#FEF3C7', body: '#FDE68A', label: 'Golden Hour',      vibe: 'Luxury & Warm' },
  ocean_depths:     { bg: '#003049', accent: '#F77F00', title: '#FCBF49', body: '#EAE2B7', label: 'Ocean Depths',     vibe: 'Deep & Research' },
  pastel_dream:     { bg: '#FFF1FB', accent: '#EC4899', title: '#6B21A8', body: '#9333EA', label: 'Pastel Dream',     vibe: 'Soft & Elegant' },
  cherry_blossom:   { bg: '#FFF0F5', accent: '#FF69B4', title: '#C71585', body: '#8B008B', label: 'Cherry Blossom',   vibe: 'Gentle & Spring' },
  sapphire_glow:    { bg: '#000080', accent: '#00BFFF', title: '#E0FFFF', body: '#ADD8E6', label: 'Sapphire Glow',    vibe: 'Bright & Trust' },
  nordic_frost:     { bg: '#ECEFF4', accent: '#88C0D0', title: '#2E3440', body: '#4C566A', label: 'Nordic Frost',     vibe: 'Cool & Minimal' },
  retro_pop:        { bg: '#FFD54F', accent: '#4FC3F7', title: '#D84315', body: '#F4511E', label: 'Retro Pop',        vibe: 'Loud & Vintage' },
  cyberpunk:        { bg: '#000000', accent: '#00F0FF', title: '#FF003C', body: '#FCE205', label: 'Cyberpunk',        vibe: 'Neon & Gritty' },
  autumn_leaves:    { bg: '#FFF8E1', accent: '#FF8F00', title: '#3E2723', body: '#5D4037', label: 'Autumn Leaves',    vibe: 'Warm & Cosy' },
  monochrome:       { bg: '#FFFFFF', accent: '#666666', title: '#000000', body: '#333333', label: 'Monochrome',       vibe: 'Stark & Classic' },
  vintage_sepia:    { bg: '#F4ECD8', accent: '#8B4513', title: '#5C4033', body: '#654321', label: 'Vintage Sepia',    vibe: 'Old World' },
  neon_sunset:      { bg: '#240046', accent: '#E0AAFF', title: '#FF9E00', body: '#FF9100', label: 'Neon Sunset',      vibe: 'Synthwave' },
  desert_sand:      { bg: '#EDC9AF', accent: '#CC7722', title: '#4A3C31', body: '#614A36', label: 'Desert Sand',      vibe: 'Earthy & Dry' },
}

const STEPS = [
  { step: 1, label: 'Planning your slide structure...' },
  { step: 2, label: 'Writing slide content with AI...' },
  { step: 3, label: 'Finalizing your deck...' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// Mini theme card for the picker
function ThemeCard({ themeKey, isSelected, onClick }) {
  const v = THEME_VISUALS[themeKey]
  if (!v) return null
  return (
    <button
      onClick={() => onClick(themeKey)}
      className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200 ${
        isSelected ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'opacity-70 hover:opacity-100 hover:scale-[1.02]'
      }`}
      style={{ width: 120, height: 72, background: v.bg }}
      title={v.label}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: v.accent }} />
      <div style={{ position: 'absolute', top: 14, left: 10, right: 10 }}>
        <div style={{ height: 7, borderRadius: 3, background: v.title, opacity: 0.9, marginBottom: 6 }} />
        <div style={{ height: 4, borderRadius: 2, background: v.accent, opacity: 0.7, marginBottom: 4, width: '70%' }} />
        <div style={{ height: 3, borderRadius: 2, background: v.title, opacity: 0.4, marginBottom: 3 }} />
        <div style={{ height: 3, borderRadius: 2, background: v.title, opacity: 0.4, width: '80%' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(0,0,0,0.55)', padding: '3px 6px',
        fontSize: 9, color: '#fff', textAlign: 'center', fontWeight: 600,
      }}>
        {v.label}
      </div>
      {isSelected && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 16, height: 16, borderRadius: '50%',
          background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5">
            <polyline points="2 6 5 9 10 3" />
          </svg>
        </div>
      )}
    </button>
  )
}

// 3 slides real preview
function ThemePreview({ themeKey, slidesData }) {
  const v = THEME_VISUALS[themeKey]
  if (!v || !slidesData) return null

  const slidesToShow = []
  
  // Slide 1: Title
  slidesToShow.push(
    <div key="title" className="flex flex-col items-center justify-center p-5 h-full relative" style={{ background: v.bg }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: v.accent }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: v.accent }} />
      <p style={{ fontSize: 20, fontWeight: 700, color: v.title, textAlign: 'center', marginBottom: 8, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {slidesData.title || slidesData.topic}
      </p>
      <p style={{ fontSize: 11, color: v.accent, textAlign: 'center' }}>{slidesData.subtitle}</p>
    </div>
  )

  // Slide 2..3 Content
  if (slidesData.slides) {
    slidesData.slides.slice(0, 2).forEach((slide, idx) => {
      const imgUrl = slidesData.imageUrls ? slidesData.imageUrls[idx] : null
      const isImageRight = idx % 2 === 0

      slidesToShow.push(
        <div key={`content-${idx}`} className="flex flex-col p-6 sm:p-8 h-full relative" style={{ background: v.bg }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 8, background: v.accent }} />
          <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: v.title, marginBottom: 8, lineHeight: 1.2 }}>
            {slide.title}
          </p>
          <div style={{ height: 2, background: v.accent, marginBottom: 16, width: '100%' }} />
          
          <div className={`flex flex-1 overflow-hidden ${imgUrl ? 'gap-6' : ''} ${!isImageRight && imgUrl ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto hide-scrollbar">
              {slide.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: v.accent, flexShrink: 0, marginTop: 6 }} />
                  <p style={{ fontSize: 'clamp(12px, 1.6vw, 15px)', color: v.body || v.title, opacity: 0.9, lineHeight: 1.4 }}>{b}</p>
                </div>
              ))}
            </div>
            {imgUrl && (
              <div className="w-[45%] h-full rounded-md shadow-sm overflow-hidden flex-shrink-0 relative bg-black/5">
                <img src={imgUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      )
    })
  }
  
  // If we still need a 3rd slide, show conclusion
  if (slidesToShow.length < 3 && slidesData.conclusionBullets) {
    const conclusionImg = slidesData.imageUrls ? slidesData.imageUrls[slidesData.slides.length] : null

    slidesToShow.push(
      <div key="conclusion" className="flex flex-col p-6 sm:p-8 h-full relative" style={{ background: v.bg }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 8, background: v.accent }} />
        <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: v.title, marginBottom: 8, lineHeight: 1.2 }}>
          Key Takeaways
        </p>
        <div style={{ height: 2, background: v.accent, marginBottom: 16, width: '100%' }} />
        <div className={`flex flex-1 overflow-hidden ${conclusionImg ? 'gap-6' : ''}`}>
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto hide-scrollbar">
            {slidesData.conclusionBullets.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: v.accent, flexShrink: 0, marginTop: 6 }} />
                <p style={{ fontSize: 'clamp(12px, 1.6vw, 15px)', color: v.body || v.title, opacity: 0.9, lineHeight: 1.4 }}>{b}</p>
              </div>
            ))}
          </div>
          {conclusionImg && (
            <div className="w-[45%] h-full rounded-md shadow-sm overflow-hidden flex-shrink-0 relative bg-black/5">
              <img src={conclusionImg} alt="Conclusion" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar scroll-smooth">
      {slidesToShow.map((slide, i) => (
        <div key={i} className="flex-shrink-0 w-full lg:w-[480px] xl:w-[500px] aspect-[16/9] rounded-xl overflow-hidden shadow border border-black/10 snap-center relative">
          {slide}
          <div className="absolute bottom-2 right-4 text-xs font-medium text-black/30 dark:text-white/30 mix-blend-difference">{i + 1} / {slidesToShow.length}</div>
        </div>
      ))}
    </div>
  )
}

export default function GenerateInput({ user, onBuyCredits, onGenerated, authFetch }) {
  const [topic, setTopic] = useState('')
  const [slideCount, setSlideCount] = useState(7)
  const [status, setStatus] = useState('idle') // idle | generating | preview | saving | done | error
  const [currentStep, setCurrentStep] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  // Preview state
  const [suggestedTheme, setSuggestedTheme] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [slidesData, setSlidesData] = useState(null)
  const [availableThemes, setAvailableThemes] = useState([])

  // Done state
  const [fileUrl, setFileUrl] = useState(null)

  // ── Generate ─────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!topic.trim()) return
    const count = Math.max(3, Math.min(20, Number(slideCount) || 7))
    setStatus('generating')
    setCurrentStep(1)
    setErrorMsg('')

    try {
      const res = await authFetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ action: 'generate', topic, slideCount: count }),
      })

      if (res.status === 403) {
        const data = await res.json()
        setStatus('error')
        setErrorMsg(data.error || 'No credits remaining.')
        return
      }
      if (!res.ok) { setStatus('error'); setErrorMsg('Generation failed. Please try again.'); return }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        for (const line of text.split('\n').filter(l => l.startsWith('data: '))) {
          try {
            const event = JSON.parse(line.slice(6))
            if (typeof event.step === 'number') {
              setCurrentStep(event.step)
            } else if (event.step === 'preview') {
              setSuggestedTheme(event.suggestedTheme)
              setSelectedTheme(event.suggestedTheme)
              setSlidesData(event.slidesData)
              setAvailableThemes(event.availableThemes || Object.keys(THEME_VISUALS))
              setStatus('preview')
            } else if (event.step === 'error') {
              setStatus('error')
              setErrorMsg(event.message || 'An error occurred.')
            }
          } catch {}
        }
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  // ── Confirm ──────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    setStatus('saving')
    try {
      const res = await authFetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ action: 'confirm', theme: selectedTheme, slidesData }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setFileUrl(data.fileUrl)
      setStatus('done')
      if (onGenerated) onGenerated()
      const a = document.createElement('a')
      a.href = data.fileUrl
      a.download = `${slidesData.title || slidesData.topic}.pptx`
      a.click()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Failed to save. Please try again.')
    }
  }

  const handleReset = () => {
    setStatus('idle'); setTopic(''); setSlideCount(7)
    setCurrentStep(0); setErrorMsg(''); setSuggestedTheme(null)
    setSelectedTheme(null); setSlidesData(null); setFileUrl(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      
      {/* ── LEFT COLUMN ── */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Greeting Section */}
        <div>
          <h1 className="text-3xl font-medium text-light-text-primary dark:text-dark-text-primary">
            {getGreeting()}, {user?.username} 👋
          </h1>
          <p className="mt-1.5 text-sm text-light-text-muted dark:text-dark-text-muted">
            {user?.credits > 0 ? (
              <>You have <span className="text-accent-primary font-medium">{user.credits} credits</span> remaining.</>
            ) : (
              <>You have no credits left.{' '}
                <button onClick={onBuyCredits} className="text-accent-primary hover:underline font-medium">
                  Buy more →
                </button>
              </>
            )}
            {user?.credits > 0 && user?.credits < 3 && (
              <>
                {' '}<button onClick={onBuyCredits} className="text-accent-primary hover:underline font-medium text-xs">
                  Buy more
                </button>
              </>
            )}
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card p-5">
          <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            What is your presentation about?
          </label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate() } }}
            placeholder="e.g. 'The impact of AI on healthcare' or 'MS Dhoni's leadership'"
            rows={4}
            className="w-full bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-4 py-3 text-sm text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-muted/40 dark:placeholder:text-dark-text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all resize-none mb-4"
            disabled={status !== 'idle' && status !== 'error'}
          />

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-1/3">
              <label className="block text-xs text-light-text-muted dark:text-dark-text-muted mb-1.5 font-medium">
                Number of slides
              </label>
              <input
                type="number"
                min={3}
                max={20}
                value={slideCount}
                onChange={e => {
                  let val = e.target.value;
                  if (val === '') { setSlideCount(''); return; }
                  let num = parseInt(val, 10);
                  if (num > 20) num = 20;
                  setSlideCount(num);
                }}
                className="w-full bg-light-bg-primary dark:bg-dark-bg-primary border border-light-text-muted/30 dark:border-dark-text-muted/30 rounded-component px-3 py-2 text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
                disabled={status !== 'idle' && status !== 'error'}
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || (status !== 'idle' && status !== 'error')}
              className="w-full sm:w-2/3 bg-accent-primary hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-component transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              {status === 'idle' || status === 'error' ? 'Generate Deck' : 'Generating...'}
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="lg:col-span-7">
        <div className="bg-light-bg-surface/50 dark:bg-dark-bg-surface/50 border border-light-text-muted/10 dark:border-dark-text-muted/10 rounded-card p-6 h-full min-h-[300px] flex flex-col justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* Idle State */}
            {status === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-accent-primary" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-1">Waiting for your prompt</h3>
                <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Enter a topic on the left to start generating your presentation.</p>
              </motion.div>
            )}

            {/* Generating State */}
            {status === 'generating' && (
              <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-sm mx-auto w-full space-y-6">
                <p className="text-center text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Creating deck on <span className="text-accent-primary truncate block mt-1">"{topic}"</span>
                </p>
                <div className="space-y-4">
                  {STEPS.map(({ step, label }) => {
                    const done = currentStep > step
                    const active = currentStep === step
                    return (
                      <motion.div key={step} initial={{ opacity: 0.3 }} animate={{ opacity: currentStep >= step ? 1 : 0.3 }} className="flex items-center gap-4 bg-light-bg-primary/50 dark:bg-dark-bg-primary/50 p-3 rounded-lg border border-light-text-muted/10 dark:border-dark-text-muted/10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 transition-all ${
                          done ? 'bg-green-500 text-white' : active ? 'bg-accent-primary text-white ring-4 ring-accent-primary/20' : 'bg-light-bg-elevated dark:bg-dark-bg-elevated text-light-text-muted dark:text-dark-text-muted'
                        }`}>
                          {done ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="2 6 5 9 10 3"/></svg> : step}
                        </div>
                        <span className={`text-sm ${currentStep >= step ? 'text-light-text-primary dark:text-dark-text-primary' : 'text-light-text-muted dark:text-dark-text-muted'}`}>{label}</span>
                        {active && <div className="ml-auto w-4 h-4 border-2 border-accent-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Preview State */}
            {status === 'preview' && slidesData && (
              <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary flex justify-between items-center">
                    Deck is ready! 
                    <span className="text-xs bg-light-bg-elevated dark:bg-dark-bg-elevated px-2 py-1 rounded-md text-light-text-muted dark:text-dark-text-muted font-normal">
                      {slidesData.slideCount} slides
                    </span>
                  </h3>
                  <p className="text-sm text-light-text-muted dark:text-dark-text-muted mt-1">
                    Previewing first 3 slides. Pick a theme and save.
                  </p>
                </div>

                {/* Slides Preview */}
                <div className="-mx-2 px-2">
                  <ThemePreview themeKey={selectedTheme} slidesData={slidesData} />
                </div>

                {/* Theme grid */}
                <div className="pt-2">
                  <p className="text-xs text-light-text-muted dark:text-dark-text-muted mb-2 font-medium uppercase tracking-wider flex items-center justify-between">
                    <span>Select Theme</span>
                    {selectedTheme === suggestedTheme && <span className="text-accent-primary normal-case">AI Suggested ✦</span>}
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {availableThemes.map(themeKey => (
                      <ThemeCard key={themeKey} themeKey={themeKey} isSelected={selectedTheme === themeKey} onClick={setSelectedTheme} />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleConfirm}
                    className="flex-1 bg-accent-primary hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-component transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Save & Download
                  </button>
                  <button onClick={handleReset} className="px-5 py-3 rounded-component border border-light-text-muted/30 dark:border-dark-text-muted/30 text-sm text-light-text-muted dark:text-dark-text-muted hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated transition-colors">
                    Start over
                  </button>
                </div>
              </motion.div>
            )}

            {/* Saving State */}
            {status === 'saving' && (
              <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-12 h-12 border-[3px] border-accent-primary border-t-transparent rounded-full animate-spin" />
                <div>
                  <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-1">Finalizing Presentation</h3>
                  <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Building .pptx file and saving to your account...</p>
                </div>
              </motion.div>
            )}

            {/* Done State */}
            {status === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full space-y-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">Ready to go!</h3>
                  <p className="text-sm text-light-text-muted dark:text-dark-text-muted mt-2">Your presentation has been saved and is downloading.</p>
                </div>
                <div className="flex gap-3 w-full max-w-xs mt-4">
                  <a href={fileUrl} download className="flex-1 bg-accent-primary hover:bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-component transition-colors text-sm flex items-center justify-center gap-2">
                    Download Again
                  </a>
                  <button onClick={handleReset} className="flex-1 py-2.5 rounded-component border border-light-text-muted/30 dark:border-dark-text-muted/30 text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated transition-colors">
                    New Deck
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-1">Generation Failed</h3>
                  <p className="text-sm text-light-text-muted dark:text-dark-text-muted max-w-[260px] mx-auto">{errorMsg}</p>
                </div>
                <button onClick={handleReset} className="mt-2 text-sm text-accent-primary hover:underline font-medium">← Go back and try again</button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    
      {/* Required style for hiding scrollbars on preview elements */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}
