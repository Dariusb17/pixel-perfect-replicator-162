# Plan: Electrician Landing Page (Vite + React SPA)

Build a pixel-perfect replica of the screenshots as a standalone Vite + React + Tailwind single-page app, with URL-param-driven dynamic content.

## Stack & setup
- Replace the current TanStack Start scaffold with a plain Vite + React (JSX) setup
- Tailwind CSS, Inter via Google Fonts
- Single `App.jsx`, no routing
- `index.html` with the specified meta tags
- `npm run build` outputs `dist/`

## File structure
```
index.html
vite.config.js
tailwind.config.js
postcss.config.js
package.json
src/
  main.jsx
  App.jsx
  index.css
  hooks/useParams.js
  components/
    Navbar.jsx        (logo "Electrician" + blue pill "Ofertă")
    Hero.jsx          (bg image, white headline, two CTAs)
    HeroImage.jsx     (rounded photo card section)
    About.jsx         ("Despre Noi" + stat cards 15+ Ani, 5000+)
    Services.jsx      ("Servicii Electrice Complete" + photo card "Instalații Electrice")
    Standards.jsx     ("Standarde de Execuție" — icon-only cards: Autorizați ANRE, etc.)
    Process.jsx       ("Procesul Nostru de Lucru" + photo + 4 numbered steps)
    Reviews.jsx       ("Ce spun clienții noștri" + 3 hardcoded testimonials)
    FAQ.jsx           ("Întrebări Frecvente" accordion w/ + buttons)
    CTA.jsx           ("Ai o urgență electrică?" card)
    Footer.jsx        (name, address, hours, maps link, copyright)
    FAQPopup.jsx      (popup behavior referenced in spec)
  assets/
    hero.jpg, services.jpg, process.jpg (stock fallbacks)
```

## Design tokens (from screenshots)
- Background: very light blue/lavender gradient (`#eef2ff` → `#f8fafc`)
- Cards: white, large radius (~24px), soft shadow, subtle border
- Primary: vivid blue `#2563eb` / `#3b82f6` (pill buttons, accents, step badges)
- Secondary button: pale blue `#e0e7ff` bg, blue text
- Text: near-black `#0f172a` headings, slate body
- Font: Inter, bold for H1/H2, medium for cards
- Navbar: white rounded pill, sticky-top look, with blue "Ofertă" pill on the right

## Dynamic content (URL params)
Read once on mount via `new URLSearchParams(window.location.search)`:

| Param | Used in | Default |
|---|---|---|
| `name` | navbar, footer, about, reviews subtitle, copyright | "Electrician" |
| `phone` | all call buttons `tel:`; CTA/WhatsApp `https://wa.me/` (digits only) | "07xx xxx xxx" display |
| `city` | hero, FAQ popup ("zona {city} și împrejurimi") | hidden if empty |
| `rating` | near business name (Google rating) | hidden if empty |
| `reviews` | "Peste {n} de clienți mulțumiți" | 5000 |
| `about` | Despre Noi paragraph; if empty keep static text but swap ElectroSafe→{name} | — |
| `address` | footer (hide if empty) | — |
| `maps_url` | "Deschide în Google Maps" link (hide if empty) | — |
| `hours` | footer/contact (hide if empty) | — |
| `photo1/2/3` | hero/services/process images, with `onError` fallback to bundled stock | bundled stock |

## Static content (verbatim from screenshots)
- All Romanian copy: headings, subheads, body text
- Three reviews: Ion Popescu (Proprietar casă), Maria Ionescu (Manager firmă), Andrei Dobre (Architect) — exact text as shown
- Four process steps: Apel sau Mesaj, Evaluare la fața locului, Execuția lucrărilor, Testare și Recepție
- Three "Standarde de Execuție" cards: icon + title + description only (no image above icon)
- FAQ items: Interveniți în weekend?, Ce zone acoperiți?, Oferiți factură? (accordion + button)
- "Made with Webild" badge is NOT replicated (it's the builder's overlay, not part of the site)

## Section order
1. Navbar
2. Hero (bg photo, headline "Electrician profesionist la orice oră", 2 CTAs)
3. Despre Noi (+ stat cards)
4. Hero photo card (rounded image block)
5. Servicii Electrice Complete (+ Instalații Electrice card)
6. Standarde de Execuție (icon cards)
7. Procesul Nostru de Lucru (photo + 4 steps)
8. Ce spun clienții noștri (3 reviews)
9. Întrebări Frecvente (accordion)
10. Ai o urgență electrică? (CTA card)
11. Footer

## Build & verify
- `npm run build` → confirm `dist/` is produced
- Visual check via preview against each screenshot

## Notes / technical details
- Current repo is TanStack Start; I will remove TanStack/Start files (`src/routes`, `src/router.tsx`, `src/start.ts`, `src/server.ts`, `wrangler.jsonc`, `routeTree.gen.ts`) and replace `package.json`, `vite.config`, `tsconfig` with a plain Vite + React JSX setup
- Plain JSX (no TS), Tailwind via `@tailwindcss/postcss` or v3 standard config — will use Tailwind v3 for simplicity since the spec says "Tailwind CSS" without specifying v4
- Phone normalization: strip non-digits for `tel:` and `wa.me`
