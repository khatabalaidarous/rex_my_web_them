# CodeNest — خطة بناء موقع فريق برمجة (عربي / إنجليزي)

> **حزمة Handoff:** `AGENTS.md` + `README.md` + `docs/` + `.kilo/skill/codenest-handoff/SKILL.md` + `.kilo/command/handoff.md` موجودة في المشروع. اقرأ `AGENTS.md` أولًا.
>
> **حالة الخطة:** جاهزة للتنفيذ على مراحل (MVP أولًا).
> **مجلد العمل:** `C:\Users\user\Desktop\مجلد جديد\My_website_them` — يحتوي حاليًا على ملفات التوثيق/Handoff فقط (لا يوجد كود أو قاعدة بيانات أو إعدادات تشغيل).
> **البيئة المتحققة:** Node `22.12.0`، npm `10.9.0`، Git `2.54.0`، Python `3.14.2` (غير مستخدم في هذا المشروع).
> **الاسم المؤقت للعلامة:** `CodeNest — كود نست` (قابل للتغيير لاحقًا).
> **ملاحظة:** لا يمكن فحص «كل» مواقع الفرق البرمجية حرفيًا؛ هذه عينة تمثيلية من 14+ موقعًا ومرجعًا، مع استخلاص الأنماط التي تنطبق على مشروعنا.

---

## 1. القرارات المعتمدة

| البند | القرار |
|---|---|
| الهدف | موقع تعريفي/تسويقي لفريق برمجة: يعرض الفريق، الخدمات، الأعمال، المدونة، ونموذج تواصل. |
| اللغة | عربي (افتراضي، RTL) + إنجليزي (LTR)، تبديل عبر `/ar` و`/en`. |
| التقنية | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. |
| إدارة المحتوى | Sanity لكل المحتوى (مشاريع، مقالات، أعضاء، خدمات، آراء، أسئلة، إعدادات الموقع). |
| الهوية | داكنة فاخرة، accent بنفسجي + نعناعي، خطوط عربية/لاتينية احترافية. |
| الحركة | متقدمة متوازنة: Scroll Reveal، Counters، Code Window، Marquee، Cursor Follow، Magnetic، Tilt، Command Palette، Smooth Scroll اختياري. |
| الصفحات | رئيسية + أعمال + تفاصيل مشروع + فريق + تفاصيل عضو + خدمات + مدونة + مقال + من نحن + تواصل + بحث + قانونية + 404. |
| الميزات | نموذج تواصل + واتساب، بحث، وضع داكن/فاتح، SEO متقدم، Sanity، أرشفة/فهرسة. |
| الاستضافة | غير محددة؛ كود Node قياسي يعمل على Vercel أو أي استضافة تدعم Node. |
| التسليم | MVP أولًا ثم تحسينات. |

---

## 2. نتائج تحليل المواقع (الخلاصة)

### 2.1 العينة
| الموقع | النوع | ما يستحق الأخذ |
|---|---|---|
| Linear | منتج SaaS | وضوح القيمة، لقطات UI حقيقية، Changelog، أدلة اجتماعية، CTA متكرر. |
| basement.studio | استوديو/وكالة | الأعمال أولًا، الخدمات، شعارات العملاء، صفحة People. |
| Lusion | استوديو 3D | تجربة غامرة، لكنها ثقيلة/بطيئة على الجوال. |
| Vercel / Notion / Figma / Stripe | تسويق منتج | Hero + وعد محدد + إثبات + CTA، بساطة نسبية. |
| shubak.tech | تعريفي عربي | تبديل عربي/إنجليزي، لوحة تخصيص، نموذج متعدد الخطوات، عربية أولًا. |
| astro4tech.com | تعريفي عربي | نافذة كود في الـHero، تبويبات، تصفية أعمال، أسعار. |
| fluids.sa | استوديو عربي | عربية أولًا، منهجية معلنة، شفافية ملكية الكود. |
| anmarit / clickwave / egypt-code | تعريفي عربي | Marquee تقنيات، خدمات مرقّمة، إحصاءات، FAQ، واتساب. |
| Helga Digital Agency / Adchitects / Series Eight | صفحات فريق | بطاقات تفاعلية، فلترة، صور بديلة عند المرور، سيرة قصيرة. |

### 2.2 الأنماط الهيكلية الناجحة
1. **Hero** واضح: وعد واحد + وصف قصير + زرّان (تواصل / أعمال).
2. **Social Proof** مبكر: شعارات أو أرقام أو آراء.
3. **الخدمات** 3–6 خدمات، كل خدمة بنتيجة/مخرجات لا مجرد عنوان.
4. **الأعمال** مع تصفية، وبطاقة لكل مشروع فيها التحدي/الحل/النتيجة.
5. **منهجية العمل** 4–5 خطوات.
6. **التقنيات** كـMarquee أو شبكة أيقونات.
7. **الفريق** ببطاقات بشرية، لا صور Stock.
8. **الآراء + الأسئلة + CTA أخير + تواصل/فوتر**.

### 2.3 تفاعلات عملية (مرتبة بعائد/تكلفة)
- ظهور تدريجي عند التمرير + عدّادات.
- تصفية أعمال + معاينة تتبع المؤشر (Cursor Follow).
- تبديل داكن/فاتح محفوظ.
- نافذة كود متحركة (Typing/Tabs) في الـHero.
- بطاقات فريق تتقلب/تكشف، وتأثير ميلان خفيف.
- Marquee للتقنيات، أكورديون للأسئلة، سلايدر آراء.
- Command Palette (⌘K) كلمسة احترافية.
- تمرير ناعم Lenis + GSAP ScrollTrigger (اختياري، مع مراعاة تقليل الحركة).

