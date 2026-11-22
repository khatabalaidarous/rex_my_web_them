import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { TechGrid } from "@/components/sections/tech-grid";
import { Reveal } from "@/components/motion/reveal";
import type { HomeContent } from "@/lib/data";

export async function TechStack({ content }: { content: HomeContent }) {
  const { locale } = content;
  const t = await getTranslations({ locale, namespace: "tech" });

  return (
    <section id="tech" className="section scroll-mt-20 border-t border-border">
      <div className="container-page flex flex-col gap-10">
        <Reveal>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        </Reveal>

        <TechGrid techs={content.techStack} locale={locale} delay={0.1} />
      </div>
    </section>
  );
}