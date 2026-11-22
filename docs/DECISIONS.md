# Decisions — CodeNest

> Architecture Decision Records (ADRs). Keep this file updated when a decision changes.

## ADR-001 — Use Next.js App Router

- **Status:** Accepted
- **Context:** Need SSR/SSG, metadata, route handlers, and a scalable React framework.
- **Decision:** Next.js 16 (App Router) + TypeScript.
- **Consequences:** RSC by default; `app/[locale]` routing; no `pages/`.
- **Alternatives rejected:** plain Vite SPA (weaker SEO), Remix (smaller ecosystem), WordPress (less control).

## ADR-002 — Tailwind CSS v4

- **Status:** Accepted
- **Context:** Need a fast, consistent styling system with design tokens and dark mode.
- **Decision:** Tailwind CSS v4 with `@theme` tokens and CSS variables.
- **Consequences:** No `tailwind.config.js` required; tokens live in `globals.css`; avoid dynamic class names.
- **Alternatives rejected:** CSS Modules (more boilerplate), styled-components (runtime cost).

## ADR-003 — Bilingual AR/EN with next-intl

- **Status:** Accepted
- **Context:** Arabic is the primary audience; English is needed for technical partners.
- **Decision:** `next-intl` with `ar` default, `en` secondary, `localePrefix: 'always'`.
- **Consequences:** `/ar` and `/en` routes; `dir` on `<html>`; hreflang required; content model must be localized.
- **Alternatives rejected:** separate sites per language (duplicate code), i18next (less Next-native).

## ADR-004 — Sanity as the CMS

- **Status:** Accepted
- **Context:** Non-developers need to edit content; the site needs structured content and image handling.
- **Decision:** Sanity (separate Studio app in `studio/`) + `next-sanity`.
- **Consequences:** Studio runs separately; schema-driven content; GROQ queries; build works with a local fallback.
- **Alternatives rejected:** Contentful (pricing), Strapi (self-host overhead), MDX-only (no visual editor).

## ADR-005 — Dark-first premium design

- **Status:** Accepted
- **Context:** The brand should feel technical and premium; light mode is still required.
- **Decision:** Dark default with violet `#7C5CFF` + mint `#4FE3C1` accents; light mode via `next-themes`.
- **Consequences:** Theme tokens in `globals.css`; test both themes on every page.
- **Alternatives rejected:** light-only (less distinctive), multi-color (less coherent).

## ADR-006 — Arabic-first typography

- **Status:** Accepted
- **Context:** Arabic text needs proper shaping, line-height, and no letter-spacing.
- **Decision:** IBM Plex Sans Arabic for Arabic; Space Grotesk/Inter for Latin; no `letter-spacing` on Arabic; line-height 1.8–1.9.
- **Consequences:** Arabic headings fall back to IBM Plex Sans Arabic; code/URLs stay LTR.
- **Alternatives rejected:** using a Latin font for Arabic (broken shaping), applying tracking to Arabic.

## ADR-007 — GSAP + Lenis for motion

- **Status:** Accepted
- **Context:** Need premium scroll reveals, pinned sections, and smooth scroll without heavy WebGL.
- **Decision:** GSAP + ScrollTrigger + optional Lenis; CSS for micro-interactions.
- **Consequences:** One ticker loop; reduced-motion guards; disable cursor/tilt on touch.
- **Alternatives rejected:** Framer Motion only (less scroll control), WebGL/Three.js (performance risk).

## ADR-008 — No `/studio` route in Next

- **Status:** Accepted
- **Context:** Embedding Sanity Studio inside `app/[locale]` would create root-layout conflicts.
- **Decision:** Keep Studio as a separate app in `studio/`; run it on `:3333` or `*.sanity.studio`.
- **Consequences:** No `/studio` route in the Next app; separate deploy.
- **Alternatives rejected:** route group with a second root layout (more complexity), subdomain embedding (extra setup).

## ADR-009 — Local fallback for Sanity

