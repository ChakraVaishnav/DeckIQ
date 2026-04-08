'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar'
import Footer from '@/components/LandingPage/Footer'

const THEMES = [
  { key: 'dark_tech', bg: '#0F0F14', accent: '#5B4CF5', title: '#00DCFF', body: '#DCDCDC', label: 'Dark Tech', vibe: 'Futuristic & Bold' },
  { key: 'minimal_light', bg: '#FFFFFF', accent: '#5B4CF5', title: '#0F0F14', body: '#3C3C3C', label: 'Minimal Light', vibe: 'Clean & Professional' },
  { key: 'corporate_blue', bg: '#1E2761', accent: '#3B82F6', title: '#FFFFFF', body: '#CADCFC', label: 'Corporate Blue', vibe: 'Trustworthy & Formal' },
  { key: 'vibrant_creative', bg: '#FF6B6B', accent: '#FFE66D', title: '#FFFFFF', body: '#FFFFFF', label: 'Vibrant Creative', vibe: 'Bold & Energetic' },
  { key: 'nature_green', bg: '#1A3A2A', accent: '#66BB6A', title: '#E8F5E9', body: '#C8E6C9', label: 'Nature Green', vibe: 'Calm & Sustainable' },
  { key: 'berlin', bg: '#1C1C1E', accent: '#FF9500', title: '#F2F2F7', body: '#E5E5EA', label: 'Berlin', vibe: 'Modern & Urban' },
  { key: 'slate_dark', bg: '#1E293B', accent: '#94A3B8', title: '#F8FAFC', body: '#CBD5E1', label: 'Slate Dark', vibe: 'Sophisticated' },
  { key: 'coral_energy', bg: '#FF4500', accent: '#FFD700', title: '#FFFFFF', body: '#FFE4D6', label: 'Coral Energy', vibe: 'High Energy & Sales' },
  { key: 'midnight', bg: '#0D1117', accent: '#58A6FF', title: '#C9D1D9', body: '#8B949E', label: 'Midnight', vibe: 'Deep & Technical' },
  { key: 'arctic', bg: '#EFF6FF', accent: '#2563EB', title: '#1E3A5F', body: '#334155', label: 'Arctic', vibe: 'Fresh & Scientific' },
  { key: 'emerald', bg: '#064E3B', accent: '#10B981', title: '#ECFDF5', body: '#A7F3D0', label: 'Emerald', vibe: 'Premium & Growth' },
  { key: 'neon_noir', bg: '#09090B', accent: '#A855F7', title: '#E4E4E7', body: '#A1A1AA', label: 'Neon Noir', vibe: 'Cyber & Creative' },
  { key: 'golden_hour', bg: '#78350F', accent: '#F59E0B', title: '#FEF3C7', body: '#FDE68A', label: 'Golden Hour', vibe: 'Luxury & Warm' },
  { key: 'ocean_depths', bg: '#003049', accent: '#F77F00', title: '#FCBF49', body: '#EAE2B7', label: 'Ocean Depths', vibe: 'Deep & Research' },
  { key: 'pastel_dream', bg: '#FFF1FB', accent: '#EC4899', title: '#6B21A8', body: '#9333EA', label: 'Pastel Dream', vibe: 'Soft & Elegant' },
  { key: 'cherry_blossom', bg: '#FFF0F5', accent: '#FF69B4', title: '#C71585', body: '#8B008B', label: 'Cherry Blossom', vibe: 'Gentle & Spring' },
  { key: 'sapphire_glow', bg: '#000080', accent: '#00BFFF', title: '#E0FFFF', body: '#ADD8E6', label: 'Sapphire Glow', vibe: 'Bright & Trust' },
  { key: 'nordic_frost', bg: '#ECEFF4', accent: '#88C0D0', title: '#2E3440', body: '#4C566A', label: 'Nordic Frost', vibe: 'Cool & Minimal' },
  { key: 'retro_pop', bg: '#FFD54F', accent: '#4FC3F7', title: '#D84315', body: '#F4511E', label: 'Retro Pop', vibe: 'Loud & Vintage' },
  { key: 'cyberpunk', bg: '#000000', accent: '#00F0FF', title: '#FF003C', body: '#FCE205', label: 'Cyberpunk', vibe: 'Neon & Gritty' },
  { key: 'autumn_leaves', bg: '#FFF8E1', accent: '#FF8F00', title: '#3E2723', body: '#5D4037', label: 'Autumn Leaves', vibe: 'Warm & Cosy' },
  { key: 'monochrome', bg: '#FFFFFF', accent: '#666666', title: '#000000', body: '#333333', label: 'Monochrome', vibe: 'Stark & Classic' },
  { key: 'vintage_sepia', bg: '#F4ECD8', accent: '#8B4513', title: '#5C4033', body: '#654321', label: 'Vintage Sepia', vibe: 'Old World' },
  { key: 'neon_sunset', bg: '#240046', accent: '#E0AAFF', title: '#FF9E00', body: '#FF9100', label: 'Neon Sunset', vibe: 'Synthwave' },
  { key: 'desert_sand', bg: '#EDC9AF', accent: '#CC7722', title: '#4A3C31', body: '#614A36', label: 'Desert Sand', vibe: 'Earthy & Dry' },
]

