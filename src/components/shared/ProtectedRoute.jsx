'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { accessToken, refresh, loading } = useAuth()
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (accessToken) {
      setChecking(false)
      return
    }

    // Try to refresh silently
    refresh().then((token) => {
      if (!token) {
        router.replace('/login')
      } else {
        setChecking(false)
      }
    })
  }, [accessToken, loading, refresh, router])

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!accessToken) return null
  return children
}