### 2.4 أخطاء شائعة (نتجنبها)
- إغراق الصفحة بالحركات أو جعل المعلومة الأساسية تعتمد على المرور فقط.
- صور فريق وهمية/مبتذلة، وغياب أرقام أو أدلة حقيقية.
- نصوص عربية بخط Latin، `letter-spacing`، أو `line-height` ضيق.
- عدم عكس الأسهم/الأيقونات في RTL، وأرقام مختلطة تُعكس.
- موقع ثقيل (WebGL) يفقد الزائر على الجوال.
- نموذج تواصل بلا تحقق أو بلا حالة نجاح/خطأ واضحة.

### 2.5 قواعد RTL التي سنطبقها
- `dir="rtl"` و`lang="ar"` على `<html>`، و`dir="ltr"` للإنجليزية.
- خط عربي حقيقي: `IBM Plex Sans Arabic` (أساسي) + `Tajawal`/`Cairo` كبدائل.
- `line-height: 1.8–1.9` للعربية، و`letter-spacing: 0` (لا tracking على العربي).
- Logical Properties: `margin-inline-*`, `padding-inline-*`, `text-align: start/end`.
- عزل النصوص المختلطة: `<bdi>` أو `dir="ltr"` للأكواد وأرقام الهواتف.
- عكس الأسهم/الشيدرون/التقدم فقط؛ لا تُعكس الشعارات أو الأرقام أو روابط URL.
- اختبار 320px و200% تكبير، وعلى iOS Safari وAndroid Chrome.

---

## 3. الهوية البصرية المقترحة (CodeNest)

### 3.1 الاسم والشعار
- **الاسم:** `CodeNest` / `كود نست`.
- **الشعار:** Mark هندسي 32×32 (مربع نصف دائري بتدرج + رمز `</>`)، + Wordmark.
- **الملفات:** `app/icon.svg`، `public/logo.svg`، `public/logo-light.svg`، `public/og/default.jpg`.
- **النبرة:** واثقة، تقنية، إنسانية، بلا مبالغة.

### 3.2 الألوان (Dark-first + Light)
| Token | Dark | Light | الاستخدام |
|---|---|---|---|
| `--bg` | `#07070B` | `#FAFAF8` | خلفية |
| `--bg-elevated` | `#0D0D13` | `#FFFFFF` | أسطح مرتفعة |
| `--surface` | `#111119` | `#FFFFFF` | بطاقات |
| `--surface-2` | `#16161F` | `#F3F3F0` | تعبئة ثانوية |
| `--border` | `rgba(255,255,255,.08)` | `rgba(10,10,15,.10)` | حدود |
| `--text` | `#F4F4F6` | `#0B0B10` | نص |
| `--text-muted` | `#A5A5B4` | `#565664` | نص ثانوي |
| `--primary` | `#7C5CFF` | `#5B3DF5` | الأساسي |
| `--accent` | `#4FE3C1` | `#0EA5A0` | لمسات |
| `--ring` | `#7C5CFF` | `#5B3DF5` | التركيز |

- تدرج التوقيع: `linear-gradient(135deg, #7C5CFF 0%, #4FE3C1 100%)`.
- Glow: `radial-gradient(60% 60% at 20% 0%, rgba(124,92,255,.25), transparent 70%)` + لمسة نعناعية.
- لا نستخدم أكثر من لونين accent في الشاشة الواحدة.

### 3.3 الخطوط
| الاستخدام | الخط | الأوزان |
|---|---|---|
| عربي (عرض/نص) | `IBM Plex Sans Arabic` | 300–700 |
| لاتيني عرض | `Space Grotesk` | 500–700 |
| لاتيني نص | `Inter` | 400–600 |
| كود | `JetBrains Mono` | 400–600 |

- تحميل عبر `next/font/google` مع `display: swap` وself-host.
- عربي: `line-height 1.85` للنص، 1.35 للعناوين، وحجم 17–18px للجسم.
- لاتيني: `line-height 1.65`، وtracking سالب خفيف للعناوين فقط.

### 3.4 الشبكة والمسافات
- حاوية: `max-width: 1280px`، `padding-inline: clamp(20px, 5vw, 48px)`.
- 12 عمودًا، gap 24px.
- إيقاع الأقسام: `padding-block: clamp(72px, 10vw, 140px)`.
- أنصاف أقطار: 10 / 16 / 24 / 32 / full.
- ظلال طبقية خفيفة، وحدود 1px.

### 3.5 الحركة
- `ease-out-expo: cubic-bezier(.16, 1, .3, 1)`.
- Reveal: 700ms، TranslateY 24px + Blur 8px → 0.
- Stagger: 60–90ms بين العناصر.
- Hover: 300ms؛ Magnetic: 0.3s؛ Cursor lag: 0.25–0.45s.
- كل الحركات: `prefers-reduced-motion` يوقفها ويُظهر المحتوى ثابتًا.
- لا نُحرّك `width/height/top/left`؛ فقط `transform/opacity/clip-path`.

### 3.6 الصور
- **لا صور أشخاص حقيقية** في النسخة الأولى: صور رمزية (Avatar) بأسماء أولية + تدرجات.
- أغلفة المشاريع: تدرجات/أشكال SVG مولّدة محليًا (بدون Stock).
- كل الصور عبر `next/image` + Sanity CDN.
- أي صورة بديلة تُوثّق في `content/README.md` لتُستبدل لاحقًا.

---

## 4. البنية التقنية

