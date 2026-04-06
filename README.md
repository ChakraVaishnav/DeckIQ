# DeckIQ — AI-Powered Presentation Generator

> Generate stunning, professional PowerPoint presentations in seconds using AI. Just type a topic, let DeckIQ write and design every slide, preview the theme, and download your `.pptx` — all in one click.

---

## ✨ Features

- **AI Slide Generation** — Powered by `Qwen/Qwen2.5-7B-Instruct` via HuggingFace Inference API
- **15 Premium Themes** — AI picks the best theme for your topic; you can override it
- **Interactive Theme Picker** — Preview your deck in any theme before saving
- **One-Click Download** — `.pptx` file auto-downloads after you confirm
- **Credit System** — 3 free generations on signup; buy more via Razorpay
- **Generations History** — All your past decks stored and accessible
- **JWT Auth** — Secure signup/login with access + refresh token flow
- **Dark / Light Mode** — Full theme toggle across all pages
- **Supabase Storage** — PPT files stored securely, DB records in PostgreSQL
- **Fully Vercel-deployable** — No external servers needed

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v4 |
| AI Model | Qwen/Qwen2.5-7B-Instruct (HuggingFace) |
| PPT Generation | pptxgenjs |
| Database | Supabase PostgreSQL (via Prisma ORM) |
| Storage | Supabase Storage |
| Auth | Custom JWT (access token + HttpOnly refresh cookie) |
| Payments | Razorpay |
| Animations | Framer Motion |
| Deployment | Vercel |

---

## 🏗️ Architecture

```
User
 │
 ▼
Next.js App (Vercel)
 ├── Landing Page        — Hero, Features, Pricing, FAQ, CTA
 ├── /signup             — Email → Username → Password
 ├── /login             — Email + Password
 ├── /dashboard          — Generate deck + History
 └── /generations        — All saved presentations
         │
         ▼
 /api/generate  (SSE Streaming)
   ├── action: 'generate'
   │     ├── Qwen AI  → slide titles + bullets + theme suggestion
   │     └── Returns slidesData to frontend (no upload yet)
   │
   └── action: 'confirm'  (after user picks theme)
         ├── pptxgenjs  → builds .pptx buffer
         ├── Supabase Storage  → uploads file
         ├── Prisma  → saves PPT record to DB
         └── Returns fileUrl → auto-download triggered
```

---

## 🎬 Generation Flow

```
1. User enters topic + slide count
          ↓
2. AI generates: slide titles, bullets, subtitle, conclusion, theme
          ↓
3. Theme Preview screen:
   - DeckIQ shows its suggested theme (large preview)
   - Scrollable row of 15 theme cards to choose from
          ↓
4. User clicks "Save & Download .pptx"
          ↓
5. Backend builds PPTX → uploads to Supabase → saves to DB
          ↓
6. File auto-downloads + stored in Generations page
```

---

## 🗂️ Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.js
│   │   │   ├── login/route.js
│   │   │   ├── refresh/route.js
│   │   │   └── logout/route.js
│   │   ├── generate/route.js        ← Main AI generation + confirm
│   │   ├── generations/route.js     ← Fetch user's saved PPTs
│   │   └── payments/
│   │       ├── create-order/route.js
│   │       └── verify/route.js
│   ├── dashboard/page.jsx
│   ├── generations/page.jsx
│   ├── login/page.jsx
│   ├── signup/page.jsx
│   └── page.js                      ← Landing page
├── components/
│   ├── LandingPage/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Features.jsx
│   │   ├── ThemeShowcase.jsx
│   │   ├── Pricing.jsx
│   │   ├── FAQ.jsx
│   │   ├── CTA.jsx
│   │   └── Footer.jsx
│   ├── Dashboard/
│   │   ├── GenerateInput.jsx        ← 5-stage generation UI
│   │   └── PPTCard.jsx
│   └── shared/
│       └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── lib/
│   ├── prisma.js
│   ├── supabase.js
│   └── auth.js
└── app/globals.css                  ← Tailwind v4 @theme tokens
```

---

## 🗃️ Database Schema (Prisma + Supabase)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String                    // bcrypt hashed
  credits   Int      @default(3)      // 3 free on signup
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ppts      PPT[]
  ratings   Rating[]
}

model PPT {
  id           String   @id @default(cuid())
  userId       String
  title        String
  theme        String
  slideCount   Int
  fileUrl      String                 // Supabase Storage URL
  thumbnailUrl String?
  createdAt    DateTime @default(now())
  user         User     @relation(...)
  ratings      Rating[]
}

model Rating {
  id        String   @id @default(cuid())
  userId    String
  pptId     String
  score     Int                       // 1–5
  createdAt DateTime @default(now())
}
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase (PostgreSQL)
DATABASE_URL="postgresql://..."           # Connection pooling URL (port 6543)
DIRECT_URL="postgresql://..."            # Direct URL for migrations (port 5432)

# Supabase API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=deckiq-ppts

# JWT Auth
JWT_ACCESS_SECRET=min_32_char_secret_here
JWT_REFRESH_SECRET=min_32_char_secret_here

# HuggingFace AI
HUGGINGFACE_TOKEN=hf_your_token_here

# Payments
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret

# Optional
PEXELS_API_KEY=your_pexels_key          # For slide images (gracefully skipped if missing)
TAVILY_API_KEY=your_tavily_key          # For web search per slide (optional)
```

---

## 🛠️ Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
- Create a project at [supabase.com](https://supabase.com)
- Create a Storage bucket named `deckiq-ppts` (set to public)
- Copy your connection URLs + API keys into `.env.local`

### 3. Push database schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎨 Themes Available (15)

| Theme | Vibe |
|---|---|
| `dark_tech` | Futuristic & Bold |
| `minimal_light` | Clean & Professional |
| `corporate_blue` | Trustworthy & Formal |
| `vibrant_creative` | Bold & Energetic |
| `nature_green` | Calm & Sustainable |
| `berlin` | Modern & Urban |
| `slate_dark` | Sophisticated |
| `coral_energy` | High Energy |
| `midnight` | Deep & Technical |
| `arctic` | Fresh & Scientific |
| `emerald` | Premium & Growth |
| `neon_noir` | Cyber & Creative |
| `golden_hour` | Luxury & Warm |
| `ocean_depths` | Deep & Research |
| `pastel_dream` | Soft & Elegant |

---

## 💰 Credit System

| Action | Credits |
|---|---|
| Sign up | +3 free |
| Generate a deck | -1 |
| Generation fails | Restored |
| Buy credits | Via Razorpay |

---

## 🚢 Deploy to Vercel

```bash
# Push repo to GitHub, then:
npx vercel --prod

# Or connect via vercel.com dashboard
```

Add all `.env.local` variables to **Vercel → Project → Settings → Environment Variables**.

> The app deploys as a single Next.js project. No separate servers needed.

---

## 📌 Known Limitations / Next Steps

- [ ] Pexels image integration (key required — gracefully skipped if missing)
- [ ] Tavily web search per slide (key required — gracefully skipped if missing)
- [ ] Email verification on signup
- [ ] Thumbnail preview in Generations page
- [ ] PPT rating system (DB model ready, UI pending)
- [ ] Admin dashboard for credit management

---

## 👤 Author

Built with ❤️ using **DeckIQ** — AI-powered presentations, instantly.
