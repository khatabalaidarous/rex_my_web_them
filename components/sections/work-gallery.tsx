"use client";

import { useMemo, useState } from "react";
import { pickLocale, type Project } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/sections/project-card";

type WorkGalleryProps = {
  projects: Project[];
  locale: Locale;
  labels: {
    viewCase: string;
    placeholder: string;
    all: string;
    filter: string;
  };
};

export function WorkGallery({ projects, locale, labels }: WorkGalleryProps) {
  const categories = useMemo(
    () => Array.from(new Set(projects.map((project) => pickLocale(project.category, locale)))),
    [projects, locale],
  );
  const [active, setActive] = useState<string>("all");

  const visible =
    active === "all"
      ? projects
      : projects.filter((project) => pickLocale(project.category, locale) === active);

  const filters = [{ key: "all", label: labels.all }, ...categories.map((category) => ({ key: category, label: category }))];

  return (
    <section className="section">
      <div className="container-page flex flex-col gap-8">
        <Reveal>
          <div
            role="group"
            aria-label={labels.filter}
            className="flex flex-wrap items-center gap-1.5 self-start rounded-xl border border-border bg-bg-elevated p-1"
          >
            {filters.map((filter) => {
              const isActive = active === filter.key;
              const count =
                filter.key === "all"
                  ? projects.length
                  : projects.filter((p) => pickLocale(p.category, locale) === filter.key).length;
              return (
                <button
                  key={filter.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(filter.key)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? "bg-surface text-text shadow-sm"
                      : "text-muted hover:text-text"
                  }`}
                >
                  <bdi>{filter.label}</bdi>
                  <span className="tabular-nums text-[11px] text-muted">{count}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
            {locale === "ar" ? "لا توجد مشاريع مطابقة حالياً." : "No projects match this category yet."}
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {visible.map((project, index) => {
              const firstResult = project.results[0];
              return (
                <li key={project.slug} className="h-full">
                  <Reveal delay={index * 0.06} y={32} className="h-full">
                    <ProjectCard
                      title={pickLocale(project.title, locale)}
                      summary={pickLocale(project.summary, locale)}
                      category={pickLocale(project.category, locale)}
                      year={project.year}
                      viewLabel={labels.viewCase}
                      placeholderLabel={labels.placeholder}
                      isPlaceholder={project.placeholder}
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
        )}
      </div>
    </section>
  );
}