### 4.1 الحزم (الإصدارات وقت إعداد الخطة)
| الحزمة | الإصدار | الدور |
|---|---|---|
| `next` | `16.4.6` | App Router / RSC / SSR |
| `react` / `react-dom` | 19.x | واجهة |
| `tailwindcss` | `4.3.5` | تنسيق |
| `next-intl` | `4.15.1` | i18n + Routing |
| `next-sanity` | `13.4.0` | جلب المحتوى |
| `sanity` | `6.23.0` | Studio + Schema |
| `gsap` | `3.15.1` | حركة متقدمة |
| `@gsap/react` | `2.1.2` | تكامل React |
| `lenis` | `1.3.27` | تمرير ناعم (اختياري) |
| `next-themes` | `0.4.6` | داكن/فاتح |
| `lucide-react` | `1.72.0` | أيقونات |
| `react-hook-form` | `7.92.0` | نموذج |
| `zod` | `4.6.7` | تحقق |
| `cmdk` | `1.1.1` | Command Palette |
| `shadcn/ui` | CLI latest | مكونات أساسية (Radix) |

> تُثبّت الإصدارات الفعلية عند التنفيذ، ويُعاد التحقق من توافق `next`/`sanity` قبل تثبيت أي حزمة كبيرة.

### 4.2 شجرة المشروع المقترحة
```
.
├─ app/
│  ├─ [locale]/
│  │  ├─ layout.tsx                # html/body + dir + lang + fonts + providers
│  │  ├─ page.tsx                  # الرئيسية
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
│  ├─ api/
│  │  ├─ contact/route.ts
│  │  ├─ search/route.ts
│  │  └─ revalidate/route.ts       # اختياري: Sanity webhook
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ manifest.ts
│  ├─ icon.svg
│  └─ globals.css
├─ components/
│  ├─ layout/        (Header, Footer, LocaleSwitcher, ThemeToggle, CommandPalette, WhatsAppFloat)
│  ├─ sections/      (Hero, LogoCloud, Stats, Services, FeaturedWork, Process, TechStack, TeamPreview, Testimonials, BlogPreview, FAQ, CTA)
│  ├─ ui/            (Button, Card, Badge, Accordion, Dialog, Tabs, Input, Textarea, Marquee, Reveal, Counter, TiltCard, MagneticLink, CodeWindow)
│  ├─ motion/        (SmoothScroll, RevealProvider, PageTransition)
│  └─ sanity/        (PortableText, SanityImage, RichText)
├─ content/          # بيانات Placeholder محلية (fallback)
├─ i18n/             (routing.ts, navigation.ts, request.ts, messages/ar.json, en.json)
├─ lib/              (sanity/client.ts, queries.ts, data.ts, seo.ts, utils.ts, validations.ts, types.ts)
├─ studio/           # تطبيق Sanity Studio منفصل (CMS)
│  ├─ sanity.config.ts
│  ├─ sanity.cli.ts
│  ├─ schemas/
│  ├─ structure.ts
│  ├─ seed.ts
│  └─ package.json
├─ public/           (logo, og, avatars, icons)
├─ tests/            (unit + e2e)
├─ proxy.ts          # Next 16: توفيق اللغة
├─ next.config.ts
├─ postcss.config.mjs
├─ tsconfig.json
├─ eslint.config.mjs
├─ package.json
└─ README.md
```

### 4.3 ملاحظات معمارية مهمة
- **Next 16:** ملف `proxy.ts` يحل محل `middleware.ts`؛ الدالة تُسمّى `proxy`. لا نستخدم `runtime: 'edge'`.
- **next-intl:** `defineRouting` + `createNavigation` + `getRequestConfig` + `setRequestLocale` داخل `[locale]/layout.tsx` وكل صفحة.
- **RTL/LTR:** `dir` على `<html>` من الـlayout، وليس في CSS فقط.
- **Sanity Studio:** يُشغّل منفصلًا (`cd studio && npx sanity dev` / `npx sanity deploy`)، ولا نضع `/studio` داخل `[locale]` لتجنب تعارض الجذور (root layout) في Next. استثنِ `studio/` من `tsconfig.json` و`eslint` لأنه تطبيق مستقل.
- **Next 16:** `next lint` أُلغي؛ سكربت `lint` = `eslint .`.
- **بيانات Placeholder:** `lib/data.ts` يختار Sanity عند وجود `SANITY_PROJECT_ID`، وإلا يقرأ من `content/*.ts`. بهذا يعمل `npm run build` قبل ربط Sanity.
- **الاستضافة:** كود Next قياسي (Node)؛ لا نعتمد على ميزات Vercel حصرية. يمكن النشر على Vercel أو أي استضافة Node.

---

## 5. خريطة المسارات

| المسار | الصفحة | المصدر | ملاحظات |
|---|---|---|---|
| `/` | إعادة توجيه | — | إلى `/ar` افتراضيًا (proxy). |
| `/ar` | الرئيسية | Sanity + ثابت | الواجهة العربية RTL. |
| `/en` | الرئيسية | Sanity + ثابت | الواجهة الإنجليزية LTR. |
| `/ar/about` | من نحن | Sanity `page` + ثابت | القصة، القيم، الخط الزمني. |
| `/ar/services` | الخدمات | Sanity `service` | 6 خدمات + مخرجات + CTA. |
| `/ar/work` | الأعمال | Sanity `project` | تصفية + شبكة + Modal/رابط. |
| `/ar/work/[slug]` | تفاصيل مشروع | Sanity `project` | تحدي/حل/نتائج/معرض. |
| `/ar/team` | الفريق | Sanity `member` | تصفية بالقسم + بطاقات. |
| `/ar/team/[slug]` | عضو | Sanity `member` | سيرة + مهارات + أعمال. |
| `/ar/blog` | المدونة | Sanity `post` | مقال مميز + شبكة + بحث/تصفية. |
| `/ar/blog/[slug]` | مقال | Sanity `post` | PortableText + TOC + مشاركة. |
| `/ar/contact` | تواصل | ثابت + Sanity | نموذج + واتساب + معلومات. |
| `/ar/search` | بحث | Sanity | نتائج مجمّعة. |
| `/ar/privacy` | الخصوصية | Sanity `legal` | نص ثابت/مبدئي. |
| `/ar/terms` | الشروط | Sanity `legal` | نص ثابت/مبدئي. |
| `/api/contact` | POST | — | تحقق + تخزين في Sanity + بريد اختياري. |
| `/api/search` | GET | Sanity | بحث المشاريع/المقالات/الأعضاء. |
| `/sitemap.xml` | Sitemap | Sanity + ثابت | locales + hreflang. |
| `/robots.txt` | Robots | ثابت | يسمح بالفهرسة ويمنع `/api`. |
| `/manifest.webmanifest` | PWA manifest | ثابت | اسم/أيقونات/لون. |

