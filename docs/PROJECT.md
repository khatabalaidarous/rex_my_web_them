# Project — CodeNest

## 1. Mission

Build a world-class marketing website for a programming team that:
- presents the team, services, and work with clarity;
- makes it easy for a potential client to start a conversation;
- works equally well in Arabic (RTL) and English (LTR);
- feels premium, fast, and accessible.

**Temporary brand:** `CodeNest` / `كود نست`.

## 2. Audience

### Primary
- Business owners and decision-makers looking for a programming team.
- Startups that need a technical partner.
- Marketing managers who need a reliable web/app vendor.

### Secondary
- Technical evaluators (CTOs, engineers) checking competence.
- Potential partners and recruits.

### Context
- Arabic-speaking clients are the primary audience; English-speaking technical partners are secondary.
- Most visitors arrive from search, social, or a referral.
- The decision is trust-based: proof, clarity, and ease of contact matter more than feature lists.

## 3. Goals

1. **Clarity:** within 5 seconds, a visitor knows who the team is, what they do, and what to do next.
2. **Trust:** real-looking work, process, team, testimonials, and transparent communication.
3. **Conversion:** contact form, WhatsApp, and email are always one click away.
4. **Craft:** a premium visual experience that does not sacrifice speed or accessibility.
5. **Maintainability:** content is editable without code; the codebase is easy to extend.

## 4. Value proposition

> A senior, cross-functional team that designs and builds web products end-to-end — from discovery and UI/UX to development, launch, and support — with Arabic-first quality and English technical communication.

Supporting pillars:
- **Full product thinking:** we understand the business, not just the ticket.
- **Arabic-first quality:** RTL, typography, and content are designed from the start.
- **Transparent process:** written scope, clear milestones, documented handover.
- **Performance and accessibility:** fast, accessible, and maintainable by default.

## 5. Pages

| Route | Purpose |
|---|---|
| `/ar`, `/en` | Home: value proposition, services, work, process, team, testimonials, blog, FAQ, CTA. |
| `/about` | Story, mission, values, timeline, team preview. |
| `/services` | Six services with deliverables, process, and CTA. |
| `/work` | Filterable project grid. |
| `/work/[slug]` | Case study: challenge, solution, results, gallery, next project. |
| `/team` | Team grid with department filter. |
| `/team/[slug]` | Member profile, skills, related work. |
| `/blog` | Featured post, category filter, search, grid. |
| `/blog/[slug]` | Article with TOC, reading progress, share, related posts. |
| `/contact` | Form, WhatsApp, email, location, response time. |
| `/search` | Grouped search across projects, posts, team. |
| `/privacy`, `/terms` | Legal pages from Sanity. |
| `404` | Branded not-found with useful links. |

## 6. Features

### Core
- Bilingual AR/EN with locale routing.
- Dark/light mode with system/default handling.
- Sanity CMS for all editable content.
- Contact form with validation, honeypot, rate limit, and Sanity storage.
- Search.
- SEO metadata, hreflang, sitemap, robots, JSON-LD.

### Interaction
- Scroll reveal and counters.
- Hero code window with tabs/typing.
- Filterable work grid.
- Cursor-follow project previews (desktop).
- Magnetic links and subtle tilt cards (desktop).
- Testimonial slider.
- FAQ accordion.
- Command palette (`⌘K` / `Ctrl+K`).
- Reading progress bar.
- Optional Lenis smooth scroll.

### Content
- 6 services, 6 projects, 6 team members, 6 posts, 6 testimonials, 6 FAQs (placeholder).
- Case studies with challenge/solution/results.
- Blog with categories, reading time, author, related posts.
- Team profiles with skills and social links.

## 7. Out of scope (v1)

- User accounts / authentication.
- Payments / subscriptions.
- A separate mobile app.
- A public newsletter (not selected).
- Real-time chat.
- Multi-vendor marketplace.
- Pricing calculator.
- Complex dashboard.

## 8. Success metrics

- Lighthouse mobile ≥ 90, accessibility 100.
- LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Initial JS < 180KB gzipped.
- All routes work in AR/EN.
- Contact form submission works end-to-end.
- Sanity content can be edited without code.
- No placeholder content in the final launch.

## 9. Design principles

1. **Clarity over decoration.** Every section has one job.
2. **Proof over adjectives.** Show work, process, and outcomes.
3. **Arabic is not an afterthought.** RTL and Arabic typography are first-class.
4. **Motion is a guide, not a show.** It should clarify hierarchy, not block reading.
5. **Performance is a feature.** Fast pages are part of the premium feel.
6. **Accessible by default.** Keyboard, screen readers, contrast, reduced motion.
7. **Content is editable.** The team should not need a developer for copy changes.

## 10. Brand notes

- Name: `CodeNest` / `كود نست` (placeholder).
- Personality: confident, technical, human, precise.
- Tone: clear and direct; avoid hype and superlatives.
- Visual: dark-first, violet + mint accents, editorial typography, generous spacing.
- Voice: “we build, we explain, we support.”

## 11. Content principles

- Arabic copy should be natural, not translated word-for-word.
- English copy should be concise and technical.
- Avoid fake client logos, invented testimonials, or stock photos of “the team.”
- Use generated avatars/gradients until real assets exist.
- Every claim should be verifiable or clearly labeled as placeholder.

## 12. Open questions

- Real team name and brand.
- Domain and hosting.
- Official contact details.
- Final accent color.
- Arabic-Indic vs Latin digits.
- Analytics tool.
- Sanity Studio access control.
- Pricing section (not in v1).