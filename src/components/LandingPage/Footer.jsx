import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-light-text-muted/10 dark:border-dark-text-muted/10 bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="w-full px-6 sm:px-10 lg:px-16 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        
        {/* Column 1: About Us */}
        <div className="flex-1 min-w-[200px]">
          <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            About Us
          </h4>
          <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed pe-4">
            DeckIQ helps you create professional, AI-powered presentations in minutes.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex-1 min-w-[120px]">
          <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Quick Links
          </h4>
          <nav className="flex flex-col gap-3">
            <Link href="/#about" className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              About Us
            </Link>
            <Link href="/#contact" className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Column 3: Legal */}
        <div className="flex-1 min-w-[150px]">
          <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Legal
          </h4>
          <nav className="flex flex-col gap-3">
            <Link href="/privacy" className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund" className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              Refund Policy
            </Link>
          </nav>
        </div>

        {/* Column 4: Contact */}
        <div className="flex-1 min-w-[180px]">
          <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
            Contact
          </h4>
          <p className="text-sm text-light-text-muted dark:text-dark-text-muted">
            <a href="mailto:deckiqteam@gmail.com" className="hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              deckiqteam@gmail.com
            </a>
          </p>
        </div>

      </div>
    </footer>
  )
}
