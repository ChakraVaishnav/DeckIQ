import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata = {
  title: 'DeckIQ — AI Presentations',
  description: 'Create stunning presentations powered by AI. From the makers of COREsume.',
  keywords: 'AI presentations, PowerPoint generator, automated slides, DeckIQ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

