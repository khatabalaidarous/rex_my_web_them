import { getTranslations } from "next-intl/server";
import { Code2, Palette, Rocket, Search, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { pickLocale, type HomeContent } from "@/lib/data";
import type { Service } from "@/content/site";

const icons = {
  code: Code2,
  palette: Palette,
  rocket: Rocket,
  search: Search,
  shield: ShieldCheck,
  sparkles: Sparkles,
} satisfies Record<Service["icon"], typeof Code2>;

export async function Services({ content }: { content: HomeContent }) {
  const { locale } = content;
  if (content.services.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "services" });
  const useBento = content.services.length === 6;

  return (
    <section id="services" className="section scroll-mt-20">
      <div className="container-page flex flex-col gap-12">
        <Reveal>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        </Reveal>

        <ul
          className={
            useBento
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {content.services.map((service, index) => {
            const Icon = icons[service.icon];
            const isFeatured = useBento && (index === 0 || index === 5);

            return (
              <li
                key={`${service.icon}-${index}`}
                className={isFeatured ? "h-full sm:col-span-2 lg:col-span-2" : "h-full"}
              >
                <Reveal delay={index * 0.04} y={24} className="h-full">
                  <div
                    className={`gradient-border surface-card group relative flex h-full flex-col justify-between gap-5 overflow-hidden p-5 transition-colors duration-200 hover:border-primary/40 hover:bg-surface-2 sm:p-6 ${
                      isFeatured
                        ? "bg-[radial-gradient(ellipse_75%_85%_at_100%_0%,color-mix(in_srgb,var(--primary)_7%,transparent),transparent_70%)]"
                        : ""
                    }`}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-6 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-200 group-hover:scale-x-100"
                    />
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`grid size-11 place-items-center rounded-xl border border-border transition-transform duration-200 group-hover:scale-105 ${
                          isFeatured
                            ? "bg-primary/10 text-primary border-primary/25"
                            : "bg-bg-elevated text-primary"
                        }`}
                      >
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span
                        aria-hidden
                        className="text-xs font-medium tabular-nums text-muted/70"
                        dir="ltr"
                      >
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className={isFeatured ? "text-xl font-semibold" : "text-lg font-semibold"}>
                        <bdi>{pickLocale(service.title, locale)}</bdi>
                      </h3>
                      <p className="max-w-xl text-sm leading-relaxed text-muted">
                        {pickLocale(service.description, locale)}
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
  );
}