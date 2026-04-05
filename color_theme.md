# DeckIQ — UI Theme Specification

## Brand
- **Product name:** DeckIQ
- **Tagline:** From the Makers of COREsume
- **Vibe:** Smart, Minimal, Premium

---

## Typography
- **Font family:** Geist
- **Import:** https://fonts.googleapis.com/css2?family=Geist:wght@400;500&display=swap
- **Heading:** Geist 500
- **Body:** Geist 400
- **Mono (optional):** JetBrains Mono — for code/hex values

---

## Color System

### Accent (both modes)
| Token | Hex | Usage |
|---|---|---|
| `--accent-primary` | `#5B4CF5` | Buttons, links, CTA |
| `--accent-hover` | `#7C6FF7` | Button hover (dark mode) |
| `--accent-hover` | `#4335C7` | Button hover (light mode) |
| `--accent-subtle-dark` | `#1E1A4A` | Badges, highlights (dark) |
| `--accent-subtle-light` | `#E8E6FC` | Badges, highlights (light) |

### Dark Mode
| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#0F0F14` | Page background |
| `--bg-surface` | `#1A1A28` | Cards, panels |
| `--bg-elevated` | `#252538` | Hover, dropdowns |
| `--text-primary` | `#FFFFFF` | Headings, body |
| `--text-muted` | `#A0A0B8` | Subtitles, captions |

### Light Mode
| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#F7F7FF` | Page background |
| `--bg-surface` | `#FFFFFF` | Cards, panels |
| `--bg-elevated` | `#EDEDFC` | Hover, tags |
| `--text-primary` | `#0F0F14` | Headings, body |
| `--text-muted` | `#5C5C7A` | Subtitles, captions |

### Indigo Ramp
| Stop | Hex |
|---|---|
| 50 | `#EEEDFE` |
| 100 | `#D4D0FB` |
| 200 | `#A89DF6` |
| 300 | `#7C6FF7` |
| 500 | `#5B4CF5` |
| 600 | `#4335C7` |
| 700 | `#2D228F` |
| 900 | `#1A1260` |

---

## CSS Variables (ready to use)
```css
/* Dark mode */
[data-theme="dark"] {
  --bg-primary: #0F0F14;
  --bg-surface: #1A1A28;
  --bg-elevated: #252538;
  --accent-primary: #5B4CF5;
  --accent-hover: #7C6FF7;
  --accent-subtle: #1E1A4A;
  --text-primary: #FFFFFF;
  --text-muted: #A0A0B8;
}

/* Light mode */
[data-theme="light"] {
  --bg-primary: #F7F7FF;
  --bg-surface: #FFFFFF;
  --bg-elevated: #EDEDFC;
  --accent-primary: #5B4CF5;
  --accent-hover: #4335C7;
  --accent-subtle: #E8E6FC;
  --text-primary: #0F0F14;
  --text-muted: #5C5C7A;
}
```

---

## Design Rules
- Border radius: `8px` (components), `12px` (cards)
- Border: `0.5px solid` using muted tones
- No gradients, no heavy shadows — flat and clean
- Accent color same in both modes, only bg/surface/text flips
- Spacing unit: `8px` base grid
- Min font size: `12px`
- Body line height: `1.7`
- Heading line height: `1.3`

---

## Status
- [x] Name finalized — DeckIQ
- [x] Color system finalized — Indigo + Dark/Light
- [x] Font finalized — Geist
- [ ] Logo
- [ ] Landing page
- [ ] Dashboard UI
- [ ] Pricing page
- [ ] Tech stack setup