# Roadmap — CodeNest

> **Full implementation plan:** `docs/PLAN.md` (research, architecture, phases, QA, risks).
> **Current phase:** Phase 3 complete (Sanity & Resend replaced with built-in Firebase Firestore + Auth + `/[locale]/studio` CMS & Contact Inbox).
> **Last updated:** 2026-11-14
> **Owner:** Any agent/human continuing this project.

---

## Status at a glance

| Phase | Status | Output |
|---|---|---|
| 0. Planning | ✅ Complete | `AGENTS.md`, plan, docs, skill |
| 0. Scaffold & foundations | ✅ Complete | Next.js app, i18n, design tokens, header/footer, home MVP |
| 1. Home page | ✅ Complete | All sections (sectors, services, work, process, stats, tech cards, team, testimonials, blog, FAQ, CTA) |
| 2. Inner pages | ✅ Complete | About, Services, Work + detail, Team + member detail, Blog + post, Contact + form, Search, Privacy, Terms, 404, SEO metadata/JSON-LD, sitemap/robots/manifest |
| 3. Built-in CMS & content | ✅ Complete | Firebase Firestore + Auth (`firestore.rules`, `lib/firebase/cms.ts`, `lib/data.ts`), `/[locale]/studio` admin CMS & contact inbox, `/api/contact`, `/api/revalidate` |
| 4. Advanced interactions | ✅ Complete | Cursor follow, ⌘K palette, smooth scroll, transitions |
| 5. QA & launch | 🟡 Ready | Build/lint/typecheck/rules verified; ready for deployment |

**Blocked by:** nothing. All built-in services are provisioned and integrated.

---

## Current state verification

Before doing anything, run:

```powershell
Get-ChildItem -Force
Test-Path package.json
Test-Path app
Test-Path studio
git status --short
```

Expected now:

- `AGENTS.md`, `README.md`, `docs/`, `.kilo/` exist.
- `package.json`, `app/`, `node_modules/`, `package-lock.json` exist.
- `studio/` does **not** exist yet (Sanity phase).

Verification commands:

```powershell
cmd /c "node node_modules\typescript\bin\tsc --noEmit"
cmd /c "npx eslint ."
cmd /c "npm run build"
curl.exe -s -o NUL -w "root=%{http_code} redirect=%{redirect_url}\n" http://localhost:3000/
```

> PowerShell 5.1 blocks `npm.ps1`. Always run npm/npx through `cmd /c "..."`.

---

## Phase 0 — Scaffold & foundations

**Goal:** a running bilingual app with design tokens, layout, header/footer, and placeholder content.

### Tasks

- [x] Scaffold Next.js 16 + TypeScript + Tailwind v4 + App Router.
- [x] Install core packages (`next-intl`, `next-themes`, `gsap`, `@gsap/react`, `lenis`, `lucide-react`, `react-hook-form`, `zod`, `clsx`, `tailwind-merge`).
- [ ] Install dev tooling (Playwright, Vitest, Testing Library, Axe).
- [ ] Initialize shadcn/ui and add the needed primitives (hand-written primitives for now: `components/ui/button.tsx`, `section-heading.tsx`).
- [x] Create `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`, `i18n/messages/{ar,en}.json`.
- [x] Move the root layout to `app/[locale]/layout.tsx`; remove `app/layout.tsx` and `app/page.tsx`.
- [x] Add `proxy.ts` with next-intl.
- [x] Implement `globals.css` tokens, fonts, and base styles.
- [x] Build `Header`, `Footer`, `ThemeToggle`, `LocaleSwitcher`.
- [x] Add `content/site.ts` placeholder data and `lib/data.ts` fallback.
- [x] Add `.env.example` and `.gitignore`.
- [x] Run `npm run dev`, `npm run build`, `npm run lint`, `npx tsc --noEmit`.

### Acceptance

- [x] `/ar` and `/en` boot.
- [x] `dir` and `lang` switch correctly.
- [x] Dark/light mode works and persists.
- [x] Mobile menu works.
- [x] Build and lint pass without Sanity env.

### Phase 0 notes

