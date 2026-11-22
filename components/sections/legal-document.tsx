import { Info } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { pickLocale, type LegalPage } from "@/content/site";
import type { Locale } from "@/i18n/routing";

export function LegalDocument({
  page,
  locale,
  eyebrow,
  title,
  subtitle,
  updatedLabel,
}: {
  page: LegalPage;
  locale: Locale;
  eyebrow: string;
  title: string;
  subtitle: string;
  updatedLabel: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <section className="section">
        <div className="container-page max-w-3xl">
          <Reveal>
            <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
              <p className="text-xs leading-relaxed text-text">{pickLocale(page.notice, locale)}</p>
            </div>
          </Reveal>

          <Reveal delay={0.05} y={20}>
            <p className="text-pretty text-lg leading-relaxed text-text/90">
              {pickLocale(page.intro, locale)}
            </p>
          </Reveal>

          <Reveal delay={0.08} y={16}>
            <p className="mt-4 text-xs text-muted">
              {updatedLabel}:{" "}
              <time dateTime={page.updated} dir="ltr">
                {page.updated}
              </time>
            </p>
          </Reveal>

          <div className="mt-10 flex flex-col gap-8">
            {page.sections.map((section, index) => (
              <Reveal key={`${section.heading.en}-${index}`} delay={index * 0.05} y={20}>
                <article className="border-t border-border pt-6">
                  <h2 className="mb-2 text-lg font-semibold">
                    <bdi>{pickLocale(section.heading, locale)}</bdi>
                  </h2>
                  <p className="text-sm leading-relaxed text-muted">
                    {pickLocale(section.body, locale)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}