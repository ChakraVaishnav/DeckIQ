import Link from 'next/link'

export const metadata = {
  title: 'Terms & Conditions — DeckIQ',
  description: 'Read the Terms & Conditions for using DeckIQ, the AI-powered presentation generator.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* Minimal Navbar */}
      <header className="border-b border-light-text-muted/10 dark:border-dark-text-muted/10">
        <div className="w-full px-6 sm:px-10 lg:px-16 h-16 flex items-center">
          <Link href="/">
            <span className="text-xl font-medium text-light-text-primary dark:text-dark-text-primary">
              Deck<span className="text-accent-primary">IQ</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-12">
          Last updated: April 2025
        </p>

        <div className="space-y-10 text-light-text-muted dark:text-dark-text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using DeckIQ (&quot;the Service&quot;), you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use the Service. These terms apply to all users, including visitors, registered users, and paying customers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
              2. Use of Service
            </h2>
            <p>
              DeckIQ provides AI-powered presentation generation tools. You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service to create content that is illegal, harmful, defamatory, or violates the rights of others. We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
              3. Credits and Payments
            </h2>
            <p>
              DeckIQ operates on a credit system. New accounts receive 3 free credits on signup. Additional credits can be purchased through our payment gateway (Razorpay). All purchases are final and <strong className="text-light-text-primary dark:text-dark-text-primary">non-refundable</strong> unless required by applicable law. Credits have no monetary value and cannot be transferred or redeemed for cash.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
              4. User Content
            </h2>
            <p>
              You retain ownership of any content you input into the Service (topics, instructions, etc.). By using DeckIQ, you grant us a limited, non-exclusive license to process your inputs solely for the purpose of providing the Service. We do not claim ownership over your generated presentations. You are responsible for the content in your presentations and their use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
              5. Privacy
            </h2>
            <p>
              We collect only the information necessary to provide the Service, including your email, username, and usage data. Your generated files are stored securely in cloud storage and are accessible only to your account. We do not sell your personal data to third parties. For more details, please review our Privacy Policy (coming soon).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              DeckIQ is provided &quot;as is&quot; without warranties of any kind, either express or implied. To the fullest extent permitted by law, DeckIQ and its creators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability to you shall not exceed the amount you paid for credits in the last 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
              7. Contact
            </h2>
            <p>
              If you have any questions about these Terms &amp; Conditions, please contact us at{' '}
              <a href="mailto:support@deckiq.com" className="text-accent-primary hover:underline">
                support@deckiq.com
              </a>
              . We are committed to addressing your concerns promptly.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-light-text-muted/10 dark:border-dark-text-muted/10">
          <Link
            href="/"
            className="text-sm text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
          >
            ← Back to DeckIQ
          </Link>
        </div>
      </main>
    </div>
  )
}

