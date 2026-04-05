'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const THEMES = [
  { name: 'Dark Tech', bg: '#0F0F14', text: '#FFFFFF', accent: '#5B4CF5', preview: '#1A1A28' },
  { name: 'Minimal Light', bg: '#F7F7FF', text: '#0F0F14', accent: '#5B4CF5', preview: '#EDEDFC' },
  { name: 'Corporate Blue', bg: '#1A2744', text: '#FFFFFF', accent: '#3B82F6', preview: '#253759' },
  { name: 'Vibrant Creative', bg: '#FF6B6B', text: '#FFFFFF', accent: '#FFE66D', preview: '#FF8484' },
  { name: 'Nature Green', bg: '#1A3A2A', text: '#E8F5E9', accent: '#66BB6A', preview: '#234D35' },
  { name: 'Berlin', bg: '#1C1C1E', text: '#F2F2F7', accent: '#FF9500', preview: '#2C2C2E' },
  { name: 'Slate Dark', bg: '#1E293B', text: '#F8FAFC', accent: '#94A3B8', preview: '#334155' },
  { name: 'Coral Energy', bg: '#FF4500', text: '#FFFFFF', accent: '#FFD700', preview: '#FF6E40' },
  { name: 'Midnight', bg: '#0D1117', text: '#C9D1D9', accent: '#58A6FF', preview: '#161B22' },
  { name: 'Arctic', bg: '#EFF6FF', text: '#1E3A5F', accent: '#2563EB', preview: '#DBEAFE' },
]

function ThemeCard({ theme }) {
  return (
    <div
      className="flex-shrink-0 w-44 h-32 rounded-card overflow-hidden border relative"
      style={{ backgroundColor: theme.bg, borderColor: `${theme.accent}30` }}
    >
      {/* Accent top bar */}
      <div className="h-1" style={{ backgroundColor: theme.accent }} />
      <div className="p-3">
        {/* Fake slide content */}
        <div className="text-xs font-medium mb-2 truncate" style={{ color: theme.text }}>
          {theme.name}
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: `${theme.text}40` }} />
          <div className="h-1.5 rounded-full w-1/2" style={{ backgroundColor: `${theme.text}30` }} />
          <div className="h-1.5 rounded-full w-2/3" style={{ backgroundColor: `${theme.text}20` }} />
        </div>
        {/* Fake chart */}
        <div className="absolute bottom-3 right-3 flex items-end gap-0.5">
          {[50, 80, 60, 100, 70].map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-t-sm"
              style={{ height: `${h * 0.24}px`, backgroundColor: theme.accent }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ThemeShowcase() {
  return (
    <section className="py-20 bg-light-bg-primary dark:bg-dark-bg-primary overflow-hidden">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
            20+ stunning themes. One click away.
          </h2>
          <p className="text-lg text-light-text-muted dark:text-dark-text-muted max-w-xl mx-auto">
            DeckIQ picks the best theme for your topic automatically — or you can choose.
          </p>
        </motion.div>
      </div>

      {/* Scrolling showcase — full width */}
      <div className="relative">
        <div className="flex gap-4 overflow-hidden">
          <div className="theme-marquee flex gap-4">
            {[...THEMES, ...THEMES].map((theme, i) => (
              <ThemeCard key={i} theme={theme} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


