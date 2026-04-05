# DeckIQ — Full Build Plan

> **Before writing any code**, read `UI_theme.md` for all colors, fonts, and design tokens.
> All UI must use Geist font, Indigo accent `#5B4CF5`, and support both light (`#F7F7FF`) and dark (`#0F0F14`) modes.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS variables from `UI_theme.md` |
| Font | Geist — import from Google Fonts |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Storage | Supabase Storage (for .pptx files) |
| Auth | Custom JWT (access token in useState, refresh token in HttpOnly cookie) |
| Payments | Razorpay |
| Deployment | Vercel |

---

## Folder Structure

```
foundry/DeckIQ/
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   └── app/
│       ├── page.jsx                  ← Landing page (renders LandingPage/ components)
│       ├── login/
│       │   └── page.jsx
│       ├── signup/
│       │   └── page.jsx
│       ├── terms/
│       │   └── page.jsx
│       ├── dashboard/
│       │   └── page.jsx
│       ├── generations/
│       │   └── page.jsx
│       └── api/
│           ├── auth/
│           │   ├── signup/route.js
│           │   ├── login/route.js
│           │   └── refresh/route.js
│           ├── generate/route.js
│           ├── generations/route.js
│           └── payments/
│               ├── create-order/route.js
│               └── verify/route.js
├── src/
│   └── components/
│       ├── LandingPage/
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx
│       │   ├── HowItWorks.jsx
│       │   ├── Features.jsx
│       │   ├── ThemeShowcase.jsx
│       │   ├── Pricing.jsx
│       │   ├── Testimonials.jsx
│       │   ├── FAQ.jsx
│       │   ├── CTA.jsx
│       │   └── Footer.jsx
│       ├── Dashboard/
│       │   ├── DashboardNavbar.jsx
│       │   ├── GenerateInput.jsx
│       │   ├── GenerationCard.jsx
│       │   └── CreditsBadge.jsx
│       └── shared/
│           ├── ThemeToggle.jsx
│           └── ProtectedRoute.jsx
├── src/
│   └── lib/
│       ├── auth.js                   ← JWT helpers
│       ├── prisma.js                 ← Prisma client singleton
│       └── supabase.js               ← Supabase client
├── UI_theme.md                       ← Design tokens reference
└── .env.local
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  username     String   @unique
  password     String                      // bcrypt hashed
  credits      Int      @default(3)        // 3 free generations on signup
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  ppTs         PPT[]
  ratings      Rating[]
}

model PPT {
  id           String   @id @default(cuid())
  userId       String
  title        String
  theme        String
  slideCount   Int
  fileUrl      String                      // Supabase Storage URL
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id])
  ratings      Rating[]
}

model Rating {
  id        String   @id @default(cuid())
  userId    String
  pptId     String
  score     Int                            // 1-5
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  ppt       PPT      @relation(fields: [pptId], references: [id])
}
```

---

## Environment Variables

```env
# .env.local

DATABASE_URL=your_supabase_postgres_url

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

HUGGINGFACE_TOKEN=your_hf_token
PEXELS_API_KEY=your_pexels_key
```

---

## Section 1 — Landing Page (`/`)

> File: `src/app/page.jsx`
> Renders all components from `src/components/LandingPage/` in order.

```jsx
// src/app/page.jsx
import Navbar from '@/components/LandingPage/Navbar'
import Hero from '@/components/LandingPage/Hero'
import HowItWorks from '@/components/LandingPage/HowItWorks'
import Features from '@/components/LandingPage/Features'
import ThemeShowcase from '@/components/LandingPage/ThemeShowcase'
import Pricing from '@/components/LandingPage/Pricing'
import Testimonials from '@/components/LandingPage/Testimonials'
import FAQ from '@/components/LandingPage/FAQ'
import CTA from '@/components/LandingPage/CTA'
import Footer from '@/components/LandingPage/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <ThemeShowcase />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
```

### 1.1 Navbar — `LandingPage/Navbar.jsx`

**Layout:** Logo left | Nav links center | Auth buttons right

