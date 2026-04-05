import Link from 'next/link'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/login', label: 'Login' },
  { href: '/signup', label: 'Sign Up' },
  { href: '/terms', label: 'Terms & Conditions' },
]

export default function Footer() {
  return (
    <footer className="border-t border-light-text-muted/10 dark:border-dark-text-muted/10 bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="w-full px-6 sm:px-10 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xl font-medium text-light-text-primary dark:text-dark-text-primary">
              Deck<span className="text-accent-primary">IQ</span>
            </span>
            <span className="text-xs text-light-text-muted dark:text-dark-text-muted mt-0.5">
              From the Makers of COREsume
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right  */}
          <p className="text-xs text-light-text-muted dark:text-dark-text-muted">
            Built with ♥ in India
          </p>
        </div>
      </div>
    </footer>
  )
}


