import Image from "next/image";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Handshake, Layers3, ShieldCheck, Sparkles, Target } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { TechGrid } from "@/components/sections/tech-grid";
import { Stats } from "@/components/sections/stats";
import { Cta } from "@/components/sections/cta";
import { SectionHeading } from "@/components/ui/section-heading";
import { aboutMission, aboutSecondary, pickLocale, values } from "@/content/site";
import { getHomeContent } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

const icons = {
  target: Target,
  sparkles: Sparkles,
  shield: ShieldCheck,
  handshake: Handshake,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "pages.about" });

  return pageMetadata({
    locale: l,
    path: "/about",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const ar = locale !== "en";
  const t = await getTranslations({ locale, namespace: "pages.about" });
  const techT = await getTranslations({ locale, namespace: "tech" });
  const content = await getHomeContent(locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="section">
        <div className="container-page grid items-stretch gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center gap-6">
            <Reveal>
              <SectionHeading eyebrow={t("eyebrow")} title={t("missionTitle")} />
            </Reveal>
            <Reveal delay={0.06} y={20}>
              <p className="text-pretty text-lg leading-relaxed text-text/90">
                {pickLocale(content.site.aboutMission ?? aboutMission, locale)}
              </p>
            </Reveal>
            <Reveal delay={0.12} y={20}>
              <p className="text-pretty leading-relaxed text-muted">
                {pickLocale(content.site.aboutSecondary ?? aboutSecondary, locale)}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={24} className="h-full">
            <div className="surface-card relative aspect-[4/3] w-full overflow-hidden lg:h-full">
              <div
                aria-hidden
                className="absolute inset-0 grid place-items-center bg-bg-elevated text-muted"
              >
                <Layers3 className="size-8 text-primary/60" aria-hidden />
              </div>
              <Image
                src="/images/studio-atelier.jpg"
                alt={
                  ar
                    ? "ورشة التصميم والهندسة المعمارية للبرمجيات"
                    : "Digital product engineering atelier workspace"
                }
                fill
                referrerPolicy="no-referrer"
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-border bg-bg-elevated">
        <div className="container-page flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("valuesTitle")}
              subtitle={t("valuesSubtitle")}
            />
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => {
              const Icon = icons[value.icon];
              return (
                <li key={value.icon} className="h-full">
                  <Reveal delay={index * 0.06} y={26} className="h-full">
                    <div className="gradient-border surface-card group flex h-full gap-4 p-6 transition-colors duration-300 hover:bg-surface-2">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-bg-elevated text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">
                          <bdi>{pickLocale(value.title, locale)}</bdi>
                        </h3>
                        <p className="text-sm leading-relaxed text-muted">
                          {pickLocale(value.description, locale)}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Stats content={content} />

      <section id="tech" className="section scroll-mt-20">
        <div className="container-page flex flex-col gap-8">
          <Reveal>
            <SectionHeading
              eyebrow={techT("eyebrow")}
              title={techT("title")}
              subtitle={techT("subtitle")}
            />
          </Reveal>
          <TechGrid techs={content.techStack} locale={locale} delay={0.08} />
        </div>
      </section>

      <Cta content={content} />
    </>
  );
}