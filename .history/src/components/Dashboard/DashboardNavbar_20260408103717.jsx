'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ThemeToggle from '@/components/shared/ThemeToggle'
import CreditsBadge from './CreditsBadge'

const DeckIQLogo = () => (
  <span className="text-xl font-medium text-light-text-primary dark:text-dark-text-primary">
    Deck<span className="text-accent-primary">IQ</span>
  </span>
)

function UserAvatar({ username }) {
  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : '?'
  return (
    <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white text-xs font-medium select-none">
      {initials}
    </div>
  )
}

export default function DashboardNavbar({ onBuyCredits }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-light-bg-surface/90 dark:bg-dark-bg-surface/90 border-b border-light-text-muted/10 dark:border-dark-text-muted/10 backdrop-blur-md">
      <div className="w-full px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard">
          <DeckIQLogo />
        </Link>

        {/* Right side */}" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <UserAvatar username={user?.username} />
            </button>
            {/* Dropdown */}
            <div className={`absolute right-0 top-full mt-2 w-44 bg-light-bg-surface dark:bg-dark-bg-surface border border-light-text-muted/20 dark:border-dark-text-muted/20 rounded-card shadow-lg transition-all duration-150 z-50 ${
              isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            My Generations
          </Link>

          {user && <CreditsBadge credits={user.credits} onBuyMore={onBuyCredits} />}

          <ThemeToggle />

          {/* Avatar with dropdown */}
          <div className="relative group">
            {isDropdownOpen && (
              <>
                <div className="px-3 py-2.5 border-b border-light-text-muted/10 dark:border-dark-text-muted/10">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-light-text-muted dark:text-dark-text-muted truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-3 py-2 text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated transition-colors"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/generations"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-3 py-2 text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated transition-colors"
                  >
                    My Generations
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </>
            )}Click={logout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

