import type { Locale } from "@/i18n/routing";

export type Localized<T = string> = { ar: T; en: T };

export function pickLocale<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.ar;
}

export type NavItem = {
  key: string;
  href: string;
};

export const navItems: NavItem[] = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "work", href: "/work" },
  { key: "team", href: "/team" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
];

export type SiteMeta = {
  name: Localized;
  legalName: Localized;
  tagline: Localized;
  shortTagline: Localized;
  logoUrl?: string;
  email: string;
  whatsapp: string;
  location: Localized;
  socials: { label: string; href: string }[];
};

export const site: SiteMeta = {
  name: { ar: "نكست سوفت", en: "Next Soft" },
  legalName: { ar: "نكست سوفت للتقنية", en: "Next Soft Technology" },
  tagline: {
    ar: "نبني منتجات رقمية تستحق الثقة",
    en: "Digital products worth trusting",
  },
  shortTagline: { ar: "استوديو رقمي", en: "Digital studio" },
  email: "hello@nextsoft.dev",
  whatsapp: "967716713514",
  location: { ar: "اليمن", en: "Yemen" },
  socials: [
    { label: "X", href: "https://x.com/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],
};

export type Service = {
  icon: "code" | "palette" | "rocket" | "search" | "shield" | "sparkles";
  title: Localized;
  description: Localized;
};

export const services: Service[] = [
  {
    icon: "code",
    title: { ar: "تطوير الويب", en: "Web development" },
    description: {
      ar: "تطبيقات ويب حديثة بـ Next.js وReact، بسرعة تحميل عالية وبنية قابلة للتوسع.",
      en: "Modern web apps with Next.js and React, fast to load and built to scale.",
    },
  },
  {
    icon: "palette",
    title: { ar: "تصميم الواجهات", en: "Product design" },
    description: {
      ar: "واجهات عربية أصلية RTL/LTR، نظام تصميم متكامل، وتجربة استخدام مدروسة.",
      en: "Native Arabic RTL/LTR interfaces, a complete design system and thoughtful UX.",
    },
  },
  {
    icon: "rocket",
    title: { ar: "المنتجات الرقمية", en: "Digital products" },
    description: {
      ar: "من الفكرة إلى الإطلاق: بناء نماذج أولية والمنتجات من الصفر حتى النشر والقياس.",
      en: "From idea to launch: building MVPs and products from zero to release and analytics.",
    },
  },
  {
    icon: "search",
    title: { ar: "تحسين محركات البحث", en: "SEO & performance" },
    description: {
      ar: "بنية تقنية سليمة، بيانات منظّمة، وسرعة تُقاس بالأرقام لا بالوعود.",
      en: "Sound technical structure, structured data and speed measured in numbers.",
    },
  },
  {
    icon: "shield",
    title: { ar: "الصيانة والدعم", en: "Care & support" },
    description: {
      ar: "متابعة مستمرة، مراقبة للأداء، وتحديثات دورية تُبقي منتجك في أفضل حال.",
      en: "Ongoing monitoring, performance checks and regular updates that keep your product healthy.",
    },
  },
  {
    icon: "sparkles",
    title: { ar: "الهوية والحركة", en: "Identity & motion" },
    description: {
      ar: "هوية بصرية هادئة وفاخرة، وحركة تخدم الوضوح لا تشتّته.",
      en: "A calm, premium visual identity and motion that serves clarity, not noise.",
    },
  },
];

export type Project = {
  slug: string;
  title: Localized;
  summary: Localized;
  category: Localized;
  year: string;
  client: Localized;
  role: Localized;
  duration: Localized;
  challenge: Localized;
  solution: Localized;
  results: { value: string; label: Localized }[];
  stack: string[];
  placeholder: boolean;
};

export const projects: Project[] = [
  {
    slug: "sample-saas-dashboard",
    title: { ar: "لوحة تحكم SaaS", en: "SaaS dashboard" },
    summary: {
      ar: "نموذج توضيحي لواجهة تحليلات متعددة اللغات مع دعم كامل للعربية.",
      en: "Placeholder analytics interface with full Arabic support.",
    },
    category: { ar: "منتج رقمي", en: "Digital product" },
    year: "2026",
    client: { ar: "شركة تقنية (نموذج توضيحي)", en: "Tech company (placeholder)" },
    role: { ar: "تصميم واجهة وتطوير أمامي", en: "Product design & front-end" },
    duration: { ar: "10 أسابيع", en: "10 weeks" },
    challenge: {
      ar: "لوحة تحليلات عربية بكثافة بيانات عالية يجب أن تبقى واضحة، مع RTL أصيل وأداء سريع.",
      en: "An Arabic analytics dashboard with high data density that must stay readable, with native RTL and fast performance.",
    },
    solution: {
      ar: "نظام تصميم موسّع، رسوم تفاعلية، ومعالجة بيانات على الخادم مع تصيير تدريجي.",
      en: "An expanded design system, interactive charts, server-side data handling and progressive rendering.",
    },
    results: [
      { value: "<1.2s", label: { ar: "زمن التفاعل", en: "Interaction time" } },
      { value: "100", label: { ar: "درجة الوصول", en: "Accessibility score" } },
      { value: "+34%", label: { ar: "سرعة إنجاز المهام", en: "Task speed" } },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    placeholder: true,
  },
  {
    slug: "sample-ecommerce",
    title: { ar: "متجر إلكتروني", en: "E-commerce" },
    summary: {
      ar: "نموذج توضيحي لتجربة شراء سريعة بواجهة عربية أصلية.",
      en: "Placeholder storefront experience with a native Arabic UI.",
    },
    category: { ar: "تجارة إلكترونية", en: "E-commerce" },
    year: "2026",
    client: { ar: "متجر إلكتروني (نموذج توضيحي)", en: "E-commerce storefront (placeholder)" },
    role: { ar: "تجربة شراء وبناء واجهة", en: "Checkout UX & storefront build" },
    duration: { ar: "12 أسبوعاً", en: "12 weeks" },
    challenge: {
      ar: "معدل تسرب مرتفع في خطوات الدفع بسبب واجهة غير مألوفة للجمهور العربي.",
      en: "High checkout abandonment caused by an unfamiliar flow for Arabic-speaking shoppers.",
    },
    solution: {
      ar: "تبسيط الخطوات، حقول ذكية، ودفع بعملتين مع ملخص دائم للسلة.",
      en: "Simplified steps, smart fields, dual-currency payment and a persistent cart summary.",
    },
    results: [
      { value: "-28%", label: { ar: "تسرب الدفع", en: "Checkout drop-off" } },
      { value: "+19%", label: { ar: "قيمة السلة", en: "Average order value" } },
      { value: "<1s", label: { ar: "LCP", en: "LCP" } },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Zod"],
    placeholder: true,
  },
  {
    slug: "sample-landing",
    title: { ar: "صفحة هبوط", en: "Landing page" },
    summary: {
      ar: "نموذج توضيحي لصفحة تعريفية تركز على التحويل وسرعة العرض.",
      en: "Placeholder landing page focused on conversion and load speed.",
    },
    category: { ar: "تسويق", en: "Marketing" },
    year: "2025",
    client: { ar: "شركة تسويق (نموذج توضيحي)", en: "Marketing agency (placeholder)" },
    role: { ar: "استراتيجية محتوى وتصميم", en: "Content strategy & design" },
    duration: { ar: "4 أسابيع", en: "4 weeks" },
    challenge: {
      ar: "صفحة هبوط بطيئة ومزدحمة لا توضّح العرض في الثواني الأولى.",
      en: "A slow, crowded landing page that fails to explain the offer in the first seconds.",
    },
    solution: {
      ar: "عنوان واضح، دليل موثّق، وبنية صفحة تركز على تحويل واحد.",
      en: "A clear headline, verified proof and a single-conversion page structure.",
    },
    results: [
      { value: "+41%", label: { ar: "معدل التحويل", en: "Conversion rate" } },
      { value: "0.0", label: { ar: "CLS", en: "CLS" } },
      { value: "98", label: { ar: "Lighthouse", en: "Lighthouse" } },
    ],
    stack: ["Next.js", "GSAP", "Vercel"],
    placeholder: true,
  },
  {
    slug: "sample-design-system",
    title: { ar: "نظام تصميم", en: "Design system" },
    summary: {
      ar: "نموذج توضيحي لمكتبة مكوّنات ثنائية اللغة بمعايير وصول AA.",
      en: "Placeholder bilingual component library meeting WCAG AA.",
    },
    category: { ar: "نظام تصميم", en: "Design system" },
    year: "2025",
    client: { ar: "منتج SaaS (نموذج توضيحي)", en: "SaaS product (placeholder)" },
    role: { ar: "نظام تصميم وتوثيق", en: "Design system & documentation" },
    duration: { ar: "8 أسابيع", en: "8 weeks" },
    challenge: {
      ar: "فرق متعددة وأنماط متكررة، دون معيار وصول موحّد أو توثيق مشترك.",
      en: "Multiple teams, repeated patterns and no shared accessibility baseline or documentation.",
    },
    solution: {
      ar: "مكتبة مكوّنات موثّقة، رموز تصميم، وإرشادات استخدام ثنائية اللغة.",
      en: "A documented component library, design tokens and bilingual usage guidelines.",
    },
    results: [
      { value: "42", label: { ar: "مكوّناً موحّداً", en: "Shared components" } },
      { value: "AA", label: { ar: "معيار الوصول", en: "Accessibility level" } },
      { value: "-60%", label: { ar: "وقت البناء", en: "Build time" } },
    ],
    stack: ["TypeScript", "Tailwind CSS", "React"],
    placeholder: true,
  },
];

export type Step = {
  number: string;
  title: Localized;
  description: Localized;
};

export const process: Step[] = [
  {
    number: "01",
    title: { ar: "الاكتشاف", en: "Discovery" },
    description: {
      ar: "نفهم جمهورك، أهدافك، وقيودك التقنية قبل كتابة أي سطر برمجي.",
      en: "We understand your audience, goals and technical constraints before writing code.",
    },
  },
  {
    number: "02",
    title: { ar: "التصميم", en: "Design" },
    description: {
      ar: "نحّول المتطلبات إلى شاشات قابلة للنقر ونظام تصميم موثّق.",
      en: "We turn requirements into clickable screens and a documented design system.",
    },
  },
  {
    number: "03",
    title: { ar: "البناء", en: "Build" },
    description: {
      ar: "تنفيذ تدريجي بمراجعات أسبوعية، واختبارات، وأداء مراقب.",
      en: "Incremental delivery with weekly reviews, tests and monitored performance.",
    },
  },
  {
    number: "04",
    title: { ar: "الإطلاق", en: "Launch" },
    description: {
      ar: "نشر، قياس، وتحسين مستمر بعد الإطلاق — لا نتوقف عند التسليم.",
      en: "Ship, measure and keep improving after launch — we don't stop at handover.",
    },
  },
];

export type Stat = {
  value: string;
  suffix?: string;
  label: Localized;
};

export const stats: Stat[] = [
  { value: "48", suffix: "+", label: { ar: "مشروع منجز", en: "Projects delivered" } },
  { value: "36", suffix: "+", label: { ar: "عميل سعيد", en: "Happy clients" } },
  { value: "7", suffix: "+", label: { ar: "سنوات خبرة", en: "Years of experience" } },
  { value: "92", suffix: "%", label: { ar: "نسبة استمرار العملاء", en: "Client retention" } },
];

export type TechGroupKey = "web" | "backend" | "mobile" | "database" | "tools";

export type TechGroup = {
  key: TechGroupKey;
  title: Localized;
  subtitle: Localized;
};

export const techGroups: TechGroup[] = [
  {
    key: "web",
    title: { ar: "الويب", en: "Web" },
    subtitle: {
      ar: "واجهات سريعة ومتاحة على كل الأجهزة.",
      en: "Fast, accessible interfaces on every device.",
    },
  },
  {
    key: "backend",
    title: { ar: "الخلفية", en: "Backend" },
    subtitle: {
      ar: "منطق أعمال وواجهات API آمنة.",
      en: "Business logic and secure APIs.",
    },
  },
  {
    key: "mobile",
    title: { ar: "الجوال", en: "Mobile" },
    subtitle: {
      ar: "تطبيق واحد لأندرويد وiOS.",
      en: "One app for Android and iOS.",
    },
  },
  {
    key: "database",
    title: { ar: "قواعد البيانات", en: "Databases" },
    subtitle: {
      ar: "تخزين موثوق واستعلامات سريعة.",
      en: "Reliable storage and fast queries.",
    },
  },
  {
    key: "tools",
    title: { ar: "الأدوات", en: "Tools" },
    subtitle: {
      ar: "نشر، مراقبة، وتعاون يومي.",
      en: "Shipping, monitoring and daily collaboration.",
    },
  },
];

export type Tech = {
  name: string;
  group: TechGroupKey;
  category: Localized;
  description: Localized;
  accent: "violet" | "mint" | "sky" | "amber";
};

export const techStack: Tech[] = [
  {
    name: "Next.js",
    group: "web",
    category: { ar: "إطار العمل", en: "Framework" },
    description: {
      ar: "تصيير على الخادم، مسارات ديناميكية، وSEO قوي.",
      en: "Server rendering, dynamic routes and strong SEO.",
    },
    accent: "violet",
  },
  {
    name: "React",
    group: "web",
    category: { ar: "المكتبة الأساسية", en: "Core library" },
    description: {
      ar: "مكوّنات قابلة لإعادة الاستخدام وواجهات تفاعلية.",
      en: "Reusable components and interactive interfaces.",
    },
    accent: "sky",
  },
  {
    name: "TypeScript",
    group: "web",
    category: { ar: "اللغة", en: "Language" },
    description: {
      ar: "أنواع صارمة تقلّل الأخطاء قبل الإطلاق.",
      en: "Strict types that catch bugs before launch.",
    },
    accent: "violet",
  },
  {
    name: "Tailwind CSS",
    group: "web",
    category: { ar: "التنسيق", en: "Styling" },
    description: {
      ar: "نظام تصميم متّسق وسريع بخصائص منطقية للاتجاهين.",
      en: "A consistent, fast styling system with logical properties for both directions.",
    },
    accent: "sky",
  },
  {
    name: "HTML5 & CSS3",
    group: "web",
    category: { ar: "الأساسيات", en: "Fundamentals" },
    description: {
      ar: "بنية دلالية وتنسيق متجاوب بخصائص منطقية.",
      en: "Semantic markup and responsive layout with logical properties.",
    },
    accent: "amber",
  },
  {
    name: "JavaScript",
    group: "web",
    category: { ar: "اللغة", en: "Language" },
    description: {
      ar: "تفاعل المتصفح وأساس كل إطار حديث.",
      en: "Browser interactivity and the base of every modern framework.",
    },
    accent: "amber",
  },
  {
    name: "Laravel",
    group: "backend",
    category: { ar: "إطار PHP", en: "PHP framework" },
    description: {
      ar: "تطبيقات ويب كاملة بتسليم أسرع وتكلفة أقل.",
      en: "Complete web apps with faster delivery and a lower cost.",
    },
    accent: "violet",
  },
  {
    name: "Livewire",
    group: "backend",
    category: { ar: "مكوّنات ديناميكية", en: "Dynamic components" },
    description: {
      ar: "تفاعل كامل بواجهة Laravel دون أعباء JavaScript.",
      en: "Full interactivity with Laravel and without heavy JavaScript.",
    },
    accent: "sky",
  },
  {
    name: "ASP.NET Core",
    group: "backend",
    category: { ar: "إطار .NET", en: ".NET framework" },
    description: {
      ar: "واجهات API عالية الأداء وقابلة للتوسع.",
      en: "High-performance APIs that scale with the product.",
    },
    accent: "violet",
  },
  {
    name: "Node.js",
    group: "backend",
    category: { ar: "الخادم", en: "Runtime" },
    description: {
      ar: "واجهات API خفيفة وخطوات عمل على الخادم.",
      en: "Lightweight APIs and server-side workflows.",
    },
    accent: "mint",
  },
  {
    name: "PHP",
    group: "backend",
    category: { ar: "اللغة", en: "Language" },
    description: {
      ar: "منطق الأعمال ونماذج البيانات.",
      en: "Business logic and data models.",
    },
    accent: "amber",
  },
  {
    name: "C#",
    group: "backend",
    category: { ar: "اللغة", en: "Language" },
    description: {
      ar: "خدمات خلفية وأدوات داخلية موثوقة.",
      en: "Reliable backend services and internal tooling.",
    },
    accent: "amber",
  },
  {
    name: "REST & GraphQL",
    group: "backend",
    category: { ar: "تصميم APIs", en: "API design" },
    description: {
      ar: "عقود واضحة بين الواجهة والخادم.",
      en: "Clear contracts between the client and the server.",
    },
    accent: "mint",
  },
  {
    name: "Flutter",
    group: "mobile",
    category: { ar: "تطبيقات الجوال", en: "Mobile apps" },
    description: {
      ar: "تطبيق واحد لأندرويد وiOS بأداء عالٍ.",
      en: "One app for Android and iOS with high performance.",
    },
    accent: "sky",
  },
  {
    name: "MySQL",
    group: "database",
    category: { ar: "علائقية", en: "Relational" },
    description: {
      ar: "بيانات مترابطة واستعلامات فعّالة.",
      en: "Relational data and efficient queries.",
    },
    accent: "amber",
  },
  {
    name: "PostgreSQL",
    group: "database",
    category: { ar: "علائقية متقدمة", en: "Advanced relational" },
    description: {
      ar: "JSON، فهارس، وامتدادات قوية.",
      en: "JSON, indexing and powerful extensions.",
    },
    accent: "sky",
  },
  {
    name: "SQL Server",
    group: "database",
    category: { ar: "علائقية", en: "Relational" },
    description: {
      ar: "تكامل مع .NET وتقارير الأعمال.",
      en: "Tight .NET integration and business reporting.",
    },
    accent: "violet",
  },
  {
    name: "MongoDB",
    group: "database",
    category: { ar: "وثائقية", en: "Document" },
    description: {
      ar: "مخطط مرن لبيانات سريعة التغير.",
      en: "A flexible schema for fast-changing data.",
    },
    accent: "mint",
  },
  {
    name: "Firebase",
    group: "database",
    category: { ar: "خدمات سحابية", en: "BaaS" },
    description: {
      ar: "مصادقة وقاعدة بيانات فورية.",
      en: "Authentication and a realtime database.",
    },
    accent: "amber",
  },
  {
    name: "Redis",
    group: "database",
    category: { ar: "تخزين مؤقت", en: "Caching" },
    description: {
      ar: "جلسات ونتائج سريعة بين الطبقات.",
      en: "Fast sessions and cached results across layers.",
    },
    accent: "mint",
  },
  {
    name: "Docker",
    group: "tools",
    category: { ar: "حاويات", en: "Containers" },
    description: {
      ar: "بيئات متطابقة من التطوير إلى الإنتاج.",
      en: "Identical environments from development to production.",
    },
    accent: "sky",
  },
  {
    name: "Git & GitHub",
    group: "tools",
    category: { ar: "إصدارات", en: "Version control" },
    description: {
      ar: "سجل واضح لكل تغيير ومراجعة كود.",
      en: "A clear history for every change and code review.",
    },
    accent: "amber",
  },
  {
    name: "Linux",
    group: "tools",
    category: { ar: "أنظمة التشغيل", en: "Operating systems" },
    description: {
      ar: "خوادم مستقرة ونشر آمن.",
      en: "Stable servers and secure deployment.",
    },
    accent: "violet",
  },
  {
    name: "AWS",
    group: "tools",
    category: { ar: "السحابة", en: "Cloud" },
    description: {
      ar: "استضافة وقواعد بيانات ومراقبة.",
      en: "Hosting, databases and monitoring.",
    },
    accent: "amber",
  },
  {
    name: "Figma",
    group: "tools",
    category: { ar: "التصميم", en: "Design" },
    description: {
      ar: "نماذج أولية وتسليم تصميم منظم.",
      en: "Prototypes and a structured design handoff.",
    },
    accent: "violet",
  },
  {
    name: "Built-in Studio",
    group: "tools",
    category: { ar: "إدارة المحتوى", en: "CMS" },
    description: {
      ar: "لوحة تحكم مدمجة للمحتوى ثنائي اللغة مع نشر فوري.",
      en: "Built-in bilingual content studio with instant publishing.",
    },
    accent: "amber",
  },
  {
    name: "GSAP",
    group: "tools",
    category: { ar: "الحركة", en: "Motion" },
    description: {
      ar: "حركات تخدم الوضوح وتحترم تقليل الحركة.",
      en: "Motion that serves clarity and respects reduced motion.",
    },
    accent: "violet",
  },
  {
    name: "Vercel",
    group: "tools",
    category: { ar: "النشر", en: "Hosting" },
    description: {
      ar: "نشر مستمر، شبكة CDN عالمية، ومعاينة لكل تعديل.",
      en: "Continuous deployment, a global CDN and a preview for every change.",
    },
    accent: "mint",
  },
  {
    name: "Python & FastAPI",
    group: "backend",
    category: { ar: "API والذكاء الاصطناعي", en: "API & AI" },
    description: {
      ar: "خدمات خلفية عالية السرعة وتكاملات معالجة البيانات والذكاء الاصطناعي.",
      en: "High-speed backend services, data pipelines and AI integrations.",
    },
    accent: "mint",
  },
  {
    name: "React Native & Expo",
    group: "mobile",
    category: { ar: "تطبيقات الجوال", en: "Mobile apps" },
    description: {
      ar: "تطبيقات جوال تشاركية بقاعدة كود موحّدة مع React وTypeScript.",
      en: "Cross-platform mobile apps sharing patterns with React and TypeScript.",
    },
    accent: "violet",
  },
  {
    name: "Supabase",
    group: "database",
    category: { ar: "PostgreSQL سحابي", en: "Managed Postgres" },
    description: {
      ar: "قاعدة بيانات PostgreSQL ومصادقة وتخزين ملفات في منصة واحدة.",
      en: "PostgreSQL database, auth and file storage in one unified platform.",
    },
    accent: "mint",
  },
  {
    name: "Prisma & Drizzle",
    group: "database",
    category: { ar: "إدارة البيانات", en: "Type-safe ORM" },
    description: {
      ar: "استعلامات محمية بالأنواع وترحيل آمن لمخططات قواعد البيانات.",
      en: "Type-safe database queries and predictable schema migrations.",
    },
    accent: "violet",
  },
  {
    name: "Cloudflare",
    group: "tools",
    category: { ar: "الشبكة والحماية", en: "Edge & WAF" },
    description: {
      ar: "توزيع عالمي، حماية من الهجمات، ووظائف حافة منخفضة الكمون.",
      en: "Global edge caching, DDoS protection and low-latency edge workers.",
    },
    accent: "amber",
  },
  {
    name: "GitHub Actions",
    group: "tools",
    category: { ar: "التكامل المستمر", en: "CI/CD" },
    description: {
      ar: "فحص تلقائي للأنواع والاختبارات وبناء ونشر موثوق مع كل تحديث.",
      en: "Automated type-checking, tests and reliable deployments on every push.",
    },
    accent: "sky",
  },
  {
    name: "Playwright & Vitest",
    group: "tools",
    category: { ar: "الاختبارات الآلية", en: "Testing" },
    description: {
      ar: "اختبارات وحدة وتكامل ومسارات مستخدم كاملة قبل وصول أي تعديل للإنتاج.",
      en: "Unit, integration and end-to-end browser verification before release.",
    },
    accent: "mint",
  },
  {
    name: "Sentry",
    group: "tools",
    category: { ar: "مراقبة الأخطاء", en: "Observability" },
    description: {
      ar: "تتبّع فوري للأخطاء وقياس الأداء في متصفح المستخدم والخادم.",
      en: "Real-time error tracking and performance tracing across client and server.",
    },
    accent: "violet",
  },
  {
    name: "Gemini & AI SDKs",
    group: "tools",
    category: { ar: "تكامل الذكاء الاصطناعي", en: "AI integration" },
    description: {
      ar: "مساعدات ذكية، بحث دلالي، وأتمتة عملية مدمجة داخل منتجات الويب.",
      en: "Practical assistants, semantic search and workflow automation inside web apps.",
    },
    accent: "sky",
  },
];

export type Value = {
  icon: "sparkles" | "shield" | "target" | "handshake";
  title: Localized;
  description: Localized;
};

export const values: Value[] = [
  {
    icon: "target",
    title: { ar: "وضوح قبل كل شيء", en: "Clarity first" },
    description: {
      ar: "نشرح كل قرار تقني وتصميمي بلغة يفهمها العميل، ونوثّق كل شيء.",
      en: "We explain every technical and design decision in plain language and document everything.",
    },
  },
  {
    icon: "sparkles",
    title: { ar: "جودة تُقاس", en: "Measurable quality" },
    description: {
      ar: "سرعة، وصول، وأداء — أرقام حقيقية بدل الوعود التسويقية.",
      en: "Speed, accessibility and performance — real numbers instead of marketing promises.",
    },
  },
  {
    icon: "shield",
    title: { ar: "التزام بالمواعيد", en: "Deadline discipline" },
    description: {
      ar: "تسليمات أسبوعية واضحة، وشفافية كاملة في التقدّم والمخاطر.",
      en: "Clear weekly deliveries with full transparency on progress and risks.",
    },
  },
  {
    icon: "handshake",
    title: { ar: "شراكة طويلة", en: "Long-term partnership" },
    description: {
      ar: "لا نختفي بعد التسليم؛ نبقى معك في التطوير والتحسين المستمر.",
      en: "We don't disappear after handover; we stay for iteration and continuous improvement.",
    },
  },
];

export const aboutMission: Localized = {
  ar: "نكست سوفت فريق هندسي عربي يبني منتجات رقمية تجمع بين الدقة التقنية والذوق التصميمي. نؤمن أن أفضل المنتجات تُولد من فهم عميق للمستخدم، ومن فريق يهتم بالتفاصيل الصغيرة كما يهتم بالصورة الكبيرة.",
  en: "Next Soft is an Arabic-first engineering team building digital products that pair technical precision with design taste. We believe the best products come from a deep understanding of the user and a team that cares about small details as much as the big picture.",
};

export const aboutSecondary: Localized = {
  ar: "نعمل مع العملاء في كل المراحل: من اكتشاف الفكرة، إلى التصميم، إلى البناء، إلى الإطلاق والتحسين. منهجنا واضح، وتواصلنا مباشر، وهدفنا واحد: منتج يعمل بسرعة، ويبدو رائعاً، ويستحق الثقة.",
  en: "We partner with clients across every stage: discovery, design, build, launch and iteration. Our process is clear, our communication is direct, and our goal is singular: a product that is fast, looks great and earns trust.",
};

export type Faq = {
  q: Localized;
  a: Localized;
};

export const faqs: Faq[] = [
  {
    q: {
      ar: "كم يستغرق تنفيذ المشروع؟",
      en: "How long does a project take?",
    },
    a: {
      ar: "الموقع التعريفي النموذجي يستغرق من ٣ إلى ٥ أسابيع، والمنتجات الأكبر تُقسّم إلى مراحل واضحة مع تسليم أسبوعي.",
      en: "A typical marketing site takes 3–5 weeks; larger products are split into clear phases with weekly deliveries.",
    },
  },
  {
    q: {
      ar: "هل تدعمون اللغة العربية بالكامل؟",
      en: "Do you fully support Arabic?",
    },
    a: {
      ar: "نعم. نبني الواجهات بمنطق RTL/LTR صحيح، وخطوط عربية مناسبة، وبدون تباعد أحرف يفسد التشكيل.",
      en: "Yes. We build with correct RTL/LTR logic, suitable Arabic typography and no letter-spacing that breaks Arabic script.",
    },
  },
  {
    q: {
      ar: "هل يمكنني تعديل المحتوى بنفسي؟",
      en: "Can I edit the content myself?",
    },
    a: {
      ar: "نعم، عبر لوحة التحكم المدمجة بواجهة عربية وإنجليزية، مع صلاحيات محددة للمسؤولين.",
      en: "Yes, through the built-in Studio with an Arabic/English UI and admin permissions.",
    },
  },
  {
    q: {
      ar: "ماذا يحدث بعد التسليم؟",
      en: "What happens after handover?",
    },
    a: {
      ar: "نقدّم فترة دعم ومراقبة أداء، مع إمكانية عقد صيانة شهري لتحديثات وتحسينات مستمرة.",
      en: "We include a support window and performance monitoring, with an optional monthly care plan for updates and improvements.",
    },
  },
  {
    q: {
      ar: "هل أحصل على ملكية الكود المصدري بالكامل؟",
      en: "Do I get full ownership of the source code?",
    },
    a: {
      ar: "نعم. عند إتمام التسليم تُنقل ملكية المستودع البرمجي والتصميمات وجميع الأصول بالكامل إلى حسابك دون قيود احتكارية.",
      en: "Yes. Upon handover, the repository, design files and all project assets transfer completely to your accounts with zero lock-in.",
    },
  },
  {
    q: {
      ar: "هل يمكنكم دمج مزايا ذكاء اصطناعي أو ربط أنظمة قائمة؟",
      en: "Can you integrate AI features or connect existing systems?",
    },
    a: {
      ar: "نعم. نبني تكاملات API مع أنظمة المحاسبة والدفع وCRM، ونضيف قدرات بحث ذكي وأتمتة مخصّصة حسب حاجة المنتج.",
      en: "Yes. We integrate payment, CRM and ERP APIs, and build tailored semantic search, automation and AI workflows around your product.",
    },
  },
];

export type LegalSection = {
  heading: Localized;
  body: Localized;
};

export type LegalPage = {
  updated: string;
  notice: Localized;
  intro: Localized;
  sections: LegalSection[];
};

export const legalContent: { privacy: LegalPage; terms: LegalPage } = {
  privacy: {
    updated: "2026-11-12",
    notice: {
      ar: "هذه مسودة توضيحية وليست نصاً قانونياً نهائياً. تُراجع من مختص قانوني قبل النشر.",
      en: "This is illustrative draft text, not final legal advice. Review with legal counsel before publishing.",
    },
    intro: {
      ar: "نحترم خصوصيتك. توضح هذه الصفحة ما نجمعه، ولماذا، وكيف تتحكم فيه.",
      en: "We respect your privacy. This page explains what we collect, why we collect it, and how you stay in control.",
    },
    sections: [
      {
        heading: { ar: "ما نجمعه", en: "What we collect" },
        body: {
          ar: "بيانات النموذج التي ترسلها طوعاً: الاسم، البريد، اسم الشركة، ونص الرسالة. لا نجمع بيانات دفع.",
          en: "Form data you submit voluntarily: name, email, company and message. We do not collect payment data.",
        },
      },
      {
        heading: { ar: "كيف نستخدمها", en: "How we use it" },
        body: {
          ar: "نستخدمها للرد على استفسارك، وتحضير عرض، وتحسين جودة الموقع. لا نبيع بياناتك لأي طرف.",
          en: "We use it to reply to your inquiry, prepare a proposal and improve the site. We never sell your data.",
        },
      },
      {
        heading: { ar: "ملفات الارتباط", en: "Cookies" },
        body: {
          ar: "نستخدم تخزيناً محلياً بسيطاً لتذكّر الوضع الفاتح/الداكن فقط. لا نستخدم ملفات تتبع إعلانية.",
          en: "We use simple local storage to remember light/dark mode only. No advertising trackers.",
        },
      },
      {
        heading: { ar: "حقوقك", en: "Your rights" },
        body: {
          ar: "يمكنك طلب نسخة من بياناتك، أو تصحيحها، أو حذفها عبر مراسلتنا على البريد المذكور أدناه.",
          en: "You can request a copy, correction or deletion of your data by emailing the address below.",
        },
      },
    ],
  },
  terms: {
    updated: "2026-11-12",
    notice: {
      ar: "هذه مسودة توضيحية وليست نصاً قانونياً نهائياً. تُراجع من مختص قانوني قبل النشر.",
      en: "This is illustrative draft text, not final legal advice. Review with legal counsel before publishing.",
    },
    intro: {
      ar: "باستخدامك هذا الموقع فإنك توافق على الشروط التالية. نكتبها بلغة واضحة قدر الإمكان.",
      en: "By using this site you agree to the terms below, written as plainly as possible.",
    },
    sections: [
      {
        heading: { ar: "ملكية المحتوى", en: "Content ownership" },
        body: {
          ar: "كل النصوص والتصاميم والأكواد المعروضة مملوكة للفريق ما لم يُذكر خلاف ذلك، ولا يجوز نسخها تجارياً دون إذن.",
          en: "All copy, designs and code shown belong to the team unless stated otherwise, and may not be copied commercially without permission.",
        },
      },
      {
        heading: { ar: "دقة المعلومات", en: "Accuracy" },
        body: {
          ar: "نبذل جهداً معقولاً للحفاظ على دقة المحتوى، لكن بعض البيانات قد تتغير دون إشعار مسبق.",
          en: "We make reasonable efforts to keep content accurate, though some data may change without prior notice.",
        },
      },
      {
        heading: { ar: "روابط خارجية", en: "External links" },
        body: {
          ar: "قد نربط بمواقع أخرى؛ لا نتحكم في محتواها ولا نتحمل مسؤولية ممارسات الخصوصية فيها.",
          en: "We may link to other sites; we do not control their content or privacy practices.",
        },
      },
      {
        heading: { ar: "حدود المسؤولية", en: "Limitation of liability" },
        body: {
          ar: "الموقع مقدَّم كما هو لأغراض تعريفية، ولا يُعد ضماناً لخدمات مستقبلية حتى توقيع اتفاقية واضحة.",
          en: "The site is provided as-is for informational purposes and is not a guarantee of future services until a clear agreement is signed.",
        },
      },
    ],
  },
};

export type Member = {
  slug: string;
  initials: string;
  name?: Localized;
  avatar?: string;
  role: Localized;
  focus: Localized;
  responsibilities: Localized[];
  stack: string[];
  placeholder: boolean;
};

export const TEAM_AVATAR_BY_SLUG: Record<string, string> = {
  "front-end": "/images/team/front-end.jpg",
  "product-design": "/images/team/product-design.jpg",
  "back-end": "/images/team/back-end.jpg",
  quality: "/images/team/quality.jpg",
  "mobile-engineering": "/images/team/mobile-engineering.jpg",
  "devops-cloud": "/images/team/devops-cloud.jpg",
  "ai-automation": "/images/team/ai-automation.jpg",
  architecture: "/images/team/architecture.jpg",
};

export function resolveMemberAvatar(slug: string, avatar?: string | null): string | undefined {
  const cleaned = typeof avatar === "string" ? avatar.trim() : "";
  if (
    cleaned.startsWith("/") ||
    cleaned.startsWith("data:image/") ||
    cleaned.startsWith("https://")
  ) {
    return cleaned;
  }
  return TEAM_AVATAR_BY_SLUG[slug];
}

export const team: Member[] = [
  {
    slug: "front-end",
    initials: "MA",
    name: { ar: "محمد العتيبي", en: "Mohammed Al-Otaibi" },
    avatar: "/images/team/front-end.jpg",
    role: { ar: "مطور ويب — واجهات أمامية", en: "Full-Stack Web Developer" },
    focus: {
      ar: "Next.js وReact وأداء الواجهات وسرعة التفاعل.",
      en: "Next.js, React, interface performance and interaction speed.",
    },
    responsibilities: [
      {
        ar: "بناء واجهات سريعة ومتاحة على كل المقاسات.",
        en: "Building fast, accessible interfaces at every breakpoint.",
      },
      {
        ar: "قياس الأداء ومعالجة أي تجاوز في الميزانية.",
        en: "Measuring performance and fixing any budget overrun.",
      },
      {
        ar: "مراجعة الكود وضبط أنماط المكوّنات.",
        en: "Reviewing code and keeping component patterns consistent.",
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP"],
    placeholder: true,
  },
  {
    slug: "product-design",
    initials: "SD",
    name: { ar: "سارة الدوسري", en: "Sara Al-Dosari" },
    avatar: "/images/team/product-design.jpg",
    role: { ar: "مصممة منتجات وواجهات UX/UI", en: "Product & UX/UI Designer" },
    focus: {
      ar: "أنظمة تصميم، تجربة استخدام عربية، ونماذج أولية قابلة للنقر.",
      en: "Design systems, Arabic UX and clickable prototypes.",
    },
    responsibilities: [
      {
        ar: "تحويل المتطلبات إلى شاشات ونظام تصميم موثّق.",
        en: "Turning requirements into screens and a documented design system.",
      },
      {
        ar: "ضبط الطباعة العربية والاتجاهين RTL/LTR.",
        en: "Tuning Arabic typography and RTL/LTR layouts.",
      },
      {
        ar: "اختبار قابلية الاستخدام مع مستخدمين حقيقيين.",
        en: "Running usability tests with real users.",
      },
    ],
    stack: ["Figma", "Design tokens", "Accessibility", "Prototyping"],
    placeholder: true,
  },
  {
    slug: "back-end",
    initials: "KH",
    name: { ar: "خالد الحربي", en: "Khaled Al-Harbi" },
    avatar: "/images/team/back-end.jpg",
    role: { ar: "مهندس خدمات خلفية وقواعد بيانات", en: "Back-end & API Engineer" },
    focus: {
      ar: "واجهات API، قواعد بيانات، وسلامة البيانات والصلاحيات.",
      en: "APIs, databases and data integrity and permissions.",
    },
    responsibilities: [
      {
        ar: "تصميم APIs واضحة وموثّقة وآمنة.",
        en: "Designing clear, documented and secure APIs.",
      },
      {
        ar: "نمذجة البيانات وكتابة استعلامات فعّالة.",
        en: "Modelling data and writing efficient queries.",
      },
      {
        ar: "ضبط النسخ الاحتياطي والمراقبة.",
        en: "Configuring backups and monitoring.",
      },
    ],
    stack: ["Laravel", "ASP.NET Core", "Node.js", "MySQL", "PostgreSQL", "Redis"],
    placeholder: true,
  },
  {
    slug: "quality",
    initials: "NQ",
    name: { ar: "نورة القحطاني", en: "Noura Al-Qahtani" },
    avatar: "/images/team/quality.jpg",
    role: { ar: "مهندسة جودة ووصول رقمي QA", en: "QA & Accessibility Lead" },
    focus: {
      ar: "اختبارات آلية، معايير WCAG، ومراقبة الأداء بعد الإطلاق.",
      en: "Automated tests, WCAG standards and post-launch monitoring.",
    },
    responsibilities: [
      {
        ar: "تغطية المسارات الحرجة باختبارات آلية.",
        en: "Covering critical paths with automated tests.",
      },
      {
        ar: "مراجعة الوصول بلوحة مفاتيح وقارئ شاشة.",
        en: "Auditing accessibility with a keyboard and screen reader.",
      },
      {
        ar: "متابعة السجلات والأخطاء بعد الإطلاق.",
        en: "Watching logs and errors after launch.",
      },
    ],
    stack: ["Vitest", "Playwright", "Axe", "Lighthouse"],
    placeholder: true,
  },
  {
    slug: "mobile-engineering",
    initials: "OZ",
    name: { ar: "عمر الزهراني", en: "Omar Al-Zahrani" },
    avatar: "/images/team/mobile-engineering.jpg",
    role: { ar: "مطور تطبيقات الجوال iOS/Android", en: "Mobile App Developer" },
    focus: {
      ar: "تطبيقات iOS وAndroid بسلاسة عالية وتكامل كامل مع الخادم والإشعارات.",
      en: "Smooth iOS and Android apps with seamless API sync and push workflows.",
    },
    responsibilities: [
      {
        ar: "بناء تطبيقات عالية الاستجابة بـ Flutter أو React Native.",
        en: "Building responsive mobile apps using Flutter or React Native.",
      },
      {
        ar: "دعم العمل دون اتصال ومزامنة البيانات الحساسة بأمان.",
        en: "Supporting offline-first states and secure background sync.",
      },
      {
        ar: "إعداد النشر على متجري App Store وGoogle Play.",
        en: "Managing release pipelines for App Store and Google Play.",
      },
    ],
    stack: ["Flutter", "React Native & Expo", "Firebase", "TypeScript"],
    placeholder: true,
  },
  {
    slug: "devops-cloud",
    initials: "RS",
    name: { ar: "ريم الشهري", en: "Reem Al-Shehri" },
    avatar: "/images/team/devops-cloud.jpg",
    role: { ar: "مهندسة سحابة وتشغيل DevOps", en: "DevOps & Cloud Engineer" },
    focus: {
      ar: "أتمتة النشر، الحماية السحابية، ومراقبة الاستقرار والأداء على مدار الساعة.",
      en: "Deployment automation, edge security and continuous uptime observability.",
    },
    responsibilities: [
      {
        ar: "تصميم خطوط CI/CD للفحص التلقائي والنشر دون توقف.",
        en: "Building zero-downtime CI/CD test and release pipelines.",
      },
      {
        ar: "إعداد الحاويات والخوادم وشبكات CDN وجدران الحماية.",
        en: "Configuring containers, cloud servers, CDNs and WAF rules.",
      },
      {
        ar: "تطبيق استراتيجيات النسخ الاحتياطي وتنبيهات الأخطاء الفورية.",
        en: "Enforcing automated backups and real-time error alerting.",
      },
    ],
    stack: ["Docker", "AWS", "Cloudflare", "GitHub Actions", "Linux", "Sentry"],
    placeholder: true,
  },
  {
    slug: "ai-automation",
    initials: "YM",
    name: { ar: "يوسف المطيري", en: "Youssef Al-Mutairi" },
    avatar: "/images/team/ai-automation.jpg",
    role: { ar: "مهندس ذكاء اصطناعي وأتمتة", en: "AI & Automation Engineer" },
    focus: {
      ar: "دمج النماذج الذكية، البحث الدلالي، وأتمتة المهام التشغيلية داخل المنتجات.",
      en: "Embedding practical AI workflows, semantic search and operational automation.",
    },
    responsibilities: [
      {
        ar: "بناء مساعدات متخصصة مرتبطة ببيانات المشروع بصلاحيات آمنة.",
        en: "Building domain-aware assistants connected securely to product data.",
      },
      {
        ar: "تحسين تكاليف الاستدلال وزمن الاستجابة عبر البث المباشر.",
        en: "Optimizing model latency and token budgets with streaming UX.",
      },
      {
        ar: "أتمتة تصنيف الطلبات، الفواتير، والتقارير الدورية.",
        en: "Automating triage, document extraction and recurring reporting.",
      },
    ],
    stack: ["Gemini & AI SDKs", "Python & FastAPI", "PostgreSQL", "Node.js"],
    placeholder: true,
  },
  {
    slug: "architecture",
    initials: "AG",
    name: { ar: "عبدالله الغامدي", en: "Abdullah Al-Ghamdi" },
    avatar: "/images/team/architecture.jpg",
    role: { ar: "قائد تقني ومعماري أنظمة", en: "Tech Lead & Systems Architect" },
    focus: {
      ar: "تخطيط البنية القابلة للتوسع، اختيار التقنيات الأنسب، وضمان تسليم أسبوعي منضبط.",
      en: "Scalable system architecture, pragmatic stack choices and weekly delivery cadence.",
    },
    responsibilities: [
      {
        ar: "تحويل أهداف العمل إلى خارطة طريق ومعمارية بيانات واضحة.",
        en: "Translating business goals into clear roadmaps and data schemas.",
      },
      {
        ar: "مراجعة القرارات الحرجة في الأمان، التوسع، وتكلفة التشغيل.",
        en: "Reviewing critical security, scalability and infrastructure decisions.",
      },
      {
        ar: "توحيد التواصل بين العميل وفريق التصميم والتنفيذ.",
        en: "Aligning stakeholders, design and engineering every sprint.",
      },
    ],
    stack: ["Next.js", "PostgreSQL", "Firebase", "REST & GraphQL", "Docker"],
    placeholder: true,
  },
];

export type Post = {
  slug: string;
  title: Localized;
  excerpt: Localized;
  tag: Localized;
  date: string;
  readingMinutes: number;
  body: Localized[];
  placeholder: boolean;
};

export const posts: Post[] = [
  {
    slug: "arabic-typography",
    title: { ar: "لماذا نفشل في الخط العربي على الويب", en: "Why Arabic web type fails" },
    excerpt: {
      ar: "تباعد الأحرف، ارتفاع السطر، ووزن الخط: ثلاثة أخطاء صغيرة تُفسد تجربة القراءة العربية.",
      en: "Letter-spacing, line-height and weight: three small mistakes that ruin Arabic reading.",
    },
    tag: { ar: "تصميم", en: "Design" },
    date: "2026-10-28",
    readingMinutes: 5,
    body: [
      {
        ar: "أكثر ما يفسد تجربة القراءة العربية على الويب ليس الخط نفسه، بل الطريقة التي نستخدمه بها. تباعد الأحرف (letter-spacing) يكسر اتصال الحروف ويشوّه الكلمات، وارتفاع السطر الضيق يجعل العين تفقد موضعها بين السطور.",
        en: "What ruins Arabic reading on the web is rarely the typeface itself, but how we use it. Letter-spacing breaks connected script and distorts words, while tight line-height makes the eye lose its place between lines.",
      },
      {
        ar: "القاعدة العملية: لا تستخدم letter-spacing مع العربية أبداً، واضبط ارتفاع السطر بين 1.8 و1.9 للنصوص الطويلة، واختر خطاً يحتوي أوزاناً متعددة بدل الاعتماد على التصعيب الصناعي.",
        en: "Practical rule: never apply letter-spacing to Arabic, set line-height between 1.8 and 1.9 for long copy, and pick a family with real weights instead of synthetic bolding.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "rtl-css",
    title: { ar: "RTL ليس قلب الاتجاهات", en: "RTL is not flipping directions" },
    excerpt: {
      ar: "الخصائص المنطقية في CSS تحلّ 80% من مشاكل الاتجاهين، والباقي يحتاج قرارات تصميم.",
      en: "CSS logical properties solve 80% of bidirectional issues; the rest needs design decisions.",
    },
    tag: { ar: "تطوير", en: "Engineering" },
    date: "2026-10-12",
    readingMinutes: 6,
    body: [
      {
        ar: "عند بناء واجهات ثنائية اللغة، أسرع طريقة لكسر التصميم هي استخدام left/right في كل مكان. الخصائص المنطقية مثل margin-inline-start وpadding-inline-end تتبع اتجاه المستند تلقائياً.",
        en: "When building bilingual interfaces, the fastest way to break a layout is to use left/right everywhere. Logical properties like margin-inline-start and padding-inline-end follow document direction automatically.",
      },
      {
        ar: "لكن بعض العناصر لا تُقلب: الشعارات، أرقام الهواتف، روابط URL، وعينات الكود. اجعلها LTR دائماً، واعكس فقط الأيقونات الاتجاهية مثل الأسهم.",
        en: "But some elements must not flip: logos, phone numbers, URLs and code samples. Keep them LTR and mirror only directional icons such as arrows.",
      },
    ],
    placeholder: true,
  },
  {
    slug: "performance-budget",
    title: { ar: "ميزانية أداء قبل التصميم", en: "A performance budget before design" },
    excerpt: {
      ar: "تحديد سقف لحجم JavaScript وزمن LCP في بداية المشروع يمنع التنازلات في نهايته.",
      en: "Setting a JavaScript and LCP ceiling at the start prevents compromises at the end.",
    },
    tag: { ar: "أداء", en: "Performance" },
    date: "2026-09-30",
    readingMinutes: 4,
    body: [
      {
        ar: "الأداء ليس مهمة تحسين في نهاية المشروع، بل قيد تصميمي في بدايته. نحدد سقفاً لحجم الحزمة الأولية وزمن LCP، ونرفض أي مكوّن يتجاوز الميزانية دون مقابل واضح.",
        en: "Performance is not a late-stage cleanup, it is a design constraint from day one. We set a ceiling for the initial bundle and LCP, and reject any component that exceeds the budget without a clear trade-off.",
      },
      {
        ar: "النتيجة: صفحات أسرع، ومعدل ارتداد أقل، وتجربة عربية سلسة على الأجهزة المتوسطة التي يستخدمها معظم الزوار.",
        en: "The result: faster pages, lower bounce rates and a smooth Arabic experience on the mid-range devices most visitors actually use.",
      },
    ],
    placeholder: true,
  },
];

export type Sector = {
  icon: "cart" | "cpu" | "book" | "heart" | "bank" | "truck" | "building" | "plane";
  label: Localized;
};

export const sectors: Sector[] = [
  { icon: "cart", label: { ar: "التجزئة الإلكترونية", en: "E-commerce" } },
  { icon: "cpu", label: { ar: "التقنية والبرمجيات", en: "Technology" } },
  { icon: "book", label: { ar: "التعليم والتدريب", en: "Education" } },
  { icon: "heart", label: { ar: "الصحة واللياقة", en: "Health" } },
  { icon: "bank", label: { ar: "المالية والمدفوعات", en: "Finance" } },
  { icon: "truck", label: { ar: "اللوجستيات والنقل", en: "Logistics" } },
  { icon: "building", label: { ar: "العقارات", en: "Real estate" } },
  { icon: "plane", label: { ar: "السفر والضيافة", en: "Travel" } },
];

export type Testimonial = {
  quote: Localized;
  role: Localized;
  initials: string;
  placeholder: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote: {
      ar: "أوضحوا لنا أين نخسر التحويل، وأعادوا بناء الصفحات خطوة بخطوة. النتيجة كانت أسرع مما توقعنا.",
      en: "They showed us exactly where we were losing conversion and rebuilt the pages step by step. The result came faster than we expected.",
    },
    role: { ar: "مدير منتج — قطاع تقني", en: "Product manager — technology" },
    initials: "PM",
    placeholder: true,
  },
  {
    quote: {
      ar: "التزام واضح بالمواعيد، وتواصل مباشر بدون مصطلحات معقدة. شعرنا أننا نعمل مع فريق واحد لا مع مورّد.",
      en: "Clear deadlines and direct communication without jargon. It felt like one team, not a vendor.",
    },
    role: { ar: "مؤسس شركة ناشئة", en: "Startup founder" },
    initials: "SF",
    placeholder: true,
  },
  {
    quote: {
      ar: "الواجهة العربية كانت أولوية، ولم تُعامل كترجمة لاحقة. هذا وحده وفّر علينا أسابيع من المراجعة.",
      en: "The Arabic interface was a first-class priority, not an afterthought. That alone saved us weeks of review.",
    },
    role: { ar: "مدير تسويق — قطاع تعليمي", en: "Marketing lead — education" },
    initials: "ML",
    placeholder: true,
  },
];