**Prompt for AI agent:**
```
Build a sticky Navbar component using the design tokens from UI_theme.md.
- Left: DeckIQ logo — "Deck" in --text-primary, "IQ" in --accent-primary (#5B4CF5), Geist 500, 20px
- Below logo text in 9px uppercase muted: "FROM THE MAKERS OF CORESUME"
- Center: nav links — Home, Features, How it Works, Pricing (smooth scroll to sections)
- Right: "Log in" as ghost button + "Get Started" as filled indigo button
- Right side also has a light/dark mode toggle icon button
- Navbar background: transparent on top, blurs and adds bg-surface on scroll
- Use CSS variables from UI_theme.md for all colors
- Mobile: hamburger menu, all links collapse into a dropdown
- No borders, no heavy shadows — minimal and clean
```

### 1.2 Hero — `LandingPage/Hero.jsx`

**Prompt for AI agent:**
```
Build a Hero section using design tokens from UI_theme.md.
- Full viewport height (100vh)
- Badge at top center: small pill with indigo bg-subtle color, text "AI-Powered Presentations" in accent color
- Main headline (Geist 500, 56px desktop / 36px mobile, --text-primary):
  "Create Stunning Decks,
   Powered by Intelligence."
- Subheadline (Geist 400, 18px, --text-muted):
  "Pick a topic. Choose a theme. DeckIQ researches, designs, and builds your presentation — in seconds."
- Two CTA buttons: "Generate Your First Deck →" (filled indigo) and "See How It Works" (ghost)
- Below buttons: "3 free generations. No credit card required." in 12px muted text
- Animated mockup below the text: a floating dark card showing a fake PPT slide preview with indigo accents
- Subtle fade-in animation on headline and subheadline (staggered, using framer-motion or CSS)
- Background: --bg-primary with a very subtle indigo radial glow behind the headline (low opacity, not loud)
```

### 1.3 How It Works — `LandingPage/HowItWorks.jsx`

**Prompt for AI agent:**
```
Build a "How It Works" section using design tokens from UI_theme.md.
- Section heading: "Three steps to your perfect deck" (Geist 500, 36px, centered)
- 3 step cards in a row (grid, gap 24px):
  Step 1 — "Enter your topic" : User types the topic and selects number of slides
  Step 2 — "Pick a theme" : DeckIQ shows theme options (dark, light, creative etc.)
  Step 3 — "Download your deck" : AI generates and delivers a .pptx file instantly
- Each card: step number in large indigo (72px, low opacity), title in --text-primary, description in --text-muted
- Cards use --bg-surface with 0.5px border in muted tone
- Subtle entrance animation as cards scroll into view
- Mobile: stack vertically
```

### 1.4 Features — `LandingPage/Features.jsx`

**Prompt for AI agent:**
```
Build a Features section using design tokens from UI_theme.md.
- Section heading: "Everything you need to present better" (Geist 500, 36px, centered)
- 6 feature cards in a 3x2 grid:
  1. "AI Slide Content" — Researches and writes bullet points per slide
  2. "Pexels Image Integration" — Adds relevant images automatically
  3. "Multiple Themes" — 20+ professional design themes
  4. "Web Search Powered" — Real-time info via web search per slide
  5. "Instant Download" — Get your .pptx in seconds
  6. "Credit System" — Pay only for what you generate
- Each card: small indigo icon circle (24px), bold title, muted description
- Cards use --bg-surface, 0.5px muted border, border-radius 12px
- Hover: border shifts to accent color subtly
- Mobile: 2x3 or 1x6 stack
```

### 1.5 Theme Showcase — `LandingPage/ThemeShowcase.jsx`

**Prompt for AI agent:**
```
Build a Theme Showcase section using design tokens from UI_theme.md.
- Section heading: "20+ stunning themes. One click away." (Geist 500, 36px, centered)
- Horizontally scrolling row of theme preview cards (auto-scroll animation, pausable on hover)
- Each theme card: 200x140px, shows the theme's bg color, title in that theme's font color, and a small fake slide layout inside
- Show at least 8 themes: dark_tech, minimal_light, corporate_blue, vibrant_creative, nature_green, berlin, slate_dark, coral_energy
- Below: "DeckIQ picks the best theme for your topic automatically — or you can choose." in muted text
```

