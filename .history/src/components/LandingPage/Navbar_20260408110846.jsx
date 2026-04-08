'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import ThemeToggle from '@/components/shared/ThemeToggle'

const DeckIQLogo = () => (
  <div>
    <span className="text-xl font-medium text-light-text-primary dark:text-dark-text-primary">
      Deck<span className="text-accent-primary">IQ</span>
    </span>
    <div className="text tracking-widest text-muted dark:text-dark-text-muted font-medium leading-none mt-0.5">
      From the makers of COREsume
    </div>
  </div>
)

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#pricing', label: 'Pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { accessToken } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-light-bg-surface/90 dark:bg-dark-bg-surface/90 backdrop-blur-md border-b border-light-text-muted/10 dark:border-dark-text-muted/10'
      : 'bg-transparent'
      }`}>
      <div className="w-full px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <DeckIQLogo />
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {accessToken ? (
            <Link
              href="/dashboard"
              className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-2 px-5 rounded-component transition-colors duration-150 text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="border border-light-text-muted/30 dark:border-dark-text-muted/30 hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated text-light-text-primary dark:text-dark-text-primary py-2 px-5 rounded-component transition-colors duration-150 text-sm"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-2 px-5 rounded-component transition-colors duration-150 text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            className="w-9 h-9 flex items-center justify-center rounded-component text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated transition-colors"
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-light-bg-surface dark:bg-dark-bg-surface border-b border-light-text-muted/10 dark:border-dark-text-muted/10 px-4 pb-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="block py-2.5 text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-3">
            <Link
              href="/login"
              className="flex-1 text-center border border-light-text-muted/30 dark:border-dark-text-muted/30 text-light-text-primary dark:text-dark-text-primary py-2 rounded-component text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center bg-accent-primary text-white font-medium py-2 rounded-component text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}


