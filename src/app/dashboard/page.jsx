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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

function DashboardContent() {
  const { user, authFetch } = useAuth()
  const [recentPpts, setRecentPpts] = useState([])
  const [loadingPpts, setLoadingPpts] = useState(true)
  const [showBuyModal, setShowBuyModal] = useState(false)

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

  const handleDelete = async (pptId) => {
    if (!confirm('Delete this presentation?')) return
    try {
      await authFetch('/api/generations', {
        method: 'DELETE',
        body: JSON.stringify({ pptId }),
      })
      setRecentPpts((prev) => prev.filter((p) => p.id !== pptId))
    } catch {}
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
                    onDelete={() => handleDelete(ppt.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {showBuyModal && (
        <BuyCreditsModal
          onClose={() => setShowBuyModal(false)}
          authFetch={authFetch}
        />
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