### 1.6 Pricing — `LandingPage/Pricing.jsx`

**Prompt for AI agent:**
```
Build a Pricing section using design tokens from UI_theme.md.
- Section heading: "Simple, honest pricing" (Geist 500, 36px, centered)
- Subheading: "Start free. Buy credits only when you need more." (muted)
- 3 credit pack cards in a row:
  Pack 1 — "Starter" : 3 credits for ₹19 — "Perfect to try"
  Pack 2 — "Pro" : 10 credits for ₹49 — "Most Popular" (highlight with indigo border accent)
  Pack 3 — "Power" : 25 credits for ₹99 — "Best value"
- Also show a free tier note: "Every new account gets 3 free generations to start."
- Each card: credit count big (48px indigo), price below, CTA button "Buy Credits"
- "Most Popular" card has a badge and 2px indigo border
- All cards use --bg-surface with 0.5px border
```

### 1.7 Testimonials — `LandingPage/Testimonials.jsx`

**Prompt for AI agent:**
```
Build a Testimonials section using design tokens from UI_theme.md.
- Section heading: "Loved by students, founders, and professionals" (Geist 500, 36px, centered)
- 3 testimonial cards in a row:
  1. "I made a 10-slide pitch deck in under 2 minutes. Insane." — Rohan M., Startup Founder
  2. "Used it for my college seminar. Everyone asked how I made it so fast." — Priya K., B.Tech Student  
  3. "The themes are actually good. Saved me hours on a client presentation." — Aditya S., Freelancer
- Each card: quote in --text-primary, name + role in --text-muted, 5 indigo stars at top
- Cards use --bg-surface, 0.5px border, border-radius 12px
- Mobile: stack vertically
```

### 1.8 FAQ — `LandingPage/FAQ.jsx`

**Prompt for AI agent:**
```
Build an FAQ section using design tokens from UI_theme.md.
- Section heading: "Frequently asked questions" (Geist 500, 36px, centered)
- Accordion style — click to expand answer
- 6 FAQs:
  Q: What is DeckIQ?
  A: DeckIQ is an AI-powered presentation generator. Enter a topic, pick a theme, and get a fully designed .pptx file in seconds.

  Q: How many free generations do I get?
  A: Every new account starts with 3 free credits — no card required.

  Q: What is 1 credit?
  A: 1 credit = 1 PPT generation, regardless of slide count.

  Q: Can I choose my own theme?
  A: Yes. DeckIQ suggests the best theme automatically, but you can override and pick any of our 20+ themes.

  Q: What format is the output?
  A: You get a standard .pptx file that works with PowerPoint, Google Slides, and Keynote.

  Q: Is my data safe?
  A: Yes. Your generated files are stored securely in the cloud and only accessible to your account.

- Each FAQ: question in --text-primary Geist 500, answer in --text-muted, indigo + icon to expand
- Smooth open/close animation
- Max width 720px, centered
```

### 1.9 CTA — `LandingPage/CTA.jsx`

**Prompt for AI agent:**
```
Build a final CTA section using design tokens from UI_theme.md.
- Full width section with --bg-surface background
- Large centered headline: "Your next great presentation starts here." (Geist 500, 40px)
- Subtext: "Join thousands generating smarter decks with DeckIQ." (muted)
- Big indigo CTA button: "Start for Free — No Card Needed"
- Small text below: "3 free generations on signup."
- Subtle indigo glow behind the section (very low opacity radial gradient)
```

### 1.10 Footer — `LandingPage/Footer.jsx`

**Prompt for AI agent:**
```
Build a Footer using design tokens from UI_theme.md.
- Left: DeckIQ logo + tagline "From the Makers of COREsume"
- Center links: Home, Features, Pricing, Login, Sign Up, Terms & Conditions
- Right: "Built with ♥ in India" in muted text
- Very top of footer: thin 0.5px muted border separator
- Minimal, no heavy columns — single row layout on desktop, stacked on mobile
- All text in --text-muted, links lighten on hover to --text-primary
```

---

## Section 2 — Auth Pages

### 2.1 Signup Page — `/signup`