function ThemeButton({ theme, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-lg border-2 transition-all font-medium ${
        isActive
          ? 'border-accent-primary bg-accent-subtle-light dark:bg-accent-subtle-dark'
          : 'border-light-text-muted/20 dark:border-dark-text-muted/20 hover:border-accent-primary/50'
      }`}
      style={{
        backgroundColor: isActive ? `${theme.accent}15` : 'transparent',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accent }} />
        <span className="text-sm text-light-text-primary dark:text-dark-text-primary whitespace-nowrap">
          {theme.label}
        </span>
      </div>
    </button>
  )
}

function SlidePreview({ theme, index, title, bullets }) {
  return (
    <div
      className="rounded-lg border overflow-hidden aspect-video shadow-md"
      style={{ backgroundColor: theme.bg, borderColor: `${theme.accent}40` }}
    >
      <div className="h-2" style={{ backgroundColor: theme.accent }} />
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: theme.accent }}>
            Slide {index}
          </div>
          <div className="text-xl font-bold mb-4" style={{ color: theme.title }}>
            {title}
          </div>
        </div>
        <ul className="space-y-2 text-sm" style={{ color: theme.body }}>
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.accent }} />
              <span className="leading-snug">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function ThemesPage() {
  const [activeKey, setActiveKey] = useState(THEMES[0].key)
  const activeTheme = THEMES.find((t) => t.key === activeKey) || THEMES[0]

  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary flex flex-col min-h-screen">
      <DashboardNavbar onBuyCredits={() => {}} />

      {/* Back button */}
      <div className="px-6 sm:px-10 lg:px-16 pt-6 pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
        >
          <span className="text-lg">←</span>
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="px-6 sm:px-10 lg:px-16 pb-6">
        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Presentation Themes
        </h1>
        <p className="text-base text-light-text-muted dark:text-dark-text-muted">
          Browse and preview all available themes for your presentations
        </p>
      </div>

      {/* Horizontal theme selector */}
      <div className="px-6 sm:px-10 lg:px-16 pb-8 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {THEMES.map((theme) => (
            <ThemeButton
              key={theme.key}
              theme={theme}
              isActive={theme.key === activeKey}
              onClick={() => setActiveKey(theme.key)}
            />
          ))}
        </div>
      </div>

      {/* Main preview section */}
      <div className="flex-1 px-6 sm:px-10 lg:px-16 pb-12 overflow-y-auto">
        <div className="mb-8">
          <div className="text-sm text-light-text-muted dark:text-dark-text-muted mb-1">Currently viewing</div>
          <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            {activeTheme.label}
          </h2>
          <p className="text-sm text-light-text-muted dark:text-dark-text-muted mt-1">
            {activeTheme.vibe}
          </p>
        </div>

        {/* Slides grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SlidePreview
            theme={activeTheme}
            index={1}
            title="DeckIQ Sample"
            bullets={[
              'Introduce the topic and set context',
              'Summarize key objectives and outcomes',
              'Outline the presentation structure',
            ]}
          />
          <SlidePreview
            theme={activeTheme}
            index={2}
            title="Key Insights"
            bullets={[
              'Highlight the most important findings',
              'Support claims with concise points',
              'Bridge to the next section smoothly',
            ]}
          />
          <SlidePreview
            theme={activeTheme}
            index={3}
            title="Next Steps"
            bullets={[
              'Provide recommended actions',
              'Call out owners and timelines',
              'End with a strong closing statement',
            ]}
          />
        </div>
      </div>

      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  )
}