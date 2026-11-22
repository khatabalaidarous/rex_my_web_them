import { getTranslations } from "next-intl/server";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buttonClass, LinkButton } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import type { HomeContent } from "@/lib/data";

export async function Cta({ content }: { content: HomeContent }) {
  const { locale, site } = content;
  const t = await getTranslations({ locale, namespace: "cta" });
  const ft = await getTranslations({ locale, namespace: "form" });
  const whatsappHref = `https://wa.me/${site.whatsapp}`;

  return (
    <section id="contact" className="section scroll-mt-20">
      <div className="container-page">
        <Reveal y={28}>
          <div className="gradient-border surface-card relative overflow-hidden p-6 sm:p-10 lg:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_90%_10%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_65%)]"
            />
            <div className="relative flex flex-col gap-6">
              <h2 className="max-w-2xl text-balance text-3xl font-semibold sm:text-4xl">
                {t("title")}
              </h2>
              <p className="max-w-xl text-pretty text-muted sm:text-lg">{t("subtitle")}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic strength={0.2}>
                  <LinkButton href="/contact" size="lg" className="w-full sm:w-auto">
                    {t("primary")}
                    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                  </LinkButton>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={buttonClass("outline", "lg", "w-full sm:w-auto")}
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    {t("secondary")}
                  </a>
                </Magnetic>
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-border/70 pt-4 text-xs text-muted">
                <a
                  href={`mailto:${site.email}`}
                  dir="ltr"
                  className="transition-colors hover:text-text"
                >
                  {site.email}
                </a>
                <CopyButton
                  value={site.email}
                  label={ft("copyEmail")}
                  copiedLabel={ft("copiedEmail")}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}