**Prompt for AI agent:**
```
Build a Signup page at /signup using design tokens from UI_theme.md.
- Centered card layout (max-width 420px) on --bg-primary background
- Top: DeckIQ logo
- Heading: "Create your account" (Geist 500, 24px)
- Fields:
  - Username (text input)
  - Email (email input)
  - Password (password input with show/hide toggle)
- Terms & Conditions checkbox:
  "I agree to the Terms & Conditions"
  Clicking "Terms & Conditions" text navigates to /terms (Next.js Link)
  Form submission is disabled if checkbox is unchecked
- CTA button: "Create Account" (full width, indigo)
- Below button: "Already have an account? Log in" (link to /login)
- On submit: POST to /api/auth/signup
  - If success: store access_token in useState (via context), refresh_token is set as HttpOnly cookie by the API, redirect to /dashboard
  - If error: show inline error message below the relevant field
- All inputs use --bg-surface, 0.5px border, focus ring in indigo
- Card uses --bg-surface, border-radius 12px, 0.5px border
```

### 2.2 Login Page — `/login`

**Prompt for AI agent:**
```
Build a Login page at /login using design tokens from UI_theme.md.
- Same centered card layout as signup (max-width 420px)
- Top: DeckIQ logo
- Heading: "Welcome back" (Geist 500, 24px)
- Fields:
  - Email (email input)
  - Password (password input with show/hide toggle)
- CTA button: "Log In" (full width, indigo)
- Below: "Don't have an account? Sign up" (link to /signup)
- On submit: POST to /api/auth/login
  - If success: store access_token in useState/context, refresh_token set as HttpOnly cookie, redirect to /dashboard
  - If error: show "Invalid email or password" inline
- Same input and card styles as signup page
```

### 2.3 Terms & Conditions — `/terms`

**Prompt for AI agent:**
```
Build a simple Terms & Conditions page at /terms using design tokens from UI_theme.md.
- Navbar same as landing page (no auth buttons needed, just logo)
- Max-width 720px, centered, good vertical padding
- Heading: "Terms & Conditions" (Geist 500, 32px)
- Subtext: "Last updated: [current date]"
- Sections with headings and paragraph text covering:
  1. Acceptance of Terms
  2. Use of Service
  3. Credits and Payments (non-refundable)
  4. User Content
  5. Privacy
  6. Limitation of Liability
  7. Contact
- All text in --text-primary / --text-muted
- Clean, legal-document feel but minimal and readable
```

---

## Section 3 — Auth API Routes

### 3.1 POST `/api/auth/signup`

**Prompt for AI agent:**
```
Build a Next.js API route at /api/auth/signup using Prisma and Supabase.

Logic:
1. Validate: email, username, password all required. Password min 8 chars.
2. Check if email or username already exists in User table — if so return 409 conflict.
3. Hash password with bcrypt (saltRounds: 10).
4. Create User in DB with credits: 3 (free tier).
5. Generate access_token (JWT, expires in 15 minutes) signed with JWT_ACCESS_SECRET containing { userId, email }.
6. Generate refresh_token (JWT, expires in 7 days) signed with JWT_REFRESH_SECRET containing { userId }.
7. Set refresh_token as HttpOnly cookie (sameSite: strict, secure: true, path: '/').
8. Return: { access_token, user: { id, email, username, credits } }
```

### 3.2 POST `/api/auth/login`

**Prompt for AI agent:**
```
Build a Next.js API route at /api/auth/login.

Logic:
1. Validate: email and password required.
2. Find user by email — if not found return 401.
3. Compare password with bcrypt — if wrong return 401.
4. Generate access_token (15 min) and refresh_token (7 days) same as signup.
5. Set refresh_token as HttpOnly cookie.
6. Return: { access_token, user: { id, email, username, credits } }
```

### 3.3 POST `/api/auth/refresh`

**Prompt for AI agent:**
```
Build a Next.js API route at /api/auth/refresh.

Logic:
1. Read refresh_token from HttpOnly cookie.
2. If no cookie — return 401.
3. Verify refresh_token with JWT_REFRESH_SECRET — if invalid or expired return 401 (client should log out).
4. Find user by userId from token — if not found return 401.
5. Generate new access_token (15 min).
6. Return: { access_token }
```

---

## Section 4 — Auth State (Frontend)

