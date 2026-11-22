# Architecture — CodeNest

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | RSC, metadata, route handlers |
| Language | TypeScript 5.x | Strict |
| UI | React 19 | Server Components by default |
| Styling | Tailwind CSS v4 | `@theme` tokens, CSS variables |
| UI primitives | shadcn/ui (Radix) | Accessible components |
| i18n | next-intl 4.x | `ar` default, `en` secondary |
| Theme | next-themes 0.4.x | `class` on `<html>` |
| CMS | Sanity 6.x (separate Studio app, raw HTTP client) | No `next-sanity` dependency |
| Motion | GSAP 3.x + Lenis 1.x | Optional smooth scroll |
| Icons | lucide-react | Directional icons mirrored in RTL |
| Forms | react-hook-form + Zod | Client + server validation |
| Search | In-memory over the data layer | Arabic-normalized matching |
| Tests | Vitest + Playwright + Axe | Unit + E2E + a11y |

## 2. Folder structure

```
app/
  [locale]/
    layout.tsx          # root layout: <html lang dir>, fonts, providers
    page.tsx            # home
    about/page.tsx
    services/page.tsx
    work/page.tsx
    work/[slug]/page.tsx
    team/page.tsx
    team/[slug]/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    contact/page.tsx
    search/page.tsx
    privacy/page.tsx
    terms/page.tsx
    not-found.tsx
  api/
    contact/route.ts
    search/route.ts
    revalidate/route.ts
  sitemap.ts
  robots.ts
  manifest.ts
  icon.svg
  globals.css
components/
  layout/
  sections/
  ui/
  motion/
  sanity/
content/                  # local placeholder fallback
i18n/
lib/
studio/                   # separate Sanity Studio app
public/
tests/
proxy.ts
next.config.ts
```

## 3. Rendering strategy

- **Server Components by default.** Data fetching and page composition happen on the server.
- **Client Components only for interactivity:** header menu, theme toggle, filters, form, command palette, motion.
- **Static generation where possible:** marketing pages and Sanity-driven pages use `generateStaticParams` and `revalidate`/tags.
- **Dynamic params allowed:** new Sanity slugs render on demand.
- **No edge runtime** for the proxy; Next 16 proxy is Node.js-only.
- **No `/studio` route in Next.** Studio runs as a separate app.

## 4. Data flow

```
Sanity
  → GROQ queries with explicit projections (inline in lib/data.ts)
  → sanityFetch (lib/sanity/client.ts)
  → typed data adapter (lib/data.ts)
  → Server Components
  → UI
```

### Fallback

