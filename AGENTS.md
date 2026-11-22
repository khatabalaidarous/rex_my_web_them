# AGENTS.md — CodeNest

> **Read this file first.** It is the entry point for any human or AI agent working on this project.
>
> **Current state:** The Next.js application is scaffolded and Phase 0–2 are complete. Phase 3 (Sanity) is in progress: the HTTP client and typed data layer exist with a local fallback; the Studio app, schemas and seed data do not exist yet. Verify the tree before assuming any file exists.
>
> **Last updated:** 2026-11-13

---

## 1. Mission

Build a world-class, bilingual (Arabic RTL + English LTR), interactive marketing website for a programming team. The site presents the team, services, projects, blog, and a contact path, and converts visitors into clients or partners.

**Temporary brand:** `CodeNest` / `كود نست`. It is a placeholder and can be renamed later without changing the architecture.

---

## 2. Non-negotiables

1. **Bilingual correctness:** Arabic is the default (`/ar`), English is `/en`. Both directions must work end-to-end.
2. **RTL is not optional:** logical CSS properties, mirrored directional icons, no `letter-spacing` on Arabic, Arabic line-height, `<bdi>` for mixed content.
3. **Premium but restrained:** dark-first visual identity, one violet accent + one mint accent, generous spacing, high-quality typography. Motion must serve clarity, never replace it.
4. **Performance:** RSC by default, `next/image`, self-hosted fonts, no heavy WebGL, no layout-thrashing animations. Budget: initial JS < 180KB gzipped, LCP < 2.5s, CLS < 0.1, INP < 200ms.
5. **Accessibility:** WCAG 2.2 AA target. Keyboard, focus, ARIA, contrast, reduced motion, 200% zoom, 320px width.
6. **No fake proof:** placeholder projects/testimonials must be clearly placeholder in the CMS. Never present invented people or client logos as real. No real-person photos in v1; use generated initials/avatars.
7. **Content from Sanity:** all editable content comes from Sanity. The code has a local fallback so `npm run build` works before Sanity is connected.
8. **No secrets in the client:** Sanity write token is server-only. Never expose it in `NEXT_PUBLIC_*`.
9. **Update this file after each phase** so the next session can resume without re-planning.

---

## 3. Tech stack (pin at install time)

| Package | Version (at plan time) | Role |
|---|---|---|
| `next` | `16.4.6` | App Router, RSC, metadata, route handlers |
| `react` / `react-dom` | 19.x | UI |
| `typescript` | 5.x | Types |
| `tailwindcss` | `4.3.5` | Styling |
| `next-intl` | `4.15.1` | i18n + locale routing |
| `next-themes` | `0.4.6` | Dark/light mode |
| `next-sanity` | not installed | We use a raw HTTP client in `lib/sanity/client.ts` |
| `sanity` | `6.23.0` | Studio + schemas (in `studio/`) |
| `gsap` | `3.15.1` | Scroll/reveal motion |
| `@gsap/react` | `2.1.2` | React integration |
| `lenis` | `1.3.27` | Optional smooth scroll |
| `lucide-react` | `1.72.0` | Icons |
| `react-hook-form` | `7.92.0` | Contact form |
| `zod` | `4.6.7` | Validation |
| `cmdk` | `1.1.1` | Command palette |
| `shadcn/ui` | CLI latest | Accessible UI primitives |

**Environment verified:** Node `22.12.0`, npm `10.9.0`, Git `2.54.0`, Windows PowerShell 5.1.

---

## 4. Repository map (planned)

```
.
├─ app/
│  ├─ [locale]/                 # root layout lives here (no app/layout.tsx)
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ about/page.tsx
│  │  ├─ services/page.tsx
│  │  ├─ work/page.tsx
│  │  ├─ work/[slug]/page.tsx
│  │  ├─ team/page.tsx
│  │  ├─ team/[slug]/page.tsx
│  │  ├─ blog/page.tsx
│  │  ├─ blog/[slug]/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ search/page.tsx
│  │  ├─ privacy/page.tsx
│  │  ├─ terms/page.tsx
│  │  └─ not-found.tsx
│  ├─ api/contact/route.ts
│  ├─ api/search/route.ts
│  ├─ api/revalidate/route.ts   # optional Sanity webhook
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ manifest.ts
│  ├─ icon.svg
│  └─ globals.css
├─ components/
│  ├─ layout/                   # Header, Footer, LocaleSwitcher, ThemeToggle, CommandPalette, WhatsAppFloat
│  ├─ sections/                 # Hero, LogoCloud, Stats, Services, FeaturedWork, Process, TechStack, TeamPreview, Testimonials, BlogPreview, FAQ, CTA
│  ├─ ui/                       # Button, Card, Badge, Accordion, Dialog, Tabs, Input, Textarea, Marquee, Reveal, Counter, TiltCard, MagneticLink, CodeWindow
│  ├─ motion/                   # SmoothScroll, RevealProvider, PageTransition
│  └─ sanity/                   # PortableText, SanityImage, RichText
├─ content/                     # Local placeholder fallback
├─ i18n/                        # routing.ts, navigation.ts, request.ts, messages/{ar,en}.json
├─ lib/                         # sanity/client.ts, data.ts, seo.ts, utils.ts
├─ studio/                      # Separate Sanity Studio app (CMS)
├─ public/                      # logo, og, avatars, icons
├─ tests/                       # unit + e2e
├─ docs/                        # Project documentation (this handoff)
├─ .kilo/skill/codenest-handoff/SKILL.md
├─ proxy.ts                     # Next 16 locale proxy (replaces middleware.ts)
├─ next.config.ts
├─ postcss.config.mjs
├─ tsconfig.json
├─ eslint.config.mjs
├─ package.json
└─ README.md
```

