import Navbar from '@/components/LandingPage/Navbar'
import Hero from '@/components/LandingPage/Hero'
import HowItWorks from '@/components/LandingPage/HowItWorks'
import Features from '@/components/LandingPage/Features'
import ThemeShowcase from '@/components/LandingPage/ThemeShowcase'
import Pricing from '@/components/LandingPage/Pricing'
import FAQ from '@/components/LandingPage/FAQ'
import CTA from '@/components/LandingPage/CTA'
import Footer from '@/components/LandingPage/Footer'

export const metadata = {
  title: 'DeckIQ — AI-Powered Presentation Generator',
  description: 'Create stunning presentations powered by AI. Pick a topic, choose a theme, download your .pptx in seconds. From the makers of COREsume.',
  keywords: 'AI presentations, PowerPoint generator, PPTX, automated slides, DeckIQ',
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <ThemeShowcase />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}

