'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="h-screen bg-light-bg-primary dark:bg-dark-bg-primary flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Illustration - smaller */}
      <div className="w-full max-w-sm mb-4 shrink-0">
        <img
          src="/404-illustration.svg"
          alt="Page not found"
          className="w-full h-auto"
        />
      </div>

      {/* Text content - compact */}
      <div className="text-center shrink-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-1">
          404
        </h1>
        <p className="text-lg sm:text-xl text-light-text-muted dark:text-dark-text-muted mb-1">
          Page not found
        </p>
        <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-4 leading-snug max-w-xs">
          The page you're looking for has disappeared. Let's get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            href="/"
            className="bg-accent-primary hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-component transition-colors duration-150 text-sm whitespace-nowrap"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="border border-light-text-muted/30 dark:border-dark-text-muted/30 hover:bg-light-bg-elevated dark:hover:bg-dark-bg-elevated text-light-text-primary dark:text-dark-text-primary py-2 px-6 rounded-component transition-colors duration-150 text-sm whitespace-nowrap"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