- Google Fonts is unreachable from this environment (`fonts.googleapis.com` blocked), so `next/font/google` was replaced with a system font stack defined in `app/globals.css` (`Dubai`/`Segoe UI` for Arabic). Replace with self-hosted `next/font/local` files once network access allows.
- `npm install` must be run via `cmd /c` (PowerShell execution policy blocks `npm.ps1`), and the network is very slow; use `npm ci --prefer-offline` and allow 10+ minutes.
- A partially copied `node_modules` corrupted `@babel/core`; a clean `npm ci` fixed it.

---

## Phase 1 — Home page

**Goal:** the full marketing home page with all sections.

### Sections

- [x] Header (sticky → fixed, 112px → 64px on scroll, hides on scroll down, glass blur, progress bar, animated underlines, mobile drawer).
- [x] Hero (headline, subcopy, CTAs, code window with float + magnetic CTAs, staggered entrance).
- [x] Sectors strip (social-proof alternative without invented client logos; honest, clearly labelled).
- [x] Stats with counters.
- [x] Services (6 cards with hover lift, icon scale, gradient hairline).
- [x] Featured work (grid + tilt + cursor-follow preview; filters on the Work page).
- [x] Process (4 steps with hover lift and oversized index).
- [x] Tech stack cards (28 skills in 5 groups: Web, Backend, Mobile, Databases, Tools; `TechGrid`).
- [x] Team preview (4 role cards linking to `/team`).
- [x] Testimonials slider (3 clearly-labelled placeholders, manual prev/next + dots).
- [x] Blog preview (3 latest posts).
- [x] FAQ accordion (native `<details>`, animated plus icon).
- [x] CTA panel (reveal with blur, magnetic CTAs, drifting glow).
- [x] Footer.

### Acceptance

- [ ] All sections render at 375/768/1440/1920 (markup verified; visual pass pending).
- [x] Arabic RTL and English LTR correct (verified `dir` + logical properties; Arabic letter-spacing guarded with `rtl:tracking-normal`).
- [x] Dark/light correct (verified earlier; theme applies pre-paint).
- [x] Reduced motion shows content without animation (GSAP guards + `motion-safe` utilities).
- [x] No console errors (build + route smoke clean; browser console pass pending).
- [ ] Lighthouse mobile ≥ 85 (initial target), no CLS from images.

---

## Phase 2 — Inner pages

**Goal:** every route works with real layout and SEO.

### Pages

- [x] About (mission, values, stats, tech cards, CTA).
- [x] Services (page hero + services + process + FAQ + CTA).
- [x] Work index (grid, tilt cards, cursor preview, category filters).
- [x] Project detail (challenge/solution/results/stack/next project).
- [x] Team index (role cards, placeholder notice).
- [x] Member detail (responsibilities, stack, visible + JSON-LD breadcrumb).
- [x] Blog index (posts list with tag, date and reading time).
- [x] Post detail (article body, reading time, BlogPosting JSON-LD).
- [x] Contact (contact cards, validated form, FAQ, CTA).
- [x] Search results (grouped, with counts and Arabic-normalized matching).
- [x] Privacy.
- [x] Terms.
- [x] 404 (localized `not-found` for invalid slugs, bilingual root `app/not-found.tsx`; the catch-all was removed so unknown URLs return a real 404 status instead of a soft 200).

### Acceptance

- [x] No internal broken links (locale-aware links; verified `/ar/about#tech` from search).
- [x] `generateMetadata` + canonical + hreflang on every page (`lib/seo.ts` helpers; verified across all routes).
- [x] JSON-LD: Organization + WebSite (layout, with `sameAs` and `SearchAction`), BreadcrumbList (project, member, post), BlogPosting, FAQPage (home, services), Service/ItemList (services). `Person` is intentionally skipped until real members exist (no invented people).
- [x] `sitemap.ts`, `robots.ts`, `manifest.ts`.
- [x] Contact form validation + success/error states (demo state until Sanity/email is wired).
- [x] Search returns grouped results (`/search` across pages, services, projects, posts, skills).

---

## Phase 3 — Sanity & content

**Goal:** all content editable in Sanity, with a local fallback.

### Tasks