**Prompt for AI agent:**
```
Build an AuthContext using React Context API for DeckIQ.

- State: { accessToken, user } both initialized to null
- On app load: call /api/auth/refresh silently — if success set accessToken and user in state, if fail leave as null (user is logged out)
- Provide: { accessToken, user, login(token, user), logout() }
- login(): sets accessToken and user in state
- logout(): clears state, calls /api/auth/logout to clear the HttpOnly cookie, redirects to /login

Build a ProtectedRoute component:
- Checks if accessToken exists in context
- If not: silently calls /api/auth/refresh
  - If refresh success: set new token and allow access
  - If refresh fails: redirect to /login
- Wrap all dashboard and generations pages with this component

Access token expiry handling:
- Before every API call in dashboard, check if access token is close to expiry or if API returns 401
- If 401: call /api/auth/refresh, get new access token, retry the original request
- If refresh also fails: logout the user
```

---

## Section 5 — Dashboard (`/dashboard`)

**Prompt for AI agent:**
```
Build the Dashboard page at /dashboard using design tokens from UI_theme.md.
Wrap with ProtectedRoute.

Layout:
- DashboardNavbar at top (separate from landing navbar)
- Main content centered, max-width 800px

DashboardNavbar:
- Left: DeckIQ logo (same as landing)
- Right: Credits badge (shows user's remaining credits with indigo color), "My Generations" link, profile avatar circle (initials of username), light/dark toggle

Main content:
- Greeting: "Good morning, [username] 👋" (Geist 500, 28px)
- Subtext: "You have [N] credits remaining." with a "Buy more" link if credits < 3
- Generation input card (--bg-surface, border-radius 12px, 0.5px border):
  - Text input: "What's your presentation about?" (full width)
  - Row below: 
    - Dropdown: "Number of slides" (5 / 7 / 10 / 15)
    - Dropdown: "Theme" (Auto-select / list of all 20 themes)
    - Button: "Generate Deck" (indigo, disabled if no credits or empty input)
- While generating: show a progress UI with step indicators:
  Step 1: Planning slides...
  Step 2: Researching content...
  Step 3: Adding images...
  Step 4: Saving your deck...
  (Each step lights up as it completes — streamed from API)
- On success: show download card with file name, slide count, theme used, and "Download .pptx" button

Recent Generations (below input):
- Heading: "Your recent decks" (Geist 500, 18px)
- Grid of GenerationCard components (last 6)
- "View all →" link to /generations
```

### GenerationCard Component

**Prompt for AI agent:**
```
Build a GenerationCard component using design tokens from UI_theme.md.
Props: { title, theme, slideCount, createdAt, fileUrl }
- Card: --bg-surface, 0.5px border, border-radius 12px, padding 16px
- Top: presentation title (Geist 500, 15px, --text-primary)
- Below: theme name badge (indigo subtle bg) + slide count badge (muted bg)
- Bottom row: created date (muted, 12px) + "Download" button (ghost, small)
- Hover: border subtly brightens to accent
```

---

## Section 6 — Generations Page (`/generations`)

**Prompt for AI agent:**
```
Build the Generations page at /generations using design tokens from UI_theme.md.
Wrap with ProtectedRoute.

- DashboardNavbar at top
- Heading: "Your Generations" (Geist 500, 28px)
- Fetch all PPTs for logged-in user from /api/generations
- Display in a responsive grid (3 col desktop, 2 col tablet, 1 col mobile) of GenerationCard components
- If no generations: empty state with indigo icon, "You haven't generated any decks yet." and a "Generate your first deck →" button
- Each card also has a delete option (icon button, confirm before delete)
```

---

## Section 7 — Generate API Route

### POST `/api/generate`

