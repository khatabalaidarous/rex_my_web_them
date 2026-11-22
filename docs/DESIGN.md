# Design System — CodeNest

## 1. Brand

- **Name:** `CodeNest` / `كود نست` (placeholder).
- **Personality:** confident, technical, human, precise.
- **Tone:** clear, direct, no hype.
- **Logo:** geometric mark (rounded square with `</>`) + wordmark.
- **Assets:** `public/logo.svg`, `public/logo-light.svg`, `app/icon.svg`, `public/og/default.jpg`, `public/og/default-ar.jpg`.

## 2. Color tokens

### Dark (default)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#07070B` | Page background |
| `--bg-elevated` | `#0D0D13` | Elevated sections |
| `--surface` | `#111119` | Cards |
| `--surface-2` | `#16161F` | Secondary fills |
| `--border` | `rgba(255,255,255,0.08)` | Borders |
| `--text` | `#F4F4F6` | Primary text |
| `--text-muted` | `#A5A5B4` | Secondary text |
| `--primary` | `#7C5CFF` | Primary accent |
| `--accent` | `#4FE3C1` | Secondary accent |
| `--ring` | `#7C5CFF` | Focus ring |

### Light

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAFAF8` | Page background |
| `--bg-elevated` | `#FFFFFF` | Elevated sections |
| `--surface` | `#FFFFFF` | Cards |
| `--surface-2` | `#F3F3F0` | Secondary fills |
| `--border` | `rgba(10,10,15,0.10)` | Borders |
| `--text` | `#0B0B10` | Primary text |
| `--text-muted` | `#565664` | Secondary text |
| `--primary` | `#5B3DF5` | Primary accent |
| `--accent` | `#0EA5A0` | Secondary accent |
| `--ring` | `#5B3DF5` | Focus ring |

### Gradients

- Signature: `linear-gradient(135deg, #7C5CFF 0%, #4FE3C1 100%)`.
- Glow: `radial-gradient(60% 60% at 20% 0%, rgba(124,92,255,0.25), transparent 70%)`.
- Use at most two accents per screen.

## 3. Typography

| Use | Font | Weights |
|---|---|---|
| Arabic (headings + body) | `IBM Plex Sans Arabic` | 300–700 |
| Latin display | `Space Grotesk` | 500–700 |
| Latin body | `Inter` | 400–600 |
| Code | `JetBrains Mono` | 400–600 |

### Rules

- Arabic body: `font-size: 17–18px`, `line-height: 1.85`.
- Arabic headings: `line-height: 1.35`.
- Latin body: `line-height: 1.65`.
- **No `letter-spacing` on Arabic.**
- Use `text-wrap: balance` for headings and `text-pretty` for paragraphs.
- Load with `next/font/google`, `display: swap`, self-hosted.
- Limit weights to reduce payload.

### Type scale (desktop)

| Token | Size |
|---|---|
| `display-1` | `clamp(2.75rem, 6vw, 6rem)` |
| `display-2` | `clamp(2.25rem, 4.5vw, 4rem)` |
| `h1` | `clamp(2rem, 4vw, 3.25rem)` |
| `h2` | `clamp(1.75rem, 3vw, 2.5rem)` |
| `h3` | `1.5rem` |
| `body-lg` | `1.125rem` (Arabic 1.25rem) |
| `body` | `1rem` |
| `caption` | `0.875rem` |

## 4. Spacing, radii, shadows

- Container: `max-width: 1280px`, `padding-inline: clamp(20px, 5vw, 48px)`.
- Section padding: `clamp(72px, 10vw, 140px)` block.
- Grid: 12 columns, gap 24px.
- Radii: `10px` (sm), `16px` (md), `24px` (lg), `32px` (xl), `9999px` (full).
- Borders: 1px solid `--border`.
- Shadows: layered, low opacity; no heavy drop shadows.
- Noise overlay: subtle SVG noise, optional.

## 5. Motion

| Token | Value |
|---|---|
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Reveal duration | `700ms` |
| Stagger | `60–90ms` |
| Hover | `300ms` |
| Magnetic | `300ms` |
| Cursor lag | `250–450ms` |
| Page transition | `400ms` |

### Rules

