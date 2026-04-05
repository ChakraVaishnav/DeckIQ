'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Silently try to refresh on mount
  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setAccessToken(data.access_token)
        setUser(data.user)
        return data.access_token
      }
    } catch {}
    return null
  }, [])

  const login = useCallback((token, userData) => {
    setAccessToken(token)
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    setAccessToken(null)
    setUser(null)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/login')
  }, [router])

  // Fetch wrapper that handles 401 → refresh → retry
  const authFetch = useCallback(async (url, options = {}) => {
    const makeRequest = (token) =>
      fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

    let res = await makeRequest(accessToken)
    if (res.status === 401) {
      const newToken = await refresh()
      if (newToken) {
        res = await makeRequest(newToken)
      } else {
        logout()
        return res
      }
    }
    return res
  }, [accessToken, refresh, logout])

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, login, logout, refresh, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

