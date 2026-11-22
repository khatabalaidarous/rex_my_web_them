# CodeNest — Bilingual Programming Team Website

A premium, bilingual (Arabic RTL + English LTR), interactive marketing website for a programming team. Built with Next.js 16, TypeScript, Tailwind CSS v4, and Firebase (Firestore + Auth).

> **Status:** Complete with built-in Firebase Firestore + Auth and an integrated `/[locale]/studio` admin CMS & contact inbox. See `AGENTS.md` Section 7 and `docs/ROADMAP.md` for details.

---

## What this project is

- Marketing website for a programming team (`CodeNest` / `كود نست` — placeholder brand).
- Arabic is the default (`/ar`), English is `/en`.
- Dark-first premium design with a light mode.
- Pages: Home, About, Services, Work + case studies, Team + member profiles, Blog + posts, Contact, Search, Privacy, Terms, 404.
- Content managed in the built-in `/[locale]/studio` (backed by Firebase Firestore): projects, posts, team members, services, testimonials, FAQs, legal pages, site settings, and contact submissions.
- Interactions: scroll reveals, counters, code window, marquee, cursor-follow previews, magnetic links, tilt cards, testimonial slider, FAQ accordion, command palette, optional smooth scroll.
- SEO: localized metadata, hreflang, sitemap, robots, JSON-LD.
- Accessibility target: WCAG 2.2 AA.

## Current state

- [x] Project plan.
- [x] Handoff documentation and agent skill.
- [x] Next.js app scaffolded.
- [x] Design system and i18n.
- [x] Home page (hero, services, work, process, stats, CTA).
- [x] Inner pages (About, Services, Work, Team, Blog, Contact, Search, Privacy, Terms, Studio, 404).
- [x] Built-in Firebase Firestore + Auth + `/studio` CMS connected with local fallback.
- [x] Production build, typecheck, and lint green.

Content comes from `lib/data.ts`, which queries Firebase Firestore with Next.js cache tags and falls back gracefully to `content/site.ts` before seeding.

## Prerequisites

- Node.js 22.12+ (verified: 22.12.0)
- npm 10.9+ (verified: 10.9.0)
- Git (verified: 2.54.0)
- A modern browser for testing
- Optional: Sanity account (free), Vercel account, Figma

> **Windows / PowerShell 5.1:** `npm.ps1` is blocked by the execution policy. Run every npm command as `cmd /c "npm run dev"` etc. Installs are slow (~10 min) — use `npm ci --prefer-offline --no-audit --no-fund --ignore-scripts`.

## Quick start

```bash
npm ci --prefer-offline --no-audit --no-fund --ignore-scripts
npm run dev
# open http://localhost:3000/ar (root redirects to /ar)
```

Arabic-first fonts currently use a system stack (`Dubai` / `Segoe UI`) because `fonts.googleapis.com` is unreachable in this environment; see `docs/DECISIONS.md` ADR-016.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server at `http://localhost:3000/ar` |
| `npm run build` | Production build |
| `npm run lint` | ESLint (`eslint .`) |
| `npm run typecheck` | Type check (`tsc --noEmit`) |
| `npm run test` | Vitest unit tests (not installed yet) |
| `npm run test:e2e` | Playwright E2E (not installed yet) |
| `cd studio && npm install` | Install the Studio app (separate dependency tree) |
| `cd studio && npm run dev` | Sanity Studio on `http://localhost:3333/studio` |
| `cd studio && npm run typecheck` | Type check the Studio |
| `cd studio && npm run seed` | Seed placeholder content into the dataset |

## Project structure

```
app/[locale]/       # Localized pages + root layout
proxy.ts            # next-intl locale middleware (Next 16)
components/         # Layout, sections, UI, motion, providers
content/            # Local placeholder fallback
i18n/               # Routing, navigation, request config, messages
lib/                # Data adapter, SEO, utils
studio/             # Separate Sanity Studio app (schemas, structure, seed)
public/             # Logo, OG images, avatars
tests/              # Unit + E2E (not created yet)
docs/               # Handoff documentation
.kilo/skill/        # Agent skill
```

## Documentation

| File | Purpose |
|---|---|
| `AGENTS.md` | **Start here.** Mission, stack, architecture, conventions, current state, next step. |
| `docs/PLAN.md` | Full implementation plan: research, architecture, phases, QA, risks. |
| `.kilo/skill/codenest-handoff/SKILL.md` | Agent handoff procedure. |
| `docs/ROADMAP.md` | Phases, status, next steps. |
| `docs/PROJECT.md` | Audience, goals, pages, features. |
| `docs/ARCHITECTURE.md` | Stack, data flow, rendering, i18n. |
| `docs/DESIGN.md` | Colors, fonts, spacing, motion, components. |
| `docs/CONTENT.md` | Content model and placeholder copy. |
| `docs/QA.md` | Verification and acceptance checklist. |
| `docs/DEPLOYMENT.md` | Env, hosting, Sanity, domain. |
| `docs/DECISIONS.md` | Decision log. |

## Built-in Studio

The CMS and Contact Inbox live directly inside the app at `/ar/studio` and `/en/studio`, protected by Firebase Google Authentication and `firestore.rules`. Use the **Sync Default Content to Firestore** button in Overview on first launch to populate Firestore from `content/site.ts`, then edit any collection live with automatic cache revalidation.

## Deployment

The code is standard Next.js (Node). Recommended: Vercel. Any Node-compatible host works. See `docs/DEPLOYMENT.md`.

## Contributing / handoff

1. Read `AGENTS.md`.
2. Read `.kilo/skill/codenest-handoff/SKILL.md`.
3. Check `docs/ROADMAP.md` for the current phase.
4. Implement the smallest complete slice.
5. Run build/lint/typecheck/tests.
6. Update `AGENTS.md` Section 7 and `docs/ROADMAP.md` before stopping.

## License

Internal project. No license file yet.