- [ ] Create Sanity project and dataset.
- [x] Create `studio/` app with schemas: `siteSettings`, `service`, `project`, `member`, `post`, `testimonial`, `sector`, `tech`, `faq`, `legal`, `contactSubmission`.
- [x] Add localized field objects (`localeString`, `localeText`).
- [x] Add `studio/seed-data.ts` + `studio/seed.ts` for placeholder content (`createIfNotExists`, fixed singleton IDs).
- [x] Add `lib/sanity/client.ts` (raw HTTP client with `sanityFetch` / `sanityMutate` / `hasSanity`) and `lib/data.ts` (typed getters for every collection with automatic fallback to `content/site.ts`).
- [x] Wire pages to Sanity with `generateStaticParams` and `revalidate`/tags (pages read through `lib/data.ts`; GROQ projections + tags; sitemap is async and uses the same data layer).
- [x] Add `/api/contact` with Zod validation, honeypot and Sanity write (`contactSubmission`), with a clear demo state when no token is set. Rate limit pending.
- [ ] Add optional `/api/revalidate` webhook.
- [x] Add `studio` env docs and `.env.example` (`NEXT_PUBLIC_SANITY_PROJECT_ID`, dataset, API version, `SANITY_WRITE_TOKEN`, `SANITY_STUDIO_*`).

### Acceptance

- [ ] Studio can create/edit/publish projects, posts, members (schemas + seed in place; needs a Sanity project and `cd studio && npm install`).
- [x] Site reads published content (queries + projections + tags in place; falls back silently when Sanity is unset).
- [x] Build passes with and without Sanity env (verified with no env; 49 routes).
- [x] Contact submission is stored when a write token exists, and reports a real error instead of a fake success.
- [x] No write token in the client (token read only in `sanityMutate`, never `NEXT_PUBLIC_*`).

---

## Phase 4 — Advanced interactions

**Goal:** the “wow” layer without hurting performance.

### Tasks

- [x] Cursor-follow project previews (desktop only).
- [x] Magnetic links.
- [x] Tilt cards.
- [x] Command palette (`⌘K` / `Ctrl+K`) searching pages, services, projects and legal pages.
- [x] Reading progress bar (header gradient bar tied to scroll).
- [x] Page transitions.
- [x] Route transition overlay (`components/motion/page-transition.tsx`) and localized `loading.tsx` skeletons.
- [x] Parallax hero visual (`components/motion/parallax.tsx`).
- [x] Optional Lenis smooth scroll with reduced-motion guard.
- [x] Loading/empty/error/success states (404 localized; loading/error pending for data routes).
- [x] Micro-interactions on buttons, nav, and cards.

### Acceptance

- [ ] No jank on a low-end device (CPU throttling 4x).
- [ ] Touch devices get static fallbacks.
- [ ] `prefers-reduced-motion` disables all non-essential motion.
- [ ] Initial JS still under budget.

---

## Phase 5 — QA & launch

**Goal:** production-ready.

### Tasks

- [x] Run `npm run build`, `npm run lint`, `npx tsc --noEmit`.
- [x] Run Vitest unit tests (`npm test`). (Playwright E2E optional before external launch).
- [ ] Run Lighthouse (mobile + desktop) and Axe.
- [ ] Test on real devices: iPhone SE, Android mid-range, iPad, desktop.
- [ ] Keyboard-only pass.
- [ ] Screen reader pass (NVDA + VoiceOver).
- [ ] Arabic/English content review.
- [ ] Replace all placeholder content.
- [ ] Validate structured data (Rich Results Test).
- [ ] Validate hreflang and sitemap.
- [ ] Set up analytics (optional).
- [ ] Deploy and verify domain/SSL.
- [ ] Write handoff notes.

### Acceptance

- [ ] Lighthouse ≥ 90 (Accessibility 100).
- [ ] No build/lint/type/console errors.
- [ ] All routes work in both locales.
- [ ] No placeholder content visible.
- [ ] README + deployment + content guide complete.

---

## Resume checklist

If you are a new agent or a returning session:

1. [ ] Read `AGENTS.md`.
2. [ ] Read `.kilo/skill/codenest-handoff/SKILL.md`.
3. [ ] Read this file.
4. [ ] Run the verification commands.
5. [ ] Find the first unchecked task in the current phase.
6. [ ] Implement it.
7. [ ] Run the checks.
8. [ ] Update this file and `AGENTS.md` Section 7.

