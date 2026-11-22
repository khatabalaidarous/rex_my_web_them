# Content — CodeNest

## 1. Principles

- Arabic copy should be natural, not a literal translation.
- English copy should be concise and technical.
- No fake client logos, invented testimonials, or stock photos of “the team.”
- Placeholder content must be clearly labeled in the CMS and replaced before launch.
- Every claim should be verifiable or marked as placeholder.
- Use `CodeNest` / `كود نست` until the real brand is chosen.

## 2. Content model (Sanity)

Implemented in `studio/schemas/`. Localized text is a `{ ar, en }` object (`localeString` for one line, `localeText` for paragraphs); `pickLocale(value, locale)` reads it on the frontend.

| Type | Fields |
|---|---|
| `siteSettings` | `name{ar,en}`, `legalName{ar,en}`, `tagline{ar,en}`, `shortTagline{ar,en}`, `email`, `whatsapp`, `location{ar,en}`, `socials[{label, href}]` (singleton, `_id: siteSettings`) |
| `service` | `icon` (`code`/`palette`/`rocket`/`search`/`shield`/`sparkles`), `title{ar,en}`, `description{ar,en}` |
| `project` | `title{ar,en}`, `slug`, `summary{ar,en}`, `category{ar,en}`, `year`, `client{ar,en}`, `role{ar,en}`, `duration{ar,en}`, `challenge{ar,en}`, `solution{ar,en}`, `results[{value, label{ar,en}}]`, `stack[]`, `placeholder` |
| `post` | `title{ar,en}`, `slug`, `excerpt{ar,en}`, `tag{ar,en}`, `date`, `readingMinutes`, `body[{ar,en}]` (one paragraph per row), `placeholder` |
| `member` | `initials`, `role{ar,en}`, `slug`, `focus{ar,en}`, `responsibilities[{ar,en}]`, `stack[]`, `placeholder` (v1 uses role cards, not real people) |
| `testimonial` | `quote{ar,en}`, `role{ar,en}`, `initials`, `placeholder` |
| `sector` | `icon` (`cart`/`cpu`/`book`/`heart`/`bank`/`truck`/`building`/`plane`), `label{ar,en}` |
| `tech` | `name`, `group` (`web`/`backend`/`mobile`/`database`/`tools`), `category{ar,en}`, `description{ar,en}`, `accent` (`violet`/`mint`/`sky`/`amber`) |
| `faq` | `q{ar,en}`, `a{ar,en}` |
| `legal` | `key` (`privacy`/`terms`), `updated`, `notice{ar,en}`, `intro{ar,en}`, `sections[{heading{ar,en}, body{ar,en}}]` (singletons `legal-privacy`, `legal-terms`) |
| `contactSubmission` | `name`, `email`, `company`, `message`, `createdAt` (read-only, written by `/api/contact` with the server token) |

`process` and `stats` are still local constants (`content/site.ts`); they have no schema yet.

### Localization

- Use `{ ar, en }` objects for text (no per-locale documents).
- One slug per document, shared across locales.
- Images require localized `alt`; there are no image fields in v1 (no real-person photos), so avatars are generated initials.
- `seed-data.ts` mirrors `content/site.ts`; keep both in sync when copy changes.

## 3. Site settings (placeholder)

| Field | Arabic | English |
|---|---|---|
| title | كود نست | CodeNest |
| description | فريق برمجة متكامل يبني منتجات رقمية من الفكرة إلى الإطلاق. | A full-stack product team building digital products from idea to launch. |
| email | `hello@codenest.example` | same |
| WhatsApp | `+000 000 0000` (placeholder) | same |
| location | الرياض، السعودية (عن بُعد) | Riyadh, Saudi Arabia (remote-first) |
| hours | الأحد–الخميس، 9–18 | Sun–Thu, 9–18 |

## 4. Services (6)

### 1. تطوير المواقع والمواقع التعريفية
- **EN:** Websites & Landing Pages
- **Summary AR:** مواقع سريعة وواضحة تحكي قصة فريقك وتحوّل الزائر إلى عميل.
- **Summary EN:** Fast, clear websites that tell your story and turn visitors into clients.
- **Deliverables:** UI/UX، تطوير، SEO أساسي، تحليلات، نشر.
- **Stack:** Next.js, Tailwind, Sanity.

### 2. تطبيقات الويب وSaaS
- **EN:** Web Apps & SaaS
- **Summary AR:** منصات ولوحات تحكم مبنية لتكون سريعة وقابلة للتوسع.
- **Summary EN:** Platforms and dashboards built to be fast and scalable.
- **Deliverables:** اكتشاف، تصميم، تطوير، اختبار، إطلاق.
- **Stack:** Next.js, Node, PostgreSQL.

