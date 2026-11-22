import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/sections/project-card";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { pickLocale, type HomeContent } from "@/lib/data";

export async function Work({ content }: { content: HomeContent }) {
  const { locale } = content;
  if (content.projects.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "work" });

  return (
    <section id="work" className="section scroll-mt-20 border-y border-border bg-bg-elevated">
      <div className="container-page flex flex-col gap-12">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
            />
            <Link href="/work" className={buttonClass("outline", "md", "w-fit shrink-0 whitespace-nowrap")}>
              {t("backToWork")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-2">
          {content.projects.map((project, index) => {
            const firstResult = project.results[0];
            return (
              <li key={project.slug} className="h-full">
                <Reveal delay={index * 0.07} y={36} className="h-full">
                  <ProjectCard
                    title={pickLocale(project.title, locale)}
                    summary={pickLocale(project.summary, locale)}
                    category={pickLocale(project.category, locale)}
                    year={project.year}
                    viewLabel={t("viewCase")}
                    placeholderLabel={t("placeholderBadge")}
                    isPlaceholder={project.placeholder}
                    stack={project.stack}
                    highlight={
                      firstResult
                        ? {
                            value: firstResult.value,
                            label: pickLocale(firstResult.label, locale),
                          }
                        : undefined
                    }
                    href={`/work/${project.slug}`}
                  />
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}