- **Status:** Accepted
- **Context:** The build must work before Sanity credentials are available.
- **Decision:** `lib/data.ts` reads `content/*.ts` when `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing.
- **Consequences:** Build is green in both modes; content must be kept in sync.
- **Alternatives rejected:** hard failure without env (blocks development), mocking in tests only (no dev fallback).

## ADR-010 — Placeholder content is clearly placeholder

- **Status:** Accepted
- **Context:** The project needs realistic content before real assets exist.
- **Decision:** Use realistic placeholder copy and generated avatars; mark placeholders in the CMS; replace before launch.
- **Consequences:** No fake client logos/testimonials presented as real; content QA required.
- **Alternatives rejected:** lorem ipsum (unprofessional), inventing real-looking clients (unethical).

## ADR-011 — MVP first

- **Status:** Accepted
- **Context:** The full scope is large; the team needs a usable site early.
- **Decision:** Build Phase 0–2 (foundation, home, inner pages) first; add advanced motion and Sanity in later phases.
- **Consequences:** Faster feedback; some features are stubs until later phases.
- **Alternatives rejected:** big-bang build (risk), design-only (no content).

## ADR-012 — Latin digits by default

- **Status:** Accepted (provisional)
- **Context:** Arabic-Indic vs Latin digits affects consistency and bidi.
- **Decision:** Use `Intl.NumberFormat('ar-u-nu-latn')` (Latin digits) unless the client chooses otherwise.
- **Consequences:** Consistent stats and dates; easy to switch later.
- **Alternatives rejected:** Arabic-Indic digits (can complicate mixed content).

## ADR-013 — Static OG images

- **Status:** Accepted
- **Context:** `next/og` has limited Arabic shaping.
- **Decision:** Use pre-made static OG images for Arabic and English.
- **Consequences:** No dynamic OG text; update images when brand changes.
- **Alternatives rejected:** dynamic Arabic OG (risk of disconnected letters).

## ADR-014 — Contact form storage in Sanity

- **Status:** Accepted
- **Context:** Need a real submission path without a separate database.
- **Decision:** `app/api/contact` validates, rate-limits, and creates a `contactSubmission` document in Sanity.
- **Consequences:** Write token server-only; optional email via Resend; clear error if not configured.
- **Alternatives rejected:** email-only (no record), third-party form service (extra dependency).

## ADR-015 — No heavy analytics in v1

- **Status:** Provisional
- **Context:** Analytics is useful but not selected.
- **Decision:** Do not add GA4/Plausible by default; optional Vercel Analytics later.
- **Consequences:** Less third-party JS; privacy simpler.
- **Alternatives rejected:** GA4 (heavier, cookie consent), Plausible (cost).

## ADR-016 — System font stack until fonts can be self-hosted

- **Status:** Accepted (temporary)
- **Context:** `fonts.googleapis.com` is unreachable from the build environment, so `next/font/google` failed the production build with 4 fetch errors.
- **Decision:** Drop `next/font/google` for now. `app/globals.css` defines `--font-inter`, `--font-space`, `--font-arabic`, `--font-jetbrains` as system stacks (`Dubai`/`IBM Plex Sans Arabic`/`Segoe UI` for Arabic, `Inter`/`Segoe UI` for Latin, `Consolas`/`Cascadia Code` for mono).
- **Consequences:** Build is offline-safe; typography is good but not brand-exact on all devices. Replace with `next/font/local` + self-hosted woff2 (Inter, Space Grotesk, IBM Plex Sans Arabic, JetBrains Mono) once the fonts can be downloaded.
- **Alternatives rejected:** CDN `<link>` (render blocking, privacy), bundling TTFs without subsetting (large Arabic files).

## ADR-017 — Hand-written UI primitives instead of shadcn CLI

- **Status:** Provisional
- **Context:** `npx shadcn@latest init` needs network access to the registry and the CLI is slow in this environment; only `Button`, `Card`, `Badge`, `Accordion`, `Tabs`, `Input`, `Textarea` are needed for v1.
- **Decision:** Write minimal primitives in `components/ui/` using Tailwind tokens and native elements (`<details>` for accordion, native `<dialog>` where needed) instead of Radix/shadcn CLI.
- **Consequences:** No CLI dependency, smaller bundle, full control; accessibility must be verified manually (focus, ARIA).
- **Alternatives rejected:** shadcn CLI (network), Radix packages (extra installs, bundle size).

## ADR-018 — One shared GSAP motion layer

- **Status:** Accepted
- **Context:** The design needs scroll reveals, counters, tilt, marquee and cursor-follow previews without hurting Core Web Vitals or breaking reduced-motion users.
- **Decision:** All motion goes through `lib/gsap.ts` (registers `ScrollTrigger` + `useGSAP` once) and the primitives in `components/motion/`: `Reveal`, `Counter`, `Magnetic`, `Marquee`, `CursorSpotlight`, `SmoothScroll`. Every animation is wrapped in `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`; CSS handles the cheap effects (hover lifts, gradient hairlines, menu slide-in) with Tailwind `motion-safe:`/`group-*` variants.
- **Consequences:** One place to audit motion; no per-component plugin registration; content stays visible without JS (progressive enhancement); ScrollTrigger is driven by Lenis.
- **Alternatives rejected:** Framer Motion (larger runtime, less control), pure CSS scroll-driven animations (limited browser support).

## ADR-019 — Locale-aware links and a single theme owner

- **Status:** Accepted
- **Context:** Navigation and the theme toggle misbehaved: `next/link` dropped the locale prefix (a link to `/#work` from `/en` fell back to `/ar`), and `next-themes` was mounted inside `<body>`, so its no-flash script ran late and the first toggle click looked like a no-op.
- **Decision:** Every internal link goes through `@/i18n/navigation` (`Link` from `createNavigation`), including `components/ui/button.tsx` (`LinkButton`). `ThemeProvider` now wraps `<html>` in `app/[locale]/layout.tsx`, and the toggle derives state from `resolvedTheme !== "light"` so the first click always has an effect. Header size is driven by one `ScrollTrigger` (`start: 24`) and CSS transitions.
- **Consequences:** Locale is preserved on every navigation, including CTA buttons; theme applies before paint and persists; header shrinks from 96px to 64px with the logo and tagline scaling down.
- **Alternatives rejected:** per-link `href={\`/${locale}...\`}` (error-prone), keeping the provider in `<body>` (flash + stale first click).