### 3. المتاجر الإلكترونية
- **EN:** E-commerce
- **Summary AR:** متاجر عربية/إنجليزية مع تجربة شراء واضحة وربط دفع وشحن.
- **Summary EN:** Bilingual storefronts with a clear checkout, payments, and shipping.
- **Deliverables:** كتالوج، سلة، دفع، شحن، لوحة تحكم.
- **Stack:** Next.js, Stripe/HyperPay, Sanity.

### 4. تطبيقات الجوال
- **EN:** Mobile Apps
- **Summary AR:** تطبيقات iOS/Android بتجربة أصلية وأداء عالٍ.
- **Summary EN:** Native-feeling iOS/Android apps with high performance.
- **Deliverables:** تصميم، تطوير، نشر، تحليلات.
- **Stack:** React Native/Flutter.

### 5. أنظمة مخصصة وERP
- **EN:** Custom Systems & ERP
- **Summary AR:** أنظمة إدارة داخلية مخصصة لعملياتك، لا قالب جاهز.
- **Summary EN:** Internal systems tailored to your operations, not a template.
- **Deliverables:** تحليل، تصميم، تطوير، تكامل، تدريب.
- **Stack:** Node, PostgreSQL, Next.js.

### 6. تصميم UI/UX وهوية رقمية
- **EN:** UI/UX & Digital Identity
- **Summary AR:** أنظمة تصميم عربية/إنجليزية وهويات رقمية متسقة.
- **Summary EN:** Bilingual design systems and consistent digital identities.
- **Deliverables:** بحث، wireframes، UI kit، دليل هوية.
- **Stack:** Figma.

## 5. Projects (6)

### 1. منصة تعليمية — «مسار»
- **EN:** Learning platform — “Masar”
- **Category:** منصة/تعليم
- **Summary AR:** منصة تعليمية عربية/إنجليزية لإدارة الكورسات والاشتراكات.
- **Summary EN:** Bilingual learning platform for courses and subscriptions.
- **Results:** +40% إتمام الكورسات، 98 أداء.
- **Stack:** Next.js, Sanity, PostgreSQL.

### 2. متجر إلكتروني — «رف»
- **EN:** E-commerce — “Raff”
- **Category:** متجر
- **Summary AR:** متجر عربي بواجهة RTL كاملة وربط دفع وشحن.
- **Summary EN:** Arabic-first store with full RTL, payments, and shipping.
- **Results:** +27% تحويل، 1.2s LCP.
- **Stack:** Next.js, Stripe, Sanity.

### 3. تطبيق حجوزات — «موعد»
- **EN:** Booking app — “Mawid”
- **Category:** تطبيق
- **Summary AR:** تطبيق حجوزات للمواعيد مع تذكيرات ولوحة تحكم.
- **Summary EN:** Appointment booking app with reminders and admin dashboard.
- **Results:** -35% مكالمات الدعم.
- **Stack:** React Native, Node, PostgreSQL.

### 4. لوحة تحكم SaaS — «نبض»
- **EN:** SaaS dashboard — “Nabd”
- **Category:** نظام
- **Summary AR:** لوحة تحليلات لحظية مع صلاحيات وتقارير.
- **Summary EN:** Real-time analytics dashboard with roles and reports.
- **Results:** 60fps على بيانات كبيرة.
- **Stack:** Next.js, PostgreSQL, Redis.

### 5. موقع شركة — «أفق»
- **EN:** Corporate site — “Ufuq”
- **Category:** موقع
- **Summary AR:** موقع تعريفي ثنائي اللغة مع مدونة وأعمال.
- **Summary EN:** Bilingual corporate site with blog and work.
- **Results:** +52% طلبات تواصل.
- **Stack:** Next.js, Sanity.

### 6. نظام إدارة محتوى — «مقال»
- **EN:** CMS — “Maqal”
- **Category:** نظام
- **Summary AR:** نظام تحرير متعدد اللغات مع سير عمل للنشر.
- **Summary EN:** Multilingual editing system with publishing workflow.
- **Results:** -70% وقت النشر.
- **Stack:** Sanity, Next.js.

> All project names and metrics are **placeholder examples**. Replace with real, verifiable case studies before launch.

## 6. Team (6)

