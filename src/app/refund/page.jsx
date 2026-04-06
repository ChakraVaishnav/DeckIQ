import Link from 'next/link'
import Footer from '@/components/LandingPage/Footer'
import ThemeToggle from '@/components/shared/ThemeToggle'

export default function RefundPolicy() {
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
        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">Refund Policy</h1>
        <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-8">Last updated: June 2025</p>

        <div className="space-y-8 text-light-text-primary dark:text-dark-text-primary">
          
          <section>
            <h2 className="text-xl font-semibold mb-3">1. No Refunds</h2>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed mb-4">
              <strong>There is no refund for any purchases made on DeckIQ.</strong>
            </p>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed mb-4">
              Because DeckIQ relies on high-cost, third-party artificial intelligence engines to generate presentation slides and content instantly upon request, operational costs are incurred the moment a generation begins. Once a presentation is generated or credits are added to your account, the computing resources can not be recovered. 
            </p>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed mb-4">
              Therefore, we have a strict no-refund policy for all paid plans, one-time generation unlocks, and credit top-ups. We encourage users to thoughtfully use their complimentary credits (if any are offered) to ensure our service meets their expectations before committing to a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Service Disruptions</h2>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
              In the extremely rare event that a generation completely fails due to a system error on our end, your credits will automatically be restored transparently. However, partial generations or subjective dissatisfaction with the AI's content choices do not qualify for credit reimbursements or refunds under any circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Contact Us</h2>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
              For queries regarding this refund policy or billing, please contact our team at: <br/>
              Email: <a href="mailto:deckiqteam@gmail.com" className="text-accent-primary hover:underline">deckiqteam@gmail.com</a>
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