- Animate only `transform`, `opacity`, `clip-path`.
- No layout-thrashing properties.
- `prefers-reduced-motion`: disable reveals, marquee, typing, tilt, cursor follow, smooth scroll.
- Disable cursor/tilt/magnetic on touch.
- Keep content visible without JS.

## 6. Components

### Header
- Sticky, `backdrop-blur`, border on scroll.
- Logo, nav, locale switcher, theme toggle, CTA.
- Active link: `aria-current="page"` + underline.
- Mobile: full-screen drawer, focus trap, Esc close, body scroll lock.

### Buttons
- Primary: gradient or solid `--primary`, white text.
- Secondary: surface + border.
- Ghost: text + hover fill.
- Sizes: sm (36px), md (44px), lg (52px).
- Focus ring: 2px `--ring`, offset 2px.
- Icon buttons: 44×44 minimum.

### Cards
- Surface background, 1px border, radius `lg`.
- Hover: border accent, 2px lift, subtle glow.
- No heavy shadows.

### Inputs
- Surface, border, radius `md`.
- Label above, helper/error below.
- Error: red border + message linked by `aria-describedby`.
- Focus: ring.

### Marquee
- Duplicate content, CSS keyframes.
- Pause on hover/focus.
- Static wrap under reduced motion.

### Code window
- LTR, `JetBrains Mono`.
- Tabs, line numbers, traffic lights.
- Typing animation; pause offscreen; static under reduced motion.
- `aria-hidden` for decorative code + accessible summary.

### Cursor-follow preview
- Desktop only.
- `gsap.quickTo` for smooth follow.
- Disabled on touch/reduced motion.

### Tilt card
- Subtle `rotateX/rotateY` on pointer move.
- Disabled on touch/reduced motion.

### Accordion
- Radix or native `<details>`.
- One open at a time (or multiple, per design).
- `aria-expanded`, `aria-controls`.

### Testimonial slider
- CSS `scroll-snap` + prev/next buttons.
- Dots, keyboard support, `aria-live`.
- Auto-advance optional; pause on hover/focus; disabled under reduced motion.

## 7. Imagery

- **No real-person photos in v1.** Use generated gradient avatars with initials.
- Project covers: generated gradients/abstract SVG shapes.
- Client logos: text wordmarks only, clearly placeholder.
- All images via `next/image`, explicit `sizes`, AVIF/WebP.
- Required `alt` text in Sanity.
- Decorative images: `alt=""`.

## 8. RTL rules

- `<html dir="rtl">` for Arabic.
- Logical properties only.
- Mirror directional icons (`arrow`, `chevron`, `send`).
- Do not mirror logos, URLs, phone numbers, code.
- Keep code windows `dir="ltr"`.
- Use `<bdi>` for mixed content.
- Test at 320px, 200% zoom.

## 9. Accessibility

- WCAG 2.2 AA target.
- Contrast: 4.5:1 body, 3:1 large text.
- Focus visible on all interactive elements.
- Keyboard: menu, accordion, slider, modal, command palette.
- Skip link.
- Form labels, errors, `aria-live` for status.
- `prefers-reduced-motion`.
- Touch targets 44×44.
- No hover-only information.

## 10. Do / Don't

### Do
- Use tokens.
- Use logical properties.
- Keep motion purposeful.
- Test both languages and themes.
- Keep content visible without JS.
- Use real-looking placeholder content, clearly labeled.

### Don't
- Hardcode colors in components.
- Use `letter-spacing` on Arabic.
- Use `left/right` instead of logical properties.
- Add WebGL or heavy 3D.
- Hide essential information behind hover.
- Use stock photos of “the team.”
- Animate `width/height/top/left`.
- Add more than two accents per screen.

## 11. Responsive breakpoints

| Name | Width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

Test at 375, 768, 1440, 1920.

## 12. Design QA

- [ ] Both locales look correct.
- [ ] Both themes look correct.
- [ ] No horizontal scroll at 320px.
- [ ] No text clipping.
- [ ] Focus rings visible.
- [ ] Hover states do not shift layout.
- [ ] Images have correct aspect ratios.
- [ ] Reduced motion shows all content.
- [ ] Arabic line-height and alignment are correct.
- [ ] Code/URLs remain LTR.