---

## 6. الصفحة الرئيسية — Wireframe قسمًا بقسم

### 6.1 الهيدر (Header)
- ثابت أعلى الصفحة، `backdrop-blur`، شارة سفلية عند التمرير.
- الشعار + روابط: الرئيسية، الخدمات، الأعمال، الفريق، المدونة، تواصل.
- يمين/يسار حسب اللغة: مبدّل اللغة (`ع` / `EN`)، مبدّل الوضع (شمس/قمر)، زر `ابدأ مشروعك`.
- الجوال: زر قائمة → درج كامل الشاشة (Drawer) مع تركيز محبوس، إغلاق بـEsc، وتعطيل تمرير الخلفية.
- الرابط النشط: `aria-current="page"` + مؤشر سفلي متحرك.

### 6.2 الهيرو (Hero)
- **الهدف:** خلال 5 ثوانٍ: من نحن، ماذا نقدم، ماذا نفعل.
- **تخطيط:** عمودان على الديسكتوب (نص + نافذة كود)، عمود واحد على الجوال.
- **النص:** شارة «متاحون لمشاريع جديدة» + H1 + وصف + زرّان + سطر ثقة (تقييم/عملاء).
- **بصري:** نافذة كود افتراضية (LTR) بتبويبات `Next.js / React / Node` + سطر يُكتب تدريجيًا + بطاقات عائمة: `Lighthouse 98`، `Lighthouse 100`، `24/7 دعم`.
- **خلفية:** شبكة 1px + توهج بنفسجي/نعناعي + Noise خفيف.
- **RTL:** النص يمين، النافذة يسار؛ الكود يبقى LTR.
- **إتاحة:** الكود الزخرفي `aria-hidden` + ملخص نصي مخفي بصريًا.

### 6.3 شعارات العملاء (Logo Cloud)
- عنوان قصير: «موثوقون من فرق تطمح للأفضل».
- 8 شعارات نصية Placeholder في Marquee (نسخة مكررة)؛ تتوقف عند المرور/Focus.
- مع `prefers-reduced-motion`: شبكة ثابتة.

### 6.4 الأرقام (Stats)
- 4 أرقام: مشاريع، عميل، متوسط Lighthouse، سنة خبرة.
- عدّادات تتحرك عند الظهور، `Intl.NumberFormat('ar-u-nu-latn')` (أرقام لاتينية للاتساق).
- خلفية داكنة/فاتحة متباينة، وحدود رقيقة.

### 6.5 الخدمات (Services)
- عنوان + وصف + رابط «كل الخدمات».
- 6 بطاقات (3×2): أيقونة، عنوان، وصف، 3 مخرجات، رابط.
- Hover: رفع 2px، توهج، سهم يتحرك.
- بطاقة مميزة (SaaS) بخلفية متدرجة.

### 6.6 الأعمال المميزة (Featured Work)
- عنوان + فلاتر: الكل / مواقع / تطبيقات / متاجر / أنظمة.
- 6 مشاريع، بطاقات 2×3 على الديسكتوب.
- كل بطاقة: غلاف، تصنيف، عنوان، ملخص، مقياس نتيجة، تقنيات، سهم.
- Hover: تكبير الغلاف + معاينة تتبع المؤشر (ديسكتوب فقط).
- «شاهد كل الأعمال».

### 6.7 منهجية العمل (Process)
- 4 خطوات: اكتشاف، تصميم، تطوير، إطلاق ونمو.
- ديسكتوب: عمود لاصق (Sticky) للخطوة النشطة + بطاقات تمرير + خط تقدم (GSAP ScrollTrigger).
- جوال: خط زمني عمودي بسيط.
- كل خطوة: رقم، عنوان، وصف، مخرجات.

### 6.8 التقنيات (Tech Stack)
- Marquee صفّان باتجاهين متعاكسين + أيقونات/أسماء.
- TypeScript, React, Next.js, Tailwind, Node.js, PostgreSQL, Sanity, GSAP, Figma, Docker, AWS, Flutter.
- عنوان: «أدوات نعمل بها» + سطر: «نختار التقنية المناسبة، لا العكس».

### 6.9 فريق العمل (Team Preview)
- عنوان + رابط «تعرف على الفريق».
- 4–6 أعضاء: صورة رمزية، اسم، دور، سوشيال عند المرور.
- بطاقات مع ميلان 3D خفيف (ديسكتوب) وروابط كاملة للملف.
- بطاقة «انضم للفريق» اختيارية.

