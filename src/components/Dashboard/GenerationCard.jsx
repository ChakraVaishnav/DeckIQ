'use client'

import { motion } from 'framer-motion'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function GenerationCard({ title, theme, slideCount, createdAt, fileUrl, onDelete }) {
  const themeLabel = theme ? theme.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Unknown'

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className="group bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 hover:border-accent-primary/40 rounded-card p-4 flex flex-col gap-3 transition-colors duration-150"
    >
      {/* Title */}
      <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary leading-tight line-clamp-2">
        {title}
      </h3>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-accent-subtle-light dark:bg-accent-subtle-dark text-accent-primary border border-accent-primary/10">
          {themeLabel}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-light-bg-elevated dark:bg-dark-bg-elevated text-light-text-muted dark:text-dark-text-muted">
          {slideCount} slides
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-xs text-light-text-muted dark:text-dark-text-muted">
          {createdAt ? formatDate(createdAt) : '—'}
        </span>
        <div className="flex items-center gap-1.5">
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded-component text-light-text-muted dark:text-dark-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-150"
              aria-label="Delete generation"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          )}
          <a
            href={fileUrl}
            download
            className="border border-light-text-muted/30 dark:border-dark-text-muted/30 hover:border-accent-primary/40 hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated text-light-text-muted dark:text-dark-text-muted py-1 px-3 rounded-component transition-colors duration-150 text-xs flex items-center gap-1"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </a>
        </div>
      </div>
    </motion.div>
  )
}

