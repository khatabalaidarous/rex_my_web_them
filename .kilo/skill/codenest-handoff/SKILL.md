---
name: codenest-handoff
description: Use for any work on the CodeNest bilingual programming-team website (Arabic RTL + English LTR, Next.js 16 + Sanity). Loads the project mission, architecture, conventions, commands, current state, and next steps so a new agent can continue safely without re-planning. Use when implementing, debugging, reviewing, or resuming this project.
---

# CodeNest — Project Handoff Skill

This skill is the **second thing to read** after `AGENTS.md`. It turns the project context into a safe working procedure for any model.

## 0. First actions (always)

1. Read `AGENTS.md` in the project root.
2. Read `docs/ROADMAP.md` for current phase and blockers.
3. Read only the docs needed for the task:
   - UI / styling → `docs/DESIGN.md`
   - data / Sanity / i18n → `docs/ARCHITECTURE.md`
   - copy / placeholder content → `docs/CONTENT.md`
   - deployment / env → `docs/DEPLOYMENT.md`
   - QA / acceptance → `docs/QA.md`
   - prior decisions → `docs/DECISIONS.md`
4. Verify the actual repository state before editing:
   ```powershell
   Get-ChildItem -Force
   Test-Path package.json
   Test-Path app
   Test-Path studio
   git status --short
   ```
5. If `package.json` is missing, the project is **not scaffolded**. Start at Phase 0 in `AGENTS.md`; do not create a parallel plan.

## 1. Project in one paragraph

CodeNest is a premium, bilingual marketing website for a programming team. It presents the team, services, projects, blog, and contact path; uses Sanity for content; supports Arabic RTL and English LTR; is dark-first with a light mode; and must be fast, accessible, and easy to maintain.

**Primary goal:** convert visitors into clients/partners.  
**Primary action:** contact / WhatsApp.  
**Secondary action:** view work / case studies.

**Current state (2026-11-13):** Phases 0–2 complete; Phase 3 in progress. `lib/sanity/client.ts` + `lib/data.ts` exist and every page reads content through `lib/data.ts` (Sanity query → local fallback). No `studio/` app or schemas yet; `package.json` is `codenest@0.1.0`. `npm run build`, `npx eslint .` and `tsc --noEmit` are green with no Sanity env.

## 2. Architecture rules (do not violate)

- **Next.js App Router.** `app/[locale]/layout.tsx` is the root layout; do not add `app/layout.tsx`.
- **No `/studio` route in Next.** Sanity Studio is a separate app in `studio/`.
- **Next 16 proxy.** Use `proxy.ts`, export `proxy` or default; do not use `runtime: 'edge'`.
- **next-intl.** Use `defineRouting`, `createNavigation`, `getRequestConfig`, `setRequestLocale`.
- **RTL/LTR.** Set `dir` on `<html>`; use logical CSS properties; never hardcode `left/right`.
- **Sanity fallback.** Pages and `sitemap.ts` read content only through `lib/data.ts`; it must work with or without `NEXT_PUBLIC_SANITY_PROJECT_ID`. Do not import content arrays into pages (shell components such as `Header`/`Footer`/`CommandPalette` are the known exception until the Studio exists).
- **One site URL.** Use `siteUrl` from `lib/site.ts`; do not hardcode `codenest.example` in metadata, JSON-LD, sitemap or robots.
- **No secrets in client.** `SANITY_WRITE_TOKEN` is server-only.
- **No heavy WebGL.** GSAP + Lenis + CSS only; respect reduced motion.
- **No fake proof.** Placeholder projects/testimonials must be clearly placeholder in the CMS.
- **No real-person photos** in v1; use generated initials/avatars.

## 3. Design and content defaults

- Brand: `CodeNest` / `كود نست` (placeholder).
- Dark-first: `#07070B` background, `#F4F4F6` text.
- Accent: violet `#7C5CFF` + mint `#4FE3C1`.
- Arabic font: `IBM Plex Sans Arabic`; Latin display: `Space Grotesk`; Latin body: `Inter`; code: `JetBrains Mono`.
- Arabic body line-height 1.8–1.9; no `letter-spacing` on Arabic.
- Motion: 700ms reveals, 60–90ms stagger, ease `cubic-bezier(.16,1,.3,1)`.
- Content counts for placeholder: 6 projects, 6 services, 6 members, 6 posts, 6 testimonials, 6 FAQs.
- Use Latin digits (`ar-u-nu-latn`) unless the client chooses Arabic-Indic digits.