### 6.10 آراء العملاء (Testimonials)
- سلايدر: 1 كبير + بطاقتان جانبيتان (ديسكتوب)، 1 على الجوال.
- أزرار prev/next + نقاط + `aria-live` + دعم لوحة المفاتيح.
- كل رأي: اقتباس، صورة، اسم، دور، شركة، رابط مشروع.
- إيقاف تلقائي عند المرور/التركيز، وتعطيل مع تقليل الحركة.

### 6.11 المدونة (Blog Preview)
- مقال مميز كبير + مقالان صغيران.
- تصنيف، تاريخ، مدة قراءة، صورة.
- «كل المقالات».

### 6.12 الأسئلة الشائعة (FAQ)
- عمودان: عنوان + CTA «اسأل سؤالًا» / أكورديون 6 أسئلة.
- Accordion مخصص بـRadix أو `<details>` مع ARIA.
- بيانات FAQPage JSON-LD.

### 6.13 دعوة أخيرة (CTA)
- لوحة متدرجة كبيرة: «لديك فكرة؟» + «لنحوّلها إلى منتج حقيقي».
- زرّان: ابدأ مشروعك / واتساب.
- سطر: «نرد خلال يوم عمل واحد» + البريد.

### 6.14 الفوتر (Footer)
- 4 أعمدة: العلامة + نبذة + سوشيال؛ خريطة الموقع؛ الخدمات؛ تواصل.
- سطر سفلي: حقوق النشر، الخصوصية/الشروط، مبدّل اللغة، زر للأعلى.
- Wordmark كبير بخلفية شفافة (لمسة بصرية).

---

## 7. الصفحات الداخلية — المتطلبات

### 7.1 من نحن `/about`
- Hero برسالة المهمة.
- القصة/الرؤية/القيم (4 بطاقات).
- خط زمني 2020–2026.
- أرقام + فريق مصغّر + CTA.

### 7.2 الخدمات `/services`
- Hero + قائمة جانبية لاصقة (Anchors).
- 6 أقسام خدمة: الوصف، التحدي، المخرجات، التقنيات، CTA.
- FAQ + CTA.

### 7.3 الأعمال `/work`
- Hero + فلاتر + شبكة + «تحميل المزيد».
- بطاقة موحّدة: غلاف، عنوان، تصنيف، نتيجة.
- Empty State واضح.

### 7.4 تفاصيل المشروع `/work/[slug]`
- Hero: تصنيف، عنوان، ملخص، سنة/عميل/خدمات.
- سايدبار: العميل، السنة، الخدمات، التقنيات، رابط خارجي (اختياري).
- الأقسام: التحدي، الحل، النتائج (3 مقاييس)، معرض، اقتباس.
- «المشروع التالي» + CTA.

### 7.5 الفريق `/team`
- Hero + تصفية بالقسم (هندسة/تصميم/إدارة).
- شبكة أعضاء + بطاقة «انضم».
- القيم/الثقافة + CTA.

### 7.6 عضو `/team/[slug]`
- صورة، اسم، دور، سوشيال، سيرة.
- مهارات + مشاريع ذات صلة.
- «العضو التالي».

### 7.7 المدونة `/blog`
- مقال مميز + فلاتر تصنيف + بحث + شبكة.
- بطاقة: صورة، تصنيف، عنوان، مقتطف، تاريخ، مدة قراءة.
- Empty State + «تحميل المزيد».

### 7.8 المقال `/blog/[slug]`
- Hero: تصنيف، عنوان، مقتطف، كاتب، تاريخ، مدة قراءة، غلاف.
- تخطيط: مقال + TOC لاصق (ديسكتوب).
- PortableText: عناوين، قوائم، اقتباس، كود (زر نسخ)، صور (تعليق).
- شريط تقدم القراءة + مشاركة + وسوم.
- كاتب + مقالات ذات صلة + CTA.

### 7.9 التواصل `/contact`
- عمودان: نموذج + معلومات التواصل/واتساب.
- الحقول: الاسم، البريد، الشركة (اختياري)، الخدمة، الميزانية، الرسالة، honeypot.
- تحقق فوري + رسائل خطأ مرتبطة `aria-describedby` + حالة نجاح/خطأ `aria-live`.
- بديل واتساب برسالة جاهزة.
- رابط الخصوصية.

### 7.10 البحث `/search`
- حقل بحث (debounce) + نتائج مجمّعة: مشاريع/مقالات/أعضاء.
- قراءة `?q=` من الرابط.
- اختصار `⌘K` يفتح Command Palette ويمرر إلى `/search`.

### 7.11 القانونية `/privacy` و`/terms`
- محتوى من Sanity `legal` (عنوان + PortableText).
- تحديث تلقائي عند النشر.

### 7.12 404
- 404 كبير + رسالة + روابط: الرئيسية/الأعمال/تواصل.
- بالعربية والإنجليزية.

---

## 8. نموذج المحتوى في Sanity

### 8.1 المخططات (Schemas)
| النوع | الحقول الأساسية |
|---|---|
| `siteSettings` | عنوان، وصف، شعار، روابط اجتماعية، بريد، واتساب، إحصاءات، `footerText`. |
| `service` | `title{ar,en}`, `slug`, `icon`, `summary{ar,en}`, `body{ar,en}` (PortableText), `deliverables[]`, `stack[]`, `order`, `featured`. |
| `project` | `title{ar,en}`, `slug`, `client`, `year`, `category`, `summary{ar,en}`, `cover`, `gallery[]`, `challenge{ar,en}`, `solution{ar,en}`, `results[{label{ar,en}, value}]`, `stack[]`, `testimonial` (ref), `featured`, `order`. |
| `member` | `name`, `slug`, `role{ar,en}`, `photo`, `bio{ar,en}`, `skills[]`, `socials`, `department`, `order`. |
| `post` | `title{ar,en}`, `slug`, `excerpt{ar,en}`, `cover`, `category`, `publishedAt`, `readingTime`, `author` (ref), `body{ar,en}` (PortableText), `tags[]`, `featured`. |
| `testimonial` | `quote{ar,en}`, `author`, `role{ar,en}`, `company`, `avatar`, `rating`, `project` (ref). |
| `faq` | `question{ar,en}`, `answer{ar,en}`, `category`, `order`. |
| `legal` | `type` (privacy/terms), `title{ar,en}`, `body{ar,en}` (PortableText). |
| `contactSubmission` | `name`, `email`, `company`, `service`, `budget`, `message`, `createdAt` (قراءة فقط). |