**Prompt for AI agent:**
```
Build a Next.js API route at /api/generate with streaming response.

Auth: Verify access_token from Authorization header — if invalid return 401.

Logic:
1. Check user's credits — if 0 return 403 with message "No credits remaining. Please purchase more."
2. Deduct 1 credit immediately (optimistic deduct to prevent abuse).
3. Run the DeckIQ agent (LangChain.js + MCP):
   - Stream progress events back to client using ReadableStream / Server-Sent Events:
     { step: 1, message: "Planning slides..." }
     { step: 2, message: "Researching content..." }
     { step: 3, message: "Adding images..." }
     { step: 4, message: "Saving your deck..." }
4. Generate .pptx using pptxgenjs.
5. Upload .pptx to Supabase Storage under /ppts/{userId}/{filename}.
6. Save PPT record to DB: { userId, title, theme, slideCount, fileUrl }.
7. Stream final event: { step: 'done', fileUrl, pptId }
8. If any step fails: restore the deducted credit, stream error event.
```

---

## Section 8 — Payments (Razorpay)

### 8.1 POST `/api/payments/create-order`

**Prompt for AI agent:**
```
Build a Next.js API route at /api/payments/create-order.
Auth: Verify access_token.

Body: { pack } where pack is "starter" | "pro" | "power"

Pack config:
- starter: amount 1900 (paise), credits 3
- pro: amount 4900, credits 10  
- power: amount 9900, credits 25

Logic:
1. Create a Razorpay order using the Razorpay Node SDK.
2. Return: { orderId, amount, currency: "INR", keyId: RAZORPAY_KEY_ID }
```

### 8.2 POST `/api/payments/verify`

**Prompt for AI agent:**
```
Build a Next.js API route at /api/payments/verify.
Auth: Verify access_token.

Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, pack }

Logic:
1. Verify signature using HMAC SHA256 (razorpay_order_id + "|" + razorpay_payment_id signed with RAZORPAY_KEY_SECRET).
2. If signature invalid: return 400.
3. Add credits to user based on pack:
   - starter: +3, pro: +10, power: +25
4. Return: { success: true, newCredits }
```

### 8.3 Buy Credits UI (inside Dashboard)

**Prompt for AI agent:**
```
Build a BuyCredits modal component using design tokens from UI_theme.md.
- Triggered by "Buy more" link in dashboard
- Modal overlay (dark bg, centered card)
- Heading: "Buy Credits"
- 3 pack cards in a row (same as Pricing section on landing page)
- On pack select: call /api/payments/create-order, open Razorpay checkout
- On Razorpay success callback: call /api/payments/verify, update credits in UI
- On success: show "Credits added! You now have N credits." and close modal
```

---

## Section 9 — Full Page Rendering Order

```
deckiq.com/           → Landing page (all LandingPage/ components)
deckiq.com/login      → Login page
deckiq.com/signup     → Signup page
deckiq.com/terms      → Terms & Conditions
deckiq.com/dashboard  → Dashboard (protected)
deckiq.com/generations → All generations (protected)
```

---

## Section 10 — Animations Guide

**Prompt for AI agent:**
```
Use framer-motion for all animations in DeckIQ. Keep animations subtle and fast.

Rules:
- Fade + slide up on section entrance (y: 20 → 0, opacity: 0 → 1, duration: 0.4s)
- Stagger children in grids (staggerChildren: 0.08s)
- Navbar blur transition on scroll (CSS transition, not framer)
- Theme showcase horizontal scroll: CSS animation (marquee-style, pauses on hover)
- FAQ accordion: framer-motion AnimatePresence for smooth open/close
- Generation progress steps: each step fades in as it activates
- No bouncy springs — use ease: "easeOut" throughout
- Mobile: reduce or skip animations for performance
```

---

## Checklist for AI Agent

Before writing any component:
- [ ] Read `UI_theme.md` for all color tokens, font, and design rules
- [ ] Use Geist font everywhere
- [ ] Use CSS variables: `--accent-primary`, `--bg-primary`, `--bg-surface`, `--text-primary`, `--text-muted`
- [ ] Every component works in both light and dark mode
- [ ] Mobile responsive by default
- [ ] No hardcoded colors — always use tokens from UI_theme.md

Build order recommendation:
1. Set up Prisma schema + DB connection
2. AuthContext + ProtectedRoute
3. Auth API routes (signup, login, refresh)
4. Login + Signup pages
5. Dashboard page + Generate API
6. Generations page
7. Landing page (Navbar → Hero → ... → Footer)
8. Payments integration
9. Terms page
10. Final QA — light/dark mode, mobile, auth flows
```