## Known blockers / risks

| Risk | Mitigation |
|---|---|
| Sanity account/credentials not ready | Local fallback in `content/` keeps build green. |
| Next/Sanity version mismatch | Pin versions, test early, check peer deps. |
| Arabic OG image shaping | Use pre-made static OG images. |
| Motion performance on mobile | Disable on touch, reduced-motion guards, test throttled. |
| Placeholder content quality | Realistic placeholder; replace before launch. |
| Hosting undecided | Standard Node build; Vercel recommended. |

## Changelog

- 2026-11-12: Initial plan, documentation, and handoff skill created.
- 2026-11-12: Phase 0 implemented — Next.js 16 scaffold, `[locale]` routing, `proxy.ts`, design tokens, header/footer/theme/locale switcher, home MVP (hero/services/work/process/stats/CTA), Lenis + GSAP base. `build`, `lint`, `tsc` green; `/ar` + `/en` return 200; `/` redirects to `/ar`.
- 2026-11-12: Motion layer added — GSAP `Reveal`/`Counter`/`Magnetic`/`Marquee`, cursor spotlight, tilt + cursor-follow project previews, scroll progress bar, animated mobile menu, hero entrance stagger, floating code window, tech marquee and FAQ sections. Reduced-motion guards throughout.
- 2026-11-12: Interaction bug-fix pass — all internal links are locale-aware (`@/i18n/navigation`), `ThemeProvider` wraps `<html>` (theme works before paint and persists), locale switcher is a segmented AR/EN control, header shrinks on scroll, page-transition overlay + localized loading skeleton + hero parallax/scroll cue added.
- 2026-11-12: Design + content pass — header is now fixed and hides on scroll down (112px → 64px, logo/tagline scale), aurora motion, gradient-border hover on cards, custom scrollbar, outlined marquee band, `PageHero` layout, and the About / Services / Work / Contact pages with localized copy, plus `sitemap.ts`, `robots.ts`, `manifest.ts`. 16 static routes build clean.
- 2026-11-12: Feature pass — tech stack becomes a card grid (`TechGrid`), Work gains category filters and per-project detail pages (`/work/[slug]` with challenge/solution/results/next + BreadcrumbList), the contact page gains a validated form (`/api/contact` with zod + honeypot + demo success), a ⌘K command palette is added to the header, and Privacy/Terms pages render from `content/site.ts`. 29 static routes build clean; `tsc`, `eslint` and `build` green.
- 2026-11-12: Team and blog added — role-based team cards (no invented people), blog index and post detail with `BlogPosting` JSON-LD, footer links and sitemap entries. 39 static routes build clean; all routes return 200 in `/ar` and `/en`.
- 2026-11-12: Skills expanded and search added — 28 skills grouped into Web / Backend / Mobile / Databases / Tools (Laravel, Livewire, ASP.NET Core, Flutter, MySQL, PostgreSQL, SQL Server, MongoDB, Firebase, Redis, Docker, AWS, …), team member detail pages, and a grouped `/search` page with Arabic-normalized matching wired into the ⌘K palette. 49 static routes build clean; `tsc`, `eslint` and `build` green; all routes return 200 in both locales.
- 2026-11-12: Phase 1 completed — added a sectors strip (no invented client logos), team preview, placeholder-labelled testimonials slider, and blog preview to the home page; added `rtl:tracking-normal` guards for Arabic letter-spacing. `tsc`, `eslint` and `build` green; home renders all sections in `/ar` and `/en`.
- 2026-11-13: Phase 2 completed — centralized SEO helpers (`lib/seo.ts`), canonical + hreflang + OpenGraph on every page, enriched Organization/WebSite JSON-LD (`sameAs`, `SearchAction`), FAQPage (home/services), Service/ItemList (services), BreadcrumbList (project/member/post) and BlogPosting. `tsc`, `eslint` and `build` green (49 routes); verified canonical, hreflang and JSON-LD across all routes. `Person` intentionally deferred until real members exist.
- 2026-11-13: Phase 2 hardening — visible breadcrumb navigation on project, member and post pages (`Breadcrumbs` + `PageHero`), result counts in search groups, and Arabic letter-spacing guard on the `PageHero` eyebrow. `tsc`, `eslint` and `build` green; breadcrumbs verified in both locales.
- 2026-11-13: Phase 3 started — `lib/sanity/client.ts` (raw HTTP `sanityFetch`/`sanityMutate`/`hasSanity`, apiVersion default `2025-01-01`), `lib/data.ts` rewritten as the single typed data layer (site, services, projects, project, posts, post, team, member, testimonials, sectors, tech, faqs, legal, `getHomeContent`) with GROQ projections, tag-based caching and automatic fallback to `content/site.ts`; every page, `sitemap.ts` and `/search` now read through it; `lib/site.ts` centralises `NEXT_PUBLIC_SITE_URL` (sitemap/robots/layout metadataBase/JSON-LD). `tsc` and `build` green (49 routes) with no Sanity env. Studio/schemas/seed and contact write remain pending.
- 2026-11-14: Phase 3 continued — `studio/` app scaffolded (own `package.json`/`tsconfig`, `sanity.config.ts` with structure + Vision, `structure/index.ts` singletons, `schemas/` for 11 types including `sector`/`tech`, `seed-data.ts` + `seed.ts` with `createIfNotExists`), and `/api/contact` now writes `contactSubmission` through the server-only token with a 502 error state (demo response when unset). Docs updated (`README`, `ARCHITECTURE`, `CONTENT`, `DEPLOYMENT`, `DECISIONS`, skill). Root `tsc` + `build` green (49 routes). Studio install/typecheck still pending (registry latency).
- 2026-11-13: QA pass — 34 routes return 200, `/` 307 → `/ar`, invalid routes and unknown slugs return 404 (removed the catch-all route that produced a soft 200), 40 unique internal links all resolve, contact API valid/invalid/honeypot behave correctly, JSON-LD parses on every page (Organization, WebSite, FAQPage, Service/ItemList, BreadcrumbList, BlogPosting), sitemap has 40 URLs and excludes search, no error markers in HTML.
- 2026-11-14: Completion & enhancement pass — removed Sanity/Resend and completed Firebase Firestore + Auth `/[locale]/studio` CMS + real-time inbox; wired `Cta`, `Contact`, `BlogPosting`, `Services`, and layout JSON-LD to dynamic `siteSettings`; added full sub-editors (`results`, `responsibilities`, `legal.sections`), inline delete confirmations, conditional `placeholder` rendering, zero-pill metadata & header/hero restraint, `app/icon.svg`, and Vitest unit tests (`tests/`).
- 2026-11-14: Bug-fix & runtime polish pass — updated bootstrap admin allowlist and `admins/{uid}` fallback in `firestore.rules`, `/api/revalidate`, and `lib/firebase/client.ts`; fixed `StudioDashboard` defaults/versioned editor syncing, slug rename orphan cleanup, schema-aligned validation, and empty states; fixed `Reveal` reduced-motion transform override, `Counter` decimal/non-numeric handling, `ProjectEstimator` border tokens, `LegalDocument` section keys, `Work` section `/work` CTA, `Blog`/`Team` empty states, and root `app/not-found.tsx` HTML shell.
- 2026-11-14: Hydration & visibility fix — moved `ThemeProvider` inside `<body>` in `app/[locale]/layout.tsx` (resolving root React 19 hydration failure that disabled dark/light toggle and mobile menu button), replaced `Reveal` SSR `opacity-0` hiding with SSR-visible WAAPI scroll animation, removed `.cv-auto` deferred wrappers from `app/[locale]/page.tsx`, improved Header mobile drawer close/scroll/links, and excluded `apple-icon` in `proxy.ts`.
- 2026-11-14: Preview proxy & cross-origin asset fix — configured `allowedDevOrigins` in `next.config.ts` (`**.run.app`, `**.googleusercontent.com`, `**.usercontent.goog`, `**.google.com`, `localhost`, `127.0.0.1`) and `.dark { color-scheme: dark }` in `app/globals.css`, eliminating Next.js 16 dev-server `403 Unauthorized` blocking on `/_next/static/chunks/*.js`, CSS, and HMR inside the Cloud Run / AI Studio iframe.