### 8.2 الترجمة
- كائنات مخصصة: `localeString`, `localeText`, `localeBlock` بحقول `{ar, en}`.
- دالة `pickLocale(value, locale)` في `lib/utils.ts`.
- slug واحد لكل مستند (يُستخدم في اللغتين) لتجنب تعارض الروابط.
- Alt الصور: حقل `alt{ar,en}` إلزامي.

### 8.3 التشغيل والبيانات
- `.env.local`:
  ```
  NEXT_PUBLIC_SANITY_PROJECT_ID=...
  NEXT_PUBLIC_SANITY_DATASET=production
  NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
  SANITY_WRITE_TOKEN=...          # سيرفر فقط
  NEXT_PUBLIC_SITE_URL=https://example.com
  ```
- Studio منفصل: `cd studio && npm run dev` (localhost:3333) و`npm run deploy`. لا نضع `/studio` داخل Next لتجنب تعارض root layout.
- بيانات Placeholder: 6 مشاريع، 6 أعضاء، 6 خدمات، 6 مقالات، 6 آراء، 6 أسئلة.
- سكربت `studio/seed.ts` لإنشاء المحتوى الأولي عبر `@sanity/client`.
- إذا لم توجد متغيرات البيئة: `lib/data.ts` يستخدم `content/*.ts` (بيانات محلية). البناء يعمل.

### 8.4 الجلب والتحديث
- `lib/sanity/client.ts`: `useCdn: true`، `perspective: 'published'`.
- `lib/sanity/queries.ts`: GROQ + `defineQuery`.
- `sanityFetch` مع `next: { revalidate: 3600, tags: ['projects'] }`.
- Webhook اختياري `/api/revalidate` لإعادة التحقق عند النشر.
- `generateStaticParams` للمشاريع/الأعضاء/المقالات + `dynamicParams = true`.

---

## 9. الميزات التفاعلية — الأولوية والتنفيذ

| الميزة | التنفيذ | التشغيل | بديل الجوال/اللمس | تقليل الحركة |
|---|---|---|---|---|
| Scroll Reveal | `IntersectionObserver` + CSS classes | دخول viewport | يعمل (بدون blur) | إظهار فوري |
| Counters | `requestAnimationFrame` | أول ظهور | يعمل | قيمة نهائية |
| Code Window | Tabs + typing (JS/CSS) | داخل viewport | تبويبات ثابتة | نص ثابت |
| Marquee | CSS keyframes + نسخ مكرر | تلقائي | إيقاف عند اللمس | شبكة ثابتة |
| Cursor Follow | `gsap.quickTo` | Hover على بطاقات الأعمال | قائمة/شبكة عادية | معطّل |
| Magnetic | `pointermove` + transform | Hover | معطّل | معطّل |
| Tilt | `pointermove` + rotateX/Y | Hover | معطّل | معطّل |
| Portfolio Filter | `useState` + CSS layout | Click | يعمل | انتقال فوري |
| Testimonial Slider | `scroll-snap` + أزرار | Click/سحب | يعمل | بدون تلقائي |
| Accordion | Radix Accordion | Click | يعمل | بدون حركة |
| Command Palette | `cmdk` + Dialog | `⌘K` / `Ctrl+K` | زر بحث | معطّل |
| Reading Progress | scroll listener | مقال | معطّل | معطّل |
| Smooth Scroll | Lenis + GSAP ticker | ديسكتوب | معطّل على اللمس | معطّل |
| Page Transition | CSS/View Transitions | تنقل | يعمل | معطّل |
| Theme Toggle | `next-themes` | Click | يعمل | فوري |
| Locale Switch | next-intl `Link` | Click | يعمل | فوري |
| WhatsApp Float | رابط ثابت | بعد 600ms | يعمل | فوري |
| Contact Form | RHF + Zod + API | إرسال | يعمل | فوري |

### 9.1 قواعد التنفيذ
- كل مكوّن تفاعلي: `use client` فقط عند الحاجة، والباقي Server Components.
- `next/dynamic` للمكونات الثقيلة (Command Palette، Cursor Preview).
- لا نُخفي معلومات أساسية خلف Hover؛ كل بطاقة فريق/مشروع لها رابط وصف.
- `aria-label` للأزرار الأيقونية، و`aria-expanded` للقوائم/الأكورديون.
- اختبار الحركات على جهاز ضعيف (CPU throttling 4x) وعلى iPhone SE.

---

## 10. SEO و i18n

### 10.1 Metadata
- `metadataBase` من `NEXT_PUBLIC_SITE_URL`.
- عنوان: `%s | CodeNest` / `%s | كود نست` عبر `template`.
- وصف مترجم (localized) لكل صفحة.
- `alternates.canonical` + `languages: { ar, en, 'x-default': '/ar' }`.
- OpenGraph + Twitter: `summary_large_image`.
- صور OG: `public/og/default.jpg` و`default-ar.jpg` (ثابتة). ملاحظة: `next/og` لا يدعم تشكيل العربية جيدًا؛ نستخدم صورًا جاهزة.