**Critical architecture rules:**

- **No `app/layout.tsx`.** `app/[locale]/layout.tsx` is the root layout and renders `<html lang dir>`.
- **No `/studio` route in Next.** Sanity Studio is a separate app in `studio/` (`npm run dev` / `npm run deploy`). This avoids multiple-root-layout conflicts.
- **Next 16 uses `proxy.ts`**, not `middleware.ts`. Export `proxy` or default. Do not use `runtime: 'edge'`.
- **next-intl:** `defineRouting`, `createNavigation`, `getRequestConfig`, and `setRequestLocale(locale)` in layouts/pages.
- **Sanity fallback:** `lib/data.ts` uses Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` exists; otherwise it reads `content/*.ts`. The build must pass in both modes.

---

## 5. Commands (after scaffold)

```bash
npm run dev            # http://localhost:3000/ar
npm run build
npm run lint           # eslint .
npx tsc --noEmit
npm run test           # Vitest
npm run test:e2e       # Playwright
cd studio && npm run dev     # Sanity Studio on :3333
cd studio && npm run deploy  # Deploy Studio
```

If `create-next-app` does not add a `lint` script, set it to `eslint .` (Next 16 removed `next lint`).

---

## 6. Conventions

### TypeScript / React
- Strict TypeScript. No `any` unless justified with a comment.
- Server Components by default; `use client` only for interactivity.
- One component per file, named exports for components, default export for pages/layouts.
- `next/image` for all images; explicit `sizes`; `priority` only for the hero.
- Use `next-intl` `Link`/`useRouter`/`usePathname` for locale-aware navigation.

### Styling
- Tailwind v4 with `@theme` tokens. No hardcoded hex values in components.
- Logical properties: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`.
- Dark mode via `class` on `<html>` (`next-themes`), tokens in `globals.css`.
- No `letter-spacing` on Arabic. Arabic body line-height 1.8–1.9.
- Animate only `transform`, `opacity`, `clip-path`. Never `width/height/top/left`.
- All motion respects `prefers-reduced-motion` and is disabled/reduced on touch for cursor/tilt effects.

### Content / Sanity
- Localized fields are `{ ar, en }` objects; use `pickLocale(value, locale)`.
- One slug per document, used in both locales.
- Required `alt` text for every image.
- GROQ queries live in `lib/data.ts` (one projection per getter); no inline queries in pages, and no page imports `content/site.ts` arrays directly.
- Revalidate with tags (`projects`, `posts`, `team`, `services`).

### RTL / i18n
- `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`.
- Mirror only directional icons; never mirror logos, URLs, phone numbers, or code.
- Keep code windows and code samples `dir="ltr"`.
- Use `Intl.NumberFormat('ar-u-nu-latn')` for consistent Latin digits unless the client explicitly chooses Arabic-Indic digits.

### Git
- Do not commit secrets, `.env.local`, `node_modules`, `.next`, or Sanity generated files.
- Commit messages: short imperative summary (e.g., `feat: add hero section`).
- Do not commit unless the user explicitly asks.

---

## 7. Current state (verify before acting)

- [x] Project plan written and approved for documentation.
- [x] Handoff docs and skill created.
- [x] Next.js app scaffolded (`package.json`, `app/`, `node_modules`).
- [x] Design tokens and i18n configured.
- [x] Home page built (all sections: hero, sectors, services, work, process, stats, tech cards, team preview, testimonials, blog preview, FAQ, CTA, footer).
- [x] Inner pages built (About, Services, Work + detail, Team + member detail, Blog + post, Contact + form, Search, Privacy, Terms, Studio CMS, 404 done).
- [x] Built-in CMS & Database connected (Firebase Firestore + Auth, `firestore.rules`, `lib/firebase/cms.ts`, `lib/data.ts` with local fallback, `/[locale]/studio` admin dashboard + real-time contact inbox + seed sync).
- [x] Advanced motion added (GSAP reveals, counters, marquee, tilt, cursor spotlight, magnetic CTAs, scroll progress, command palette ⌘K, page transitions).
- [x] Core QA, build, typecheck, and lint verified.

**Phase 3 & Polish completed (2026-11-16):** External Sanity & Resend dependencies removed (`studio/` standalone Sanity app and `lib/sanity/client.ts` deleted). Replaced with built-in Firebase Firestore + Auth (`firebase-applet-config.json`, `firestore.rules`, `firebase-blueprint.json`), `lib/firebase/client.ts`, `lib/firebase/cms.ts`, `components/providers/firebase-provider.tsx`, and an integrated bilingual `/[locale]/studio` admin CMS + real-time contact inbox (including automatic legacy `siteSettings` brand/aboutMission sync on admin sign-in). `/api/contact` persists submissions directly to `contactSubmissions` in Firestore; `/api/revalidate` verifies Firebase Admin ID tokens (plus `admins/{uid}` fallback) and purges Next.js cache tags. Privacy, Terms, About, Contact, CTA, Blog, Services, Layout JSON-LD, Search, and CommandPalette are all wired to the unified cached data layer (`lib/data.ts`), placeholder notices render conditionally per record, Studio supports full sub-editors (`results`, `responsibilities`, `legal.sections`, slug rename cleanup, empty states, synced initial defaults, team portrait presets/picker, and schema-aligned validation) with inline two-step delete confirmations, `Reveal`/`Counter` handle reduced-motion and non-numeric/decimal stats cleanly, `app/not-found.tsx` wraps proper `<html>`/`<body>` tags, and Vitest unit tests (`tests/`) verify contact validation, SEO helpers, Arabic search normalization, admin email checks, and bilingual fallback integrity. Branded as **Next Soft / نكست سوفت** (`BrandMark` geometric `NS` monogram, updated `app/icon.svg`, `app/apple-icon.tsx`, `app/manifest.ts`, `hello@nextsoft.dev`, Yemen `+967 716 713 514`), upgraded full-site SEO (`pageMetadata` across all indexable/detail routes with member portrait `og:image`, enriched Schema.org `Organization` + `ProfessionalService` + `WebSite` JSON-LD, prioritized `app/sitemap.ts`, `app/robots.ts`, automatic `VERCEL_PROJECT_PRODUCTION_URL` detection in `lib/site.ts`), Arabic-normalized multi-token search (`lib/search.ts`, `CommandPalette`, `/[locale]/search`), editorial studio portraits (`public/images/team/*.jpg` rendered via `TeamPortrait` across home `TeamPreview`, `/team`, `/team/[slug]`, and Studio `TeamEditor`, backed by `avatar` support in `firestore.rules` & `firebase-blueprint.json`), **primary Header navigation** expanded cleanly to include **Blog (`/blog`) & Team (`/team`)**, **self-service custom brand logo & team portrait uploaders** (`logoUrl` & `avatar` persisted in Firestore with client-side SVG sanitization/canvas compression in `lib/logo-upload.ts`, shared SSRF-safe proxy helper `lib/remote-image.ts` powering `/api/brand-logo` & `/api/team-avatar/[slug]`, live previews & 1-click reset in Studio), and **site-wide editorial design polish** (`Hero`, `Services`, `Work`, `ProjectCard`, `TeamPreview`, `BlogPreview`, `/blog` featured article layout, `Stats`, `Sectors`, `CTA`, `Testimonials`, `PageHero`, `SectionHeading`).

**Environment gotchas:**

- PowerShell 5.1 blocks `npm.ps1` → run `cmd /c "npm ..."`.
- `fonts.googleapis.com` is unreachable → `next/font/google` was removed; `app/globals.css` defines a system stack (`Dubai`/`Segoe UI` for Arabic). Replace with `next/font/local` + self-hosted woff2 when possible.
- npm registry is very slow (~10 min installs); prefer `npm ci --prefer-offline --no-audit --no-fund --ignore-scripts`.
- Never copy a partially installed `node_modules` (it corrupted `@babel/core`); always finish with `npm ci`.

**Verification commands for a new session:**

```powershell
Get-ChildItem -Force
Test-Path package.json
Test-Path node_modules
cmd /c "node node_modules\typescript\bin\tsc --noEmit"
cmd /c "npx eslint ."
cmd /c "npm run build"
```

---

## 8. Next step — Phase 0 (start here)

> **Phase 0 is complete.** The commands below are the original scaffold recipe, kept for reference. The app is already scaffolded; continue with the next unchecked item in `docs/ROADMAP.md`.

```bash
# 1) Scaffold in the current empty directory
npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack --yes

# 2) Core packages
npm install next-intl@4.15.1 next-themes@0.4.6 gsap@3.15.1 @gsap/react@2.1.2 lenis@1.3.27 lucide-react@1.72.0 react-hook-form@7.92.0 zod@4.6.7 cmdk@1.1.1
# not used: the app reads Sanity through lib/sanity/client.ts (raw fetch)

# 3) Dev tooling
npm install -D @playwright/test vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @axe-core/playwright

# 4) shadcn/ui
npx shadcn@latest init -d
npx shadcn@latest add button card badge accordion dialog tabs input textarea dropdown-menu sheet tooltip sonner

# 5) Sanity Studio (separate app)
npm create sanity@latest studio
cd studio
npm install
npm run dev
```

Then:

1. Create `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`, `messages/ar.json`, `messages/en.json`.
2. Replace `app/layout.tsx`/`app/page.tsx` with `app/[locale]/layout.tsx` + `app/[locale]/page.tsx`.
3. Add `proxy.ts` with next-intl middleware.
4. Implement design tokens + fonts in `globals.css` and the root layout.
5. Build `Header`, `Footer`, `ThemeToggle`, `LocaleSwitcher`.
6. Add `content/*.ts` placeholder data + `lib/data.ts` fallback.
7. Add `.env.example` and `.gitignore`.
8. Run `npm run dev`, `npm run build`, `npm run lint`, `npx tsc --noEmit`.

**Phase 0 acceptance:** app boots at `/ar` and `/en`, dark/light works, RTL/LTR correct, build and lint pass, no Sanity env required.

---

## 9. Definition of Done (project-level)

- [ ] All routes work in `/ar` and `/en`; RTL/LTR correct.
- [ ] Home page contains every section; responsive at 375/768/1440/1920.
- [ ] Sanity: content editable/publishable; build works with and without env.
- [ ] Contact form validates, stores (or shows a clear demo state), and has success/error states.
- [ ] SEO: metadata, hreflang, sitemap, robots, JSON-LD.
- [ ] Lighthouse ≥ 90 (accessibility 100), Axe clean.
- [ ] No build/lint/type/console errors.
- [ ] README + deployment + content guide.
- [ ] No placeholder copy visible as final content.

---

## 10. Handoff protocol (important)

At the end of **every** working session:

1. Update **Section 7 — Current state** in this file.
2. Update `docs/ROADMAP.md` with the phase status and any blockers.
3. List files changed and commands run.
4. Note any decisions that changed.
5. If a new convention or gotcha was discovered, add it to `docs/DECISIONS.md` and the skill.

A new agent must be able to resume by reading:

1. `AGENTS.md`
2. `.kilo/skill/codenest-handoff/SKILL.md`
3. `docs/ROADMAP.md`
4. The relevant doc in `docs/`

---

## 11. Documentation index

| File | Purpose |
|---|---|
| `README.md` | Quick start, scripts, structure |
| `docs/PLAN.md` | Full implementation plan (research, architecture, phases, QA, risks) |
| `docs/ROADMAP.md` | Status, phases, next steps |
| `docs/PROJECT.md` | Mission, audience, pages, features |
| `docs/ARCHITECTURE.md` | Stack, data flow, rendering, i18n |
| `docs/DESIGN.md` | Colors, fonts, spacing, motion, components |
| `docs/CONTENT.md` | Content model + placeholder copy |
| `docs/QA.md` | Verification and acceptance checklist |
| `docs/DEPLOYMENT.md` | Env, Vercel/Node, Sanity, domain |
| `docs/DECISIONS.md` | Decision log / ADRs |

---

## 12. Open decisions

1. Real team name (currently `CodeNest`).
2. Domain + hosting (Vercel recommended; code is Node-standard).
3. Official email, WhatsApp number, social links.
4. Final accent color: violet `#7C5CFF` vs mint `#4FE3C1`.
5. Arabic-Indic vs Latin digits (plan: Latin).
6. Pricing section: not included for now.
7. Analytics: not selected.
8. Sanity Studio protection: not decided.
9. Real content vs placeholder (currently placeholder).
10. Final privacy/terms copy.

---

## 13. Quick facts for any agent

- The project is a **marketing website**, not a SaaS dashboard and not a mobile app.
- The primary conversion action is **contact/WhatsApp**, secondary is **view work**.
- The audience is Arabic-speaking clients plus English-speaking technical partners.
- The design is **dark-first premium**, but a light mode is required.
- The CMS is **Sanity**; the frontend is **Next.js**.
- The site must work **without JavaScript** for core content where possible.
- The first implementation milestone is **Phase 0**, not a full redesign.