## ADR-020 — One typed data layer with a silent local fallback

- **Status:** Accepted
- **Context:** Content was imported directly from `content/site.ts` in pages, the command palette and the sitemap, so connecting Sanity would have meant editing every call site. The build must also keep passing before Sanity credentials exist.
- **Decision:** `lib/data.ts` is the only place that knows about content sources. It exposes typed async getters (`getSite`, `getServices`, `getProjects`, `getProject`, `getPosts`, `getPost`, `getTeam`, `getMember`, `getTestimonials`, `getSectors`, `getTechStack`, `getFaqs`, `getLegal`, `getHomeContent`) built on `lib/sanity/client.ts`. Each getter runs one GROQ query with an explicit projection, caches it with a tag (`projects`, `posts`, `team`, `services`, …), and falls back to `content/site.ts` when Sanity is unconfigured or a query fails (logged once, never thrown to the page).
- **Consequences:** Pages never import content arrays directly (except `navItems`, which stay local by design); a missing/invalid Sanity project cannot break the build or a page; empty remote arrays fall back too, so a fresh dataset still renders. `generateStaticParams` awaits `getHomeContent(locale)` per locale, and `sitemap.ts` is async. Pages currently render at request/build time with static params, so Sanity edits need a revalidate hook or rebuild (Phase 3 follow-up).
- **Alternatives rejected:** `next-sanity`'s `defineQuery`/`createClient` per page (duplicated clients), a GraphQL layer (extra hop), per-page inline queries (violates the project convention).

## ADR-021 — Single `NEXT_PUBLIC_SITE_URL` source

- **Status:** Accepted
- **Context:** `codenest.example` was hardcoded in `layout.tsx` (`metadataBase`, Organization/WebSite JSON-LD, `SearchAction`), `sitemap.ts` and `robots.ts`, so deploying to a real domain would require finding every literal.
- **Decision:** `lib/site.ts` exports `siteUrl` from `NEXT_PUBLIC_SITE_URL` with a trailing-slash strip and a `https://codenest.example` placeholder default. Layout, sitemap and robots read it; `content/site.ts` keeps the brand placeholder copy (`email`, `whatsapp`) separate from the deploy URL.
- **Consequences:** One env var controls canonicals, hreflang, structured data and the sitemap; local builds keep a valid absolute URL instead of failing. Contact email/WhatsApp remain placeholders until the client provides real values.
- **Alternatives rejected:** reading `headers()`/`VERCEL_URL` at build time (non-deterministic, differs from the canonical domain), `env()` per file (duplication).

## Change log

- 2026-11-12: Initial ADRs created from the plan.
- 2026-11-12: ADR-016 (system fonts), ADR-017 (hand-written UI primitives) and ADR-018 (shared GSAP motion layer) added.
- 2026-11-12: ADR-019 (locale-aware links, theme provider placement, shrinking header) added after the interaction bug-fix pass.
- 2026-11-13: ADR-020 (typed data layer with local fallback) and ADR-021 (`NEXT_PUBLIC_SITE_URL`) added when the Sanity data layer landed.