### 10.2 JSON-LD
- `Organization` + `sameAs` (سوشيال).
- `WebSite` + `SearchAction` (بحث الموقع).
- `BreadcrumbList` لكل صفحة داخلية.
- `Person` لصفحات الأعضاء.
- `BlogPosting` للمقالات.
- `FAQPage` للأسئلة.
- `Service` للخدمات.

### 10.3 ملفات
- `sitemap.ts`: كل الصفحات + slugs من Sanity × locales.
- `robots.ts`: allow `/`، disallow `/api`.
- `manifest.ts`: الاسم، الأيقونات، `theme_color`.
- `hreflang` يدوي في metadata (next-intl `alternateLinks: false` لتجنب التكرار).

### 10.4 دلالة HTML
- `header/nav/main/section/article/aside/footer`.
- H1 واحد لكل صفحة، وتسلسل عناوين منطقي.
- `lang` + `dir` على `<html>`.
- `<bdi>` للأرقام/الأكواد اللاتينية داخل نص عربي.

---

## 11. الأداء وإمكانية الوصول

### 11.1 الميزانيات
- JS الأولي: أقل من 180KB مضغوط.
- LCP < 2.5s على 4G، CLS < 0.1، INP < 200ms.
- Lighthouse: الأداء/الوصول/أفضل الممارسات/SEO ≥ 90 (الهدف 100 للوصول).
- خطوط: 4 عائلات كحد أقصى، بأوزان محدودة.
- صور: AVIF/WebP، `sizes` صحيحة، `priority` للهيرو فقط.

### 11.2 قائمة الوصول (WCAG 2.2 AA)
- Skip link، تركيز واضح، معالم ARIA، تسميات النماذج.
- تنقل كامل بلوحة المفاتيح (قائمة، أكورديون، سلايدر، Modal).
- تباين 4.5:1 للنص، 3:1 للكبير.
- دعم تكبير 200% وعرض 320px.
- `prefers-reduced-motion` يحترم.
- لا معلومة hover-only.
- فحص Screen Reader (NVDA + VoiceOver).

### 11.3 الأداء
- RSC افتراضيًا؛ Client فقط للتفاعل.
- `next/image` + Sanity CDN (`auto=format`, `q=75`, `w`).
- تحميل مؤجل للمكونات الثقيلة.
- لا مكتبات تحليل ثقيلة؛ `@vercel/analytics` اختياري.
- قياس على Moto G4-ish / iPhone SE.

---

## 12. خطة التنفيذ على مراحل (MVP أولًا)

### المرحلة 0 — التأسيس (1–2 يوم)
- `create-next-app` + TypeScript + Tailwind + App Router.
- تثبيت الحزم، إعداد ESLint/Prettier، `.env.example`، `.gitignore`.
- نظام التصميم: ألوان/خطوط/مسافات في `globals.css` + `@theme`.
- `[locale]/layout.tsx` + `proxy.ts` + next-intl + next-themes.
- الهيدر/الفوتر + مكونات UI الأساسية.
- بيانات Placeholder + صفحات هيكلية.
- **التحقق:** `npm run dev`، `npm run build`، `npm run lint` بدون أخطاء.

### المرحلة 1 — الرئيسية (2–3 أيام)
- كل أقسام الرئيسية (6.2–6.14).
- Motion الأساسي: Reveal، Counters، Marquee، Code Window.
- Responsive + RTL/LTR + Dark/Light.
- **التحقق:** معاينة 375/768/1440/1920، عربي/إنجليزي، داكن/فاتح.

### المرحلة 2 — الصفحات الداخلية (3–4 أيام)
- About, Services, Work, Project, Team, Member, Blog, Post, Contact, Search, Legal, 404.
- Metadata + JSON-LD + Sitemap + Robots + hreflang.
- نموذج التواصل (واجهة + تحقق + حالات) وبحث.
- **التحقق:** كل الروابط تعمل، لا أخطاء 404 داخلية، SEO metadata صحيح.

### المرحلة 3 — Sanity والمحتوى (2–3 أيام)
- `studio/sanity.config.ts` + schemas + Studio + seed.
- `lib/sanity` + `lib/data.ts` (fallback) + GROQ.
- ربط الصفحات، `generateStaticParams`، ISR/revalidate.
- `contactSubmission` + webhook اختياري.
- **التحقق:** Studio يحرر/ينشر، الموقع يقرأ، البناء يعمل مع/بدون متغيرات البيئة.

### المرحلة 4 — التفاعل المتقدم (2–3 أيام)
- Cursor Follow، Magnetic، Tilt، Command Palette.
- Reading Progress، Page Transition، Smooth Scroll (مع Guards).
- تحسين الحالات: Loading/Empty/Error/Success.
- **التحقق:** الأداء لم يتدهور، لا تعارض مع RTL، لا حركة قسرية.

### المرحلة 5 — التسليم (1–2 يوم)
- فحص شامل (أدوات + أجهزة + قارئات شاشة).
- Lighthouse، إصلاحات.
- README: التشغيل، النشر، إدارة المحتوى، استبدال Placeholder.
- نشر تجريبي + نطاق/SSL (اختياري).
- **التحقق:** قائمة Definition of Done أدناه.

---

## 13. التحقق (Verification)

### 13.1 أوامر
```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
npm run test
npm run test:e2e
```

### 13.2 اختبارات
- **Vitest:** `pickLocale`، slug، التحقق (Zod)، تنسيق الأرقام.
- **Playwright:**
  - الرئيسية تُحمّل بالعربية والإنجليزية.
  - تبديل اللغة والوضع.
  - قائمة الجوال، الأكورديون، الفلاتر.
  - النموذج: رسائل الخطأ + النجاح.
  - Command Palette.