- `lib/data.ts` is the only content entry point. Every getter is `async` and returns a typed value.
- If `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing, or a query throws, or a remote array comes back empty, the getter returns `content/*.ts` (local placeholder).
- This keeps `npm run build` green before Sanity is connected and makes a partially populated dataset render instead of going blank.
- Errors are logged once (`[sanity] query failed, falling back to local content`) and never bubble to a page.
- `generateStaticParams` awaits `getHomeContent(locale)` per locale; `sitemap.ts` is async and uses the same layer.

### Caching

- `sanityFetch` sends `next: { revalidate: 3600, tags }` so Sanity content is cached for an hour and can be invalidated per collection.
- Tags used: `site`, `services`, `projects`, `posts`, `team`, `testimonials`, `sectors`, `tech`, `faqs`, `legal`.
- Optional `/api/revalidate` webhook with a secret (Phase 3 follow-up).
- `dynamicParams = true` for new content.

## 5. Internationalization

### Routing

- `i18n/routing.ts`: `defineRouting({ locales: ['ar','en'], defaultLocale: 'ar', localePrefix: 'always' })`.
- `i18n/navigation.ts`: `createNavigation(routing)` exports `Link`, `redirect`, `usePathname`, `useRouter`.
- `i18n/request.ts`: `getRequestConfig` returns `{ locale, messages }`.
- `proxy.ts`: `createMiddleware(routing)` with matcher excluding `/api`, `/_next`, `/_vercel`, static files.

### Locale setup

- `app/[locale]/layout.tsx` is the root layout.
- Call `setRequestLocale(locale)` in layouts and pages for static rendering.
- `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`.
- `NextIntlClientProvider` supplies messages to client components.
- `next-themes` wraps the app with `attribute="class"`, default dark, `enableSystem` per decision.

### RTL rules

- Logical properties only: `ms/me/ps/pe/start/end`.
- Mirror directional icons with `rtl:` variants or `-scale-x-100`.
- Keep code, URLs, phone numbers, and logos LTR.
- Use `<bdi>` for mixed content.
- Arabic line-height 1.8–1.9, no letter-spacing.
- Test both directions on every page.

## 6. Styling

- Tailwind v4: `@import "tailwindcss";` in `globals.css`.
- `@theme inline` maps tokens to CSS variables.
- Dark mode via `.dark` class on `<html>`.
- Tokens: colors, fonts, radii, shadows, easing.
- No hardcoded hex in components; use tokens.
- No dynamic class construction that Tailwind cannot see.

## 7. Motion

- **GSAP + ScrollTrigger** for reveals, pinned process, and scrubbed effects.
- **Lenis** optional for smooth scroll; wire it to `gsap.ticker`.
- **CSS** for hover/micro-interactions and marquee.
- Rules:
  - Animate only `transform`, `opacity`, `clip-path`.
  - Use `will-change` only on active elements.
  - Disable cursor/tilt/magnetic on touch.
  - Respect `prefers-reduced-motion`.
  - Keep content visible without JS.
  - One `requestAnimationFrame`/ticker loop, not multiple.

## 8. Forms

- `react-hook-form` + `zod` on the client.
- `app/api/contact/route.ts`:
  - parse JSON;
  - validate with the same Zod schema;
  - honeypot check;
  - basic IP rate limit;
  - create a `contactSubmission` document in Sanity with the write token;
  - optionally send an email via Resend;
  - return JSON with success/error.
- The client shows inline errors, a success state, and an error state with `aria-live`.
- If Sanity write token is missing, return a clear setup error (not a fake success).
- WhatsApp link is a fallback.

## 9. Search

- `/search` reads `?q=`, normalizes Arabic diacritics/alef forms, and filters the items returned by `lib/data.ts`.
- Grouped results: pages, services, projects, posts, skills.
- Command palette (`cmdk`) links to `/search?q=...`; it still uses local content for services/projects (shell components are not on the data layer yet).

## 10. SEO

- `generateMetadata` per page with localized title/description.
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`.
- `alternates.canonical` + `languages` for AR/EN.
- `sitemap.ts` includes static routes + Sanity slugs for both locales.
- `robots.ts` allows `/`, disallows `/api`.
- JSON-LD: Organization, WebSite + SearchAction, BreadcrumbList, Person, BlogPosting, FAQPage, Service.
- Static OG images (Arabic shaping is unreliable in `next/og`).

## 11. Sanity Studio

- Separate app in `studio/` with its own `package.json`, `tsconfig.json` and install.
- `studio/sanity.config.ts` defines the project, dataset (`SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET`), `apiVersion: "2025-01-01"`, the structure tool and Vision.
- `studio/schemas/` contains `localeString` / `localeText` objects plus the document types: `siteSettings`, `service`, `project`, `post`, `member`, `testimonial`, `sector`, `tech`, `faq`, `legal`, `contactSubmission`.
- `studio/structure/index.ts` exposes site settings and both legal pages as fixed-ID singletons; everything else is a normal list.
- `studio/seed.ts` + `studio/seed-data.ts` create every placeholder document with `createIfNotExists` (idempotent, safe to re-run).
- Run: `cd studio && npm run dev` (port 3333). Seed: `npm run seed`.
- Deploy: `cd studio && npm run deploy`.
- `studio/` is excluded from the root `tsconfig` and ESLint; type-check it with `cd studio && npm run typecheck`.

## 12. Deployment

- Standard Node.js Next.js app.
- Recommended: Vercel.
- Alternative: any Node host (Docker, VPS, etc.).
- Env vars: see `.env.example`.
- Sanity Studio deployed separately.
- Domain/SSL configured at the host.

## 13. Key pitfalls

| Pitfall | Avoidance |
|---|---|
| Adding `app/layout.tsx` | Keep `[locale]/layout.tsx` as root. |
| Using `middleware.ts` | Use `proxy.ts` in Next 16. |
| Putting Studio in `app/` | Keep it in `studio/`. |
| Arabic text with letter-spacing | Never apply tracking to Arabic. |
| Hardcoded `left/right` | Use logical properties. |
| Sanity token in client | Server-only env. |
| Build fails without Sanity | Local fallback. |
| Heavy WebGL | Not allowed in v1. |
| Fake testimonials | Mark placeholder in CMS; replace before launch. |
| Multiple RAF loops | One ticker for GSAP/Lenis. |

## 14. Change management

- Keep pages as Server Components unless interactivity requires client.
- Keep GROQ queries in `lib/sanity/queries.ts`.
- Keep design tokens in `globals.css`.
- Keep content types in `lib/types.ts`.
- Keep validation schemas in `lib/validations.ts`.
- Update `AGENTS.md` and `docs/ROADMAP.md` after each phase.