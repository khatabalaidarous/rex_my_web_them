import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { pickLocale, type HomeContent } from "@/lib/data";

export async function Faq({ content }: { content: HomeContent }) {
  const { locale } = content;
  if (content.faqs.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "faq" });

  return (
    <section id="faq" className="section scroll-mt-20 border-t border-border bg-bg-elevated">
      <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        </Reveal>

        <div className="flex flex-col gap-3">
          {content.faqs.map((item, index) => (
            <Reveal key={`${item.q.en}-${index}`} delay={index * 0.04} y={16}>
              <details className="group surface-card px-4 py-3.5 transition-colors duration-200 open:border-primary/40 open:bg-surface-2/40 hover:bg-surface-2/60 sm:px-6 sm:py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-start font-medium [&::-webkit-details-marker]:hidden">
                  <span className="flex items-baseline gap-3">
                    <span className="text-xs font-semibold tabular-nums text-primary" dir="ltr">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <bdi>{pickLocale(item.q, locale)}</bdi>
                  </span>
                  <Plus
                    className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45 group-open:text-primary"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 border-t border-border/60 pt-3 ps-7 text-sm leading-relaxed text-muted">
                  {pickLocale(item.a, locale)}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}