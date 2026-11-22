import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { pickLocale, type HomeContent } from "@/lib/data";

export async function Process({ content }: { content: HomeContent }) {
  const { locale } = content;
  if (content.process.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "process" });

  return (
    <section id="process" className="section scroll-mt-20">
      <div className="container-page flex flex-col gap-12">
        <Reveal>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        </Reveal>

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.process.map((step, index) => (
            <li key={`${step.number}-${index}`} className="h-full">
              <Reveal delay={index * 0.06} y={24} className="h-full">
                <div className="gradient-border surface-card group relative flex h-full flex-col gap-4 overflow-hidden p-5 transition-colors duration-200 hover:border-primary/40 hover:bg-surface-2 sm:p-6">
                  <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
                    <span className="text-sm font-semibold tabular-nums text-primary" dir="ltr">
                      {step.number}
                    </span>
                    <span
                      aria-hidden
                      className="h-px flex-1 bg-gradient-to-r from-primary/35 via-border to-transparent rtl:bg-gradient-to-l"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">
                    <bdi>{pickLocale(step.title, locale)}</bdi>
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {pickLocale(step.description, locale)}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}