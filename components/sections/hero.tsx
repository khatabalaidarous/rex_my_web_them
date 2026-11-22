import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Code2 } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax } from "@/components/motion/parallax";
import { pickLocale, type HomeContent } from "@/lib/data";

export async function Hero({ content }: { content: HomeContent }) {
  const { locale, site } = content;
  const ar = locale !== "en";
  const t = await getTranslations({ locale, namespace: "hero" });

  const pillars = [
    {
      index: "01",
      title: "Next.js 16",
      detail: ar ? "هندسة خوادم سريعة الاستجابة" : "Server-first App Router",
      tone: "text-text",
    },
    {
      index: "02",
      title: "RTL / LTR",
      detail: ar ? "تجربة ثنائية اللغة أصلية" : "Native bilingual craft",
      tone: "text-accent",
    },
    {
      index: "03",
      title: "Cloud & CMS",
      detail: ar ? "إدارة محتوى وتحديثات فورية" : "Firestore CMS & realtime",
      tone: "text-text",
    },
    {
      index: "04",
      title: "WCAG AA",
      detail: ar ? "إتاحة وتباين عالي الدقة" : "Accessible on every screen",
      tone: "text-primary",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div aria-hidden className="absolute inset-0 -z-10 grid-backdrop opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-44 left-1/2 -z-10 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_18%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 end-0 -z-10 size-96 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_11%,transparent),transparent)]"
      />

      <div className="container-page flex flex-col gap-8 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:gap-11 lg:pt-14 lg:pb-16">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12">
          <div className="flex flex-col justify-center gap-6">
            <span className="inline-flex w-fit items-center gap-2.5 text-xs font-semibold text-accent">
              <span aria-hidden className="h-px w-5 bg-accent/70" />
              {t("badge")}
            </span>

            <h1 className="max-w-2xl text-balance text-[clamp(2.25rem,4.1vw,3.75rem)] font-semibold leading-[1.15]">
              {t("title")} <span className="text-gradient">{t("titleAccent")}</span>
            </h1>

            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {t("subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Magnetic strength={0.2}>
                <LinkButton href="/contact" size="lg">
                  {t("ctaPrimary")}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </LinkButton>
              </Magnetic>
              <Magnetic strength={0.2}>
                <LinkButton href="/work" size="lg" variant="outline">
                  {t("ctaSecondary")}
                </LinkButton>
              </Magnetic>
            </div>
          </div>

          <div className="relative flex flex-col">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_62%),radial-gradient(circle_at_80%_80%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_62%)]"
            />
            <Parallax speed={0.06} className="relative h-full">
              <div className="gradient-border surface-card group relative aspect-[4/3] w-full overflow-hidden lg:h-full">
                <div
                  aria-hidden
                  className="absolute inset-0 grid place-items-center bg-bg-elevated text-muted"
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Code2 className="size-9 text-primary/60" aria-hidden />
                    <span className="text-xs font-medium text-muted">
                      {pickLocale(site.name, locale)}
                    </span>
                  </div>
                </div>
                <Image
                  src="/images/hero-code-craft.jpg"
                  alt={
                    ar
                      ? "بيئة تطوير هندسية تعرض شيفرة نظيفة وهيكلة واجهات متقنة"
                      : "Engineering workstation displaying clean architecture code and UI wireframes"
                  }
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                />
              </div>
            </Parallax>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group flex flex-col justify-between gap-2 bg-surface px-4 py-4 transition-colors duration-200 hover:bg-surface-2 sm:px-5 sm:py-4.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span dir="ltr" className={`w-fit text-sm font-semibold ${pillar.tone}`}>
                  {pillar.title}
                </span>
                <span
                  aria-hidden
                  dir="ltr"
                  className="text-[11px] font-medium tabular-nums text-muted/60"
                >
                  {pillar.index}
                </span>
              </div>
              <span className="text-xs leading-relaxed text-muted">{pillar.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}