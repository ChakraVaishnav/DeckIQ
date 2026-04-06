'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar'
import GenerationCard from '@/components/Dashboard/GenerationCard'
import Footer from '@/components/LandingPage/Footer'
import { useAuth } from '@/context/AuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}

function GenerationsContent() {
  const { authFetch } = useAuth()
  const [ppts, setPpts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      const res = await authFetch('/api/generations')
      if (res.ok) {
        const data = await res.json()
        setPpts(data.ppts || [])
      }
    } catch {}
    setLoading(false)
  }, [authFetch])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleDelete = async (pptId) => {
    if (!confirm('Delete this presentation? This cannot be undone.')) return
    try {
      const res = await authFetch('/api/generations', {
        method: 'DELETE',
        body: JSON.stringify({ pptId }),
      })
      if (res.ok) {
        setPpts((prev) => prev.filter((p) => p.id !== pptId))
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <DashboardNavbar />

      <main className="w-full px-6 sm:px-10 lg:px-16 py-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-3xl font-medium text-light-text-primary dark:text-dark-text-primary">
            Your Generations
          </h1>
          <p className="mt-1.5 text-sm text-light-text-muted dark:text-dark-text-muted">
            All presentations you&apos;ve generated with DeckIQ
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card p-4 animate-pulse">
                <div className="h-4 bg-light-bg-elevated dark:bg-dark-bg-elevated rounded mb-3 w-3/4" />
                <div className="h-3 bg-light-bg-elevated dark:bg-dark-bg-elevated rounded mb-2 w-1/2" />
                <div className="h-3 bg-light-bg-elevated dark:bg-dark-bg-elevated rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : ppts.length === 0 ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5B4CF5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              No generations yet
            </h2>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-6 max-w-xs">
              You haven&apos;t generated any decks yet. Create your first one now!
            </p>
            <Link
              href="/dashboard"
              className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-2 px-5 rounded-component transition-colors duration-150 text-sm"
            >
              Generate your first deck →
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {ppts.map((ppt) => (
              <motion.div key={ppt.id} variants={fadeUp}>
                <GenerationCard
                  {...ppt}
                  onDelete={() => handleDelete(ppt.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function GenerationsPage() {
  return (
    <ProtectedRoute>
      <GenerationsContent />
    </ProtectedRoute>
  )
}