## 4. Standard workflow for a task

1. Identify the task and the phase it belongs to.
2. Read the relevant doc(s).
3. Check existing code and conventions; do not invent a new pattern.
4. Implement the smallest complete slice.
5. Run the relevant checks:
   ```bash
   npm run build
   npm run lint
   npx tsc --noEmit
   npm run test
   npm run test:e2e
   ```
6. Manually verify in `/ar` and `/en`, dark/light, mobile 375px, and RTL/LTR.
7. Update `AGENTS.md` Section 7 and `docs/ROADMAP.md` if the state changed.
8. Report: files changed, commands run, blockers, next step.

## 5. Phase 0 checklist (if not scaffolded)

- [ ] `npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack --yes`
- [ ] Install core packages (see `AGENTS.md` Section 8).
- [ ] `npx shadcn@latest init -d` and add the UI primitives.
- [ ] Create `i18n/` and `messages/{ar,en}.json`.
- [ ] Move root layout to `app/[locale]/layout.tsx`; delete `app/layout.tsx` and `app/page.tsx`.
- [ ] Add `proxy.ts`.
- [ ] Implement design tokens and fonts.
- [ ] Build `Header`, `Footer`, `ThemeToggle`, `LocaleSwitcher`.
- [ ] Add `content/*.ts` placeholder data and `lib/data.ts`.
- [ ] Add `.env.example` and `.gitignore`.
- [ ] Run `npm run build`, `npm run lint`, `npx tsc --noEmit`.
- [ ] Verify `/ar` and `/en` boot.

## 6. Resuming after a stop

- Do **not** rebuild the plan or docs.
- Do **not** assume files exist; verify with `Test-Path`.
- Check `git status --short` and `git log --oneline -5`.
- Read `AGENTS.md` Section 7 and `docs/ROADMAP.md`.
- If the app is scaffolded, run `npm run build` first to see the real state.
- Continue from the first unchecked item in the roadmap.

## 7. Common gotchas

| Gotcha | Correct approach |
|---|---|
| `middleware.ts` in Next 16 | Use `proxy.ts` and export `proxy`. |
| Two root layouts | Keep `app/[locale]/layout.tsx`; keep Studio in `studio/`. |
| Arabic text looks broken | Use IBM Plex Sans Arabic, line-height 1.8+, no letter-spacing, `dir="rtl"`. |
| Mixed Arabic/Latin text | Wrap Latin/code in `<bdi>` or `dir="ltr"`. |
| Build fails without Sanity env | Use `lib/data.ts` fallback to `content/*.ts`. |
| Sanity write token exposed | Keep it server-only; never `NEXT_PUBLIC_`. |
| Motion makes the page slow | Disable on touch/reduced motion; animate only transform/opacity. |
| `next lint` removed | Use `eslint .`. |
| `next/og` Arabic shaping | Use pre-made static OG images; do not rely on dynamic Arabic text. |
| `studio/` breaks root typecheck | Exclude `studio/` from root `tsconfig` and ESLint. |

## 8. Definition of Done for any task

- [ ] The task is implemented in the correct phase.
- [ ] `npm run build`, `npm run lint`, and `npx tsc --noEmit` pass (or the blocker is reported).
- [ ] Arabic and English both work.
- [ ] RTL/LTR, dark/light, and mobile were checked.
- [ ] No new hardcoded colors, `any`, or inline GROQ.
- [ ] No secrets added.
- [ ] `AGENTS.md` and `docs/ROADMAP.md` updated if the state changed.

## 9. What not to do

- Do not create a second `app/layout.tsx`.
- Do not put Sanity Studio inside `app/[locale]`.
- Do not use `middleware.ts` in Next 16.
- Do not add WebGL, heavy animation libraries, or analytics without approval.
- Do not present placeholder testimonials as real.
- Do not commit secrets, `.env.local`, `node_modules`, or `.next`.
- Do not rewrite the plan/docs unless the user asks.
- Do not start unrelated work (e.g., a mobile app, payments, newsletter) without approval.

## 10. Quick reference

- Project root: `C:\Users\user\Desktop\مجلد جديد\My_website_them`
- Primary doc: `AGENTS.md`
- Full plan: `docs/PLAN.md`
- Roadmap: `docs/ROADMAP.md`
- Design: `docs/DESIGN.md`
- Content: `docs/CONTENT.md`
- QA: `docs/QA.md`

> The session plan may live in a temporary directory outside the project. Do not depend on it; the project docs are the source of truth.