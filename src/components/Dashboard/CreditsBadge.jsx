'use client'

export default function CreditsBadge({ credits, onBuyMore }) {
  const low = credits < 3

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        low
          ? 'bg-red-500/10 border-red-500/20 text-red-400'
          : 'bg-accent-subtle-light dark:bg-accent-subtle-dark border-accent-primary/20 text-accent-primary'
      }`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        {credits} {credits === 1 ? 'credit' : 'credits'}
      </div>
      {low && onBuyMore && (
        <button
          onClick={onBuyMore}
          className="text-xs text-accent-primary hover:underline font-medium"
        >
          Buy more
        </button>
      )}
    </div>
  )
}

