import Link from 'next/link'
import Footer from '@/components/LandingPage/Footer'
import ThemeToggle from '@/components/shared/ThemeToggle'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary flex flex-col">
      {/* Simple Header */}
      <header className="w-full px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between border-b border-light-text-muted/10 dark:border-dark-text-muted/10">
        <Link href="/" className="flex items-center gap-2 text-xl font-medium text-light-text-primary dark:text-dark-text-primary">
          Deck<span className="text-accent-primary">IQ</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/" className="text-sm font-medium text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-8">Last updated: June 2025</p>

        <div className="space-y-8 text-light-text-primary dark:text-dark-text-primary">
          
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-3">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-light-text-muted dark:text-dark-text-muted">
              <li>Name and contact information</li>
              <li>Presentation content and prompt preferences</li>
              <li>Account credentials</li>
              <li>Usage data and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-light-text-muted dark:text-dark-text-muted">
              <li>Provide and maintain our services</li>
              <li>Process your slide deck creation requests</li>
              <li>Send you important updates and notifications</li>
              <li>Improve our AI services and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-light-text-muted dark:text-dark-text-muted">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at: <br/>
              Email: <a href="mailto:deckiqteam@gmail.com" className="text-accent-primary hover:underline">deckiqteam@gmail.com</a>
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
