# QA — CodeNest

## 1. Commands

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
npm run test
npm run test:e2e
```

Optional:

```bash
npx lighthouse http://localhost:3000/ar --preset=desktop --view
npx @axe-core/cli http://localhost:3000/ar
```

## 2. Automated tests

### Vitest (unit)

- [ ] `pickLocale` returns the correct locale with fallback.
- [ ] Slug generation/trim.
- [ ] Zod contact schema: required fields, email, message length.
- [ ] Number formatting (`ar-u-nu-latn`).
- [ ] Utility functions (cn, date formatting).

### Playwright (E2E)

- [ ] Home loads in `/ar` and `/en`.
- [ ] Locale switcher changes URL and `dir`.
- [ ] Theme toggle changes class and persists.
- [ ] Mobile menu opens/closes, traps focus, closes on Esc.
- [ ] Work filters show/hide the correct cards.
- [ ] FAQ accordion opens/closes.
- [ ] Testimonial slider next/prev works.
- [ ] Contact form shows validation errors.
- [ ] Contact form success state (with mock/Sanity).
- [ ] Command palette opens with `⌘K`/`Ctrl+K`.
- [ ] Search page returns results.
- [ ] 404 page renders.

### Axe

- [ ] Home `/ar` and `/en` — no serious/critical violations.
- [ ] Contact page — form labels/errors.
- [ ] Project detail — heading order.
- [ ] Blog post — article landmarks.

## 3. Manual test matrix

| Device/Width | Arabic RTL | English LTR | Dark | Light |
|---|---|---|---|---|
| 375px (iPhone SE) | ⬜ | ⬜ | ⬜ | ⬜ |
| 768px (iPad) | ⬜ | ⬜ | ⬜ | ⬜ |
| 1440px (laptop) | ⬜ | ⬜ | ⬜ | ⬜ |
| 1920px (desktop) | ⬜ | ⬜ | ⬜ | ⬜ |

Browsers: Chrome, Safari, Firefox, Edge; iOS Safari, Android Chrome.

## 4. RTL/LTR checklist

- [ ] `dir` and `lang` are correct on `<html>`.
- [ ] Header/footer mirror correctly.
- [ ] Directional icons are mirrored.
- [ ] Logos, URLs, phone numbers, and code are **not** mirrored.
- [ ] Arabic text has no `letter-spacing`.
- [ ] Arabic line-height is 1.8–1.9.
- [ ] Mixed content uses `<bdi>`/`dir="ltr"`.
- [ ] Form validation messages align correctly.
- [ ] Modals/drawers slide from the correct side.
- [ ] No horizontal scroll at 320px.
- [ ] Numbers are not reversed.

## 5. Dark/light checklist

- [ ] Default theme is dark.
- [ ] Toggle persists across reloads.
- [ ] All sections have correct contrast in both themes.
- [ ] Images/logos are visible in both themes.
- [ ] Focus rings are visible in both themes.
- [ ] No hardcoded colors break in light mode.

## 6. Accessibility checklist (WCAG 2.2 AA)

- [ ] Skip link works.
- [ ] All interactive elements are keyboard reachable.
- [ ] Focus is visible.
- [ ] Menu/accordion/slider/modal have correct ARIA.
- [ ] Form labels are associated.
- [ ] Errors are linked with `aria-describedby`.
- [ ] Form status uses `aria-live`.
- [ ] Images have alt text.
- [ ] Headings are hierarchical (one H1 per page).
- [ ] Color contrast 4.5:1 body / 3:1 large.
- [ ] Touch targets ≥ 44×44.
- [ ] `prefers-reduced-motion` disables non-essential motion.
- [ ] 200% zoom works.
- [ ] Screen reader pass (NVDA + VoiceOver).

## 7. Performance checklist

- [ ] LCP < 2.5s on 4G.
- [ ] CLS < 0.1.
- [ ] INP < 200ms.
- [ ] Initial JS < 180KB gzipped.
- [ ] Hero image uses `priority`; others lazy.
- [ ] Fonts are self-hosted and subset.
- [ ] No layout-thrashing animations.
- [ ] No unused heavy libraries.
- [ ] Lighthouse mobile ≥ 90.
- [ ] Test with CPU throttling 4x.

## 8. SEO checklist

- [ ] `metadataBase` set.
- [ ] Localized title/description on every page.
- [ ] Canonical URL on every page.
- [ ] hreflang AR/EN/x-default.
- [ ] OpenGraph/Twitter images.
- [ ] `sitemap.ts` includes all routes + Sanity slugs.
- [ ] `robots.ts` allows `/`, disallows `/api`.
- [ ] JSON-LD valid (Rich Results Test).
- [ ] Semantic HTML.
- [ ] No duplicate content across locales.

## 9. Sanity checklist

- [ ] Studio loads at `localhost:3333`.
- [ ] Create/edit/publish project.
- [ ] Create/edit/publish post.
- [ ] Create/edit/publish member.
- [ ] Localized fields work.
- [ ] Image upload with alt text.
- [ ] Site reflects published content.
- [ ] Build works without Sanity env (fallback).
- [ ] Build works with Sanity env.
- [ ] No write token in client bundle.
- [ ] Revalidation works (ISR/webhook).

## 10. Contact form checklist

- [ ] Required fields validated.
- [ ] Email format validated.
- [ ] Message minimum length.
- [ ] Honeypot hidden from users.
- [ ] Rate limit works.
- [ ] Success state visible.
- [ ] Error state visible.
- [ ] Sanity document created.
- [ ] WhatsApp fallback works.
- [ ] Privacy note present.

## 11. Content checklist

- [ ] No lorem ipsum.
- [ ] Arabic natural.
- [ ] English correct.
- [ ] No fake logos/testimonials as real.
- [ ] All images have alt text.
- [ ] Dates/reading times correct.
- [ ] Links work.
- [ ] Legal pages present.

## 12. Definition of Done (project)

- [ ] All routes work in `/ar` and `/en`.
- [ ] RTL/LTR correct.
- [ ] Home has all sections.
- [ ] Responsive at 375/768/1440/1920.
- [ ] Sanity content editable.
- [ ] Build works with/without Sanity.
- [ ] Contact form works end-to-end.
- [ ] SEO metadata + sitemap + JSON-LD.
- [ ] Lighthouse ≥ 90 (A11y 100).
- [ ] No build/lint/type/console errors.
- [ ] README + deployment + content guide.
- [ ] No placeholder content visible.

## 13. Bug severity

| Severity | Examples | Action |
|---|---|---|
| Blocker | Build fails, page 500, form cannot submit | Fix before continuing |
| High | Broken layout, missing content, RTL broken | Fix in current phase |
| Medium | Minor visual issue, accessibility warning | Fix before QA |
| Low | Polish, copy tweak | Backlog |

## 14. Release checklist

- [ ] `npm run build` clean.
- [ ] `npm run lint` clean.
- [ ] `npx tsc --noEmit` clean.
- [ ] Tests pass.
- [ ] Lighthouse run.
- [ ] Axe run.
- [ ] Content replaced.
- [ ] Domain/SSL verified.
- [ ] Analytics verified (optional).
- [ ] Rollback plan documented.