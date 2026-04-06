'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar'
import GenerateInput from '@/components/Dashboard/GenerateInput'
import GenerationCard from '@/components/Dashboard/GenerationCard'
import BuyCreditsModal from '@/components/Dashboard/BuyCreditsModal'
import Footer from '@/components/LandingPage/Footer'
import { useAuth } from '@/context/AuthContext'

// Greeting moved to GenerateInput

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

function DashboardContent() {
  const { user, authFetch } = useAuth()
  const [recentPpts, setRecentPpts] = useState([])
  const [loadingPpts, setLoadingPpts] = useState(true)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchRecent = useCallback(async () => {
    try {
      const res = await authFetch('/api/generations?limit=6')
      if (res.ok) {
        const data = await res.json()
        setRecentPpts(data.ppts || [])
      }
    } catch {}
    setLoadingPpts(false)
  }, [authFetch])

  useEffect(() => { fetchRecent() }, [fetchRecent])

  const handleDeleteClick = (pptId) => {
    setDeletingId(pptId)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    try {
      await authFetch('/api/generations', {
        method: 'DELETE',
        body: JSON.stringify({ pptId: deletingId }),
      })
      setRecentPpts((prev) => prev.filter((p) => p.id !== deletingId))
    } catch {}
    setDeletingId(null)
  }

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <DashboardNavbar onBuyCredits={() => setShowBuyModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Generate Input (now handles 2-column layout and greeting) */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-12">
          <GenerateInput 
            user={user} 
            onBuyCredits={() => setShowBuyModal(true)}
            onGenerated={fetchRecent} 
            authFetch={authFetch} 
          />
        </motion.div>

        {/* Recent Generations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">
              Your recent decks
            </h2>
            {recentPpts.length > 0 && (
              <Link
                href="/generations"
                className="text-sm text-accent-primary hover:underline"
              >
                View all →
              </Link>
            )}
          </div>

          {loadingPpts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card p-4 animate-pulse">
                  <div className="h-4 bg-light-bg-elevated dark:bg-dark-bg-elevated rounded mb-3 w-3/4" />
                  <div className="h-3 bg-light-bg-elevated dark:bg-dark-bg-elevated rounded mb-2 w-1/2" />
                  <div className="h-3 bg-light-bg-elevated dark:bg-dark-bg-elevated rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : recentPpts.length === 0 ? (
            <div className="text-center py-12 bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card">
              <div className="w-12 h-12 rounded-full bg-accent-subtle-light dark:bg-accent-subtle-dark flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B4CF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted">
                No decks yet. Generate your first one above!
              </p>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {recentPpts.map((ppt) => (
                <motion.div key={ppt.id} variants={fadeUp}>
                  <GenerationCard
                    {...ppt}
                    onDelete={() => handleDeleteClick(ppt.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Buy Modal */}
      {showBuyModal && (
        <BuyCreditsModal
          onClose={() => setShowBuyModal(false)}
          authFetch={authFetch}
        />
      )}

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

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

