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
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

function GenerationsContent() {
  const { authFetch } = useAuth()
  const [ppts, setPpts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

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

  const handleDeleteClick = (pptId) => {
    setDeletingId(pptId)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    try {
      const res = await authFetch('/api/generations', {
        method: 'DELETE',
        body: JSON.stringify({ pptId: deletingId }),
      })
      if (res.ok) {
        setPpts((prev) => prev.filter((p) => p.id !== deletingId))
      }
    } catch {}
    setDeletingId(null)
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
                  onDelete={() => handleDeleteClick(ppt.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      <Footer />

      {/* Custom Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDeletingId(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card p-6 w-full max-w-sm text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Delete Project?</h3>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-6">
              This generation cannot be restored again. Are you sure you want to delete it permanently?
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-2.5 rounded-component border border-light-text-muted/30 dark:border-dark-text-muted/30 text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated transition-colors font-medium">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-component transition-colors text-sm shadow-sm hover:shadow">
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
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