| Name (placeholder) | Role AR | Role EN | Department |
|---|---|---|---|
| member-01 | مؤسس وقائد تقني | Founder & CTO | هندسة |
| member-02 | مطور واجهات أمامية | Frontend Developer | هندسة |
| member-03 | مطور خلفية | Backend Developer | هندسة |
| member-04 | مصمم UI/UX | UI/UX Designer | تصميم |
| member-05 | مطور تطبيقات جوال | Mobile Developer | هندسة |
| member-06 | مهندس DevOps | DevOps Engineer | هندسة |

- Use generated initials/avatars, not stock photos.
- Each profile: short bio (2–3 sentences), skills, social links.

## 7. Posts (6)

| Title AR | Title EN | Category |
|---|---|---|
| كيف تبني واجهة عربية RTL مثالية | Building a perfect Arabic RTL interface | تصميم |
| Next.js 16: ما الجديد ولماذا يهم فريقك | Next.js 16: what’s new and why it matters | تقنية |
| أداء الويب في 2026: قائمة فحص عملية | Web performance in 2026: a practical checklist | أداء |
| Sanity مقابل CMS التقليدية | Sanity vs traditional CMS | هندسة |
| نظام تصميم عربي من الصفر | Building an Arabic design system from scratch | تصميم |
| أتمتة النشر: من Git إلى الإنتاج | Deployment automation: from Git to production | DevOps |

Each post: excerpt, cover, author, publishedAt, readingTime, tags, PortableText body.

## 8. Testimonials (6) — placeholder

> These are **examples**, not real client quotes. Do not publish them as real. Mark `placeholder: true` in the CMS.

1. «فريق يفهم المنتج، لا ينفّذ فقط.» — مؤسس منصة تعليمية
2. «أسرع تسليم وأعلى جودة كود تعاملت معها.» — مدير تقني
3. «التصميم العربي كان نقطة التحول في تجربة عملائنا.» — مديرة تسويق
4. «دعم بعد الإطلاق كان ممتازًا وسريعًا.» — صاحب متجر
5. «شفافية في النطاق والسعر، والتزام بالمواعيد.» — مؤسس شركة ناشئة
6. «احترافية نادرة في التفاصيل.» — شريك تقني

## 9. FAQs (6)

| # | Question AR | Question EN | Answer AR (short) | Answer EN (short) |
|---|---|---|---|---|
| 1 | كم يستغرق المشروع؟ | How long does a project take? | من أسبوعين إلى 8 أسابيع حسب النطاق. | 2–8 weeks depending on scope. |
| 2 | هل تعملون عن بُعد؟ | Do you work remotely? | نعم، عن بُعد مع اجتماعات أسبوعية. | Yes, remote with weekly calls. |
| 3 | هل تشمل الأسعار الاستضافة؟ | Does pricing include hosting? | لا، لكن نساعدك في الاختيار والإعداد. | No, but we help you choose and set it up. |
| 4 | هل تسلّمون الكود المصدري؟ | Do you hand over the source code? | نعم، مع التوثيق الكامل. | Yes, with full documentation. |
| 5 | هل تدعمون العربية والإنجليزية؟ | Do you support Arabic and English? | نعم، RTL/LTR من الأساس. | Yes, RTL/LTR from the start. |
| 6 | كيف نبدأ؟ | How do we start? | أرسل نموذج التواصل أو واتساب. | Send the contact form or WhatsApp. |

## 10. Stats (placeholder)

| Metric | Value |
|---|---|
| projects | +60 |
| clients | +25 |
| Lighthouse average | 98 |
| satisfaction | 4.9/5 |

Mark as placeholder until real numbers are available.

## 11. Legal

- Privacy policy and terms are placeholder.
- Contact form must include a privacy note and consent.
- Do not collect more data than needed.
- Sanity `contactSubmission` is internal; define retention and access.

## 12. Replacement guide

1. Create/replace documents in Sanity Studio.
2. Keep the same slugs for existing pages; add redirects if slugs change.
3. Upload images with localized `alt` text.
4. Set `featured`/`order` for home sections.
5. Replace placeholder testimonials only with real, consented quotes.
6. Update `siteSettings` (email, WhatsApp, socials, stats).
7. Rebuild/revalidate.
8. Run a content QA pass in both languages.

## 13. Content QA checklist

- [ ] No lorem ipsum.
- [ ] Arabic is natural, not machine-translated.
- [ ] English is concise and correct.
- [ ] No fake client names/logos.
- [ ] No invented testimonials presented as real.
- [ ] Every image has alt text.
- [ ] Dates and reading times are correct.
- [ ] Links work.
- [ ] Legal pages are present.
- [ ] Contact details are correct.