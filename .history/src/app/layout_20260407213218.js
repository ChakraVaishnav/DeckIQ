import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import SmoothScroll from '@/components/shared/SmoothScroll'
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'DeckIQ | AI Presentation Maker',
  description: 'Generate stunning, professional PowerPoint presentations in seconds with DeckIQ. Simply type a topic, choose from 25+ themes, and let AI build your perfect slide deck.',
  keywords: ['AI presentation maker', 'PowerPoint generator', 'automated slides', 'DeckIQ', 'AI slide deck', 'presentation software', 'pitch deck creator'],
  authors: [{ name: 'DeckIQ Team' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://deckiq.vercel.app',
    title: 'DeckIQ | AI Presentation Maker & Slide Generator',
    description: 'Transform any topic into a beautiful, ready-to-present PowerPoint using AI. Build professional slide decks in 30 seconds.',
    siteName: 'DeckIQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeckIQ | AI Presentation Maker',
    description: 'Create ready-to-present, stunning presentations in seconds. Powered by AI.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SmoothScroll>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}