- **Lighthouse:** 4 مسارات (أداء/وصول/أفضل ممارسات/SEO).
- **Axe:** فحص تلقائي للوصول.

### 13.3 قائمة القبول اليدوية
- [ ] كل صفحة تعمل في `/ar` و`/en`.
- [ ] RTL/LTR صحيح: الهيدر، الأيقونات، الأرقام، النموذج.
- [ ] داكن/فاتح في كل الصفحات.
- [ ] 375px، 768px، 1440px، 1920px.
- [ ] Skip link/التركيز/التنقل بلوحة المفاتيح.
- [ ] `prefers-reduced-motion` يوقف الحركة.
- [ ] الصور `alt` صحيحة.
- [ ] لا أخطاء Console.
- [ ] `npm run build` نظيف.
- [ ] Sanity: إضافة/تعديل/نشر مشروع ومقال وعضو.
- [ ] النموذج يصل Sanity (أو رسالة واضحة إذا لم تُضبط المفاتيح).

---

## 14. المخاطر والتخفيف

| الخطر | الأثر | التخفيف |
|---|---|---|
| تعارض إصدارات Next/Sanity | فشل بناء | تثبيت الإصدارات، اختبار مبكر، `npm ls` |
| غياب مفاتيح Sanity | توقف المحتوى | `lib/data.ts` ي fallback للبيانات المحلية |
| تعقيد RTL/LTR | أخطاء اتجاه | Logical Properties + اختبار مزدوج |
| أداء الحركة على الجوال | بطء | إيقاف الحركة على اللمس + تقليل الحركة |
| جودة المحتوى العربي | نص ركيك | Placeholder واقعي + مراجعة لغوية لاحقًا |
| نصوص OG العربية | تشكيل خاطئ | صور OG ثابتة مُعدّة مسبقًا |
| الاستضافة غير محددة | تكلفة/إعداد | كود Node قياسي + دليل نشر |
| سبام النموذج | رسائل مزعجة | honeypot + rate limit + موافقة |
| الاعتماد على صور Stock | حقوق/مصداقية | صور مولّدة/رمزية + استبدال لاحقًا |

---

## 15. قرارات مفتوحة (تحتاج input لاحقًا)
1. اسم العلامة الحقيقي (حاليًا `CodeNest — كود نست` Placeholder).
2. النطاق (Domain) وحساب الاستضافة.
3. البريد الرسمي، رقم واتساب، روابط السوشيال.
4. أداة التحليلات (Vercel Analytics / GA4 / Plausible).
5. هل نضيف قسم أسعار/باقات؟ (غير مختار حاليًا).
6. هل نحمي Sanity Studio بكلمة مرور/تسجيل دخول؟
7. لون accent النهائي: بنفسجي `#7C5CFF` أم نعناعي `#4FE3C1`؟
8. أرقام عربية-هندية أم لاتينية؟ (الخطة: لاتينية للاتساق).
9. المراجعة اللغوية للعربية والإنجليزية (محتوى Placeholder).
10. سياسة الخصوصية/الشروط النهائية.

---

## 16. تعريف «تم» (Definition of Done)
- [ ] كل المسارات تعمل في اللغتين، مع RTL/LTR صحيح.
- [ ] الرئيسية تحتوي كل الأقسام، متجاوبة، وتفاعلاتها تعمل.
- [ ] Sanity: كل المحتوى قابل للتحرير والنشر، والبناء يعمل بدونه.
- [ ] النموذج يتحقق ويخزن (أو يعرض حالة تجريبية واضحة).
- [ ] SEO: metadata، hreflang، sitemap، robots، JSON-LD.
- [ ] Lighthouse ≥ 90 (الوصول 100) وAxe نظيف.
- [ ] لا أخطاء Build/Lint/Type/Console.
- [ ] README + دليل النشر + دليل المحتوى.
- [ ] لا نصوص Placeholder ظاهرة في الواجهة (تُستبدل بمحتوى واقعي).

---

## 17. أول خطوات التنفيذ

```bash
# 1) التأسيس داخل المجلد الحالي (فارغ)
npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack --yes

# 2) الحزم الأساسية
npm install next-intl@4.15.1 next-themes@0.4.6 gsap@3.15.1 @gsap/react@2.1.2 lenis@1.3.27 lucide-react@1.72.0 react-hook-form@7.92.0 zod@4.6.7 cmdk@1.1.1
npm install next-sanity@13.4.0 sanity@6.23.0 @sanity/vision @sanity/image-url

# 3) أدوات التطوير
npm install -D @playwright/test vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @axe-core/playwright

# 4) مكونات shadcn
npx shadcn@latest init -d
npx shadcn@latest add button card badge accordion dialog tabs input textarea dropdown-menu sheet tooltip sonner

# 5) الاستوديو (تطبيق منفصل)
npm create sanity@latest studio
# اختر مشروعًا جديدًا/hasExistingProject حسب الحاجة، ثم:
cd studio; npm run dev
```

> بعد التأسيس: إنشاء `i18n/`، `lib/sanity`، `content/`، ثم البدء بالمرحلة 1 (الرئيسية).

---

## 18. ملاحظات ختامية
- **الخطة قابلة للتنفيذ مباشرة**، لكنها لا تبدأ التنفيذ قبل موافقتك.
- أي تغيير في الاسم/اللون/الاستضافة لا يؤثر على البنية، بل على الإعدادات فقط.
- الأولوية الأولى: جعل الواجهة تبدو «عالمية» وبسيطة في نفس الوقت؛ لا نُضحّي بالوضوح مقابل الحركة.