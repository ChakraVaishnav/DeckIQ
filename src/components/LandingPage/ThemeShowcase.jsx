'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

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

function ThemeCard({ theme }) {
  return (
    <div
      className="shrink-0 w-44 h-32 rounded-card overflow-hidden border relative"
      style={{ backgroundColor: theme.bg, borderColor: `${theme.accent}30` }}
    >
      {/* Accent top bar */}
      <div className="h-1" style={{ backgroundColor: theme.accent }} />
      <div className="p-3">
        {/* Fake slide content */}
        <div className="text-xs font-medium mb-2 truncate" style={{ color: theme.title }}>
          {theme.label}
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: `${theme.body}40` }} />
          <div className="h-1.5 rounded-full w-1/2" style={{ backgroundColor: `${theme.body}30` }} />
          <div className="h-1.5 rounded-full w-2/3" style={{ backgroundColor: `${theme.body}20` }} />
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
            25 stunning themes. One click away.
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


