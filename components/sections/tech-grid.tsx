"use client";

import { useMemo, useState } from "react";
import { pickLocale, techGroups, type Tech, type TechGroupKey } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/motion/reveal";

const accentClasses: Record<Tech["accent"], string> = {
  violet: "border-primary/35 bg-primary/10 text-primary",
  mint: "border-accent/35 bg-accent/10 text-accent",
  sky: "border-sky-400/35 bg-sky-400/10 text-sky-600 dark:text-sky-400",
  amber: "border-amber-400/35 bg-amber-400/10 text-amber-600 dark:text-amber-400",
};

const accentLineClasses: Record<Tech["accent"], string> = {
  violet: "via-primary",
  mint: "via-accent",
  sky: "via-sky-400",
  amber: "via-amber-400",
};

export function TechGrid({
  techs,
  locale,
  delay = 0,
  defaultGroup = "web",
}: {
  techs: Tech[];
  locale: Locale;
  delay?: number;
  defaultGroup?: "all" | TechGroupKey;
}) {
  const availableGroups = useMemo(
    () =>
      techGroups.filter((group) => techs.some((tech) => tech.group === group.key)),
    [techs],
  );

  const resolvedDefault: "all" | TechGroupKey =
    defaultGroup === "all" || availableGroups.some((g) => g.key === defaultGroup)
      ? defaultGroup
      : availableGroups[0]?.key ?? "all";

  const [selectedGroup, setSelectedGroup] = useState<"all" | TechGroupKey>(resolvedDefault);

  const visibleGroups =
    selectedGroup === "all"
      ? availableGroups
      : availableGroups.filter((group) => group.key === selectedGroup);

  if (techs.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <div
        role="group"
        aria-label={locale === "ar" ? "تصفية التقنيات والأدوات" : "Filter technologies and tools"}
        className="flex max-w-full flex-wrap items-center gap-1.5 self-start rounded-xl border border-border bg-bg-elevated p-1"
      >
        {availableGroups.map((group) => {
          const count = techs.filter((t) => t.group === group.key).length;
          const isActive = selectedGroup === group.key;
          return (
            <button
              key={group.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedGroup(group.key)}
              className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-surface text-text shadow-sm"
                  : "text-muted hover:text-text"
              }`}
            >
              <span>{pickLocale(group.title, locale)}</span>
              <span className="tabular-nums text-[11px] text-muted">{count}</span>
            </button>
          );
        })}

        <button
          type="button"
          aria-pressed={selectedGroup === "all"}
          onClick={() => setSelectedGroup("all")}
          className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
            selectedGroup === "all"
              ? "bg-surface text-text shadow-sm"
              : "text-muted hover:text-text"
          }`}
        >
          <span>{locale === "ar" ? "عرض الكل" : "Show all"}</span>
          <span className="tabular-nums text-[11px] text-muted">{techs.length}</span>
        </button>
      </div>

      <div className="flex flex-col gap-10">
        {visibleGroups.map((group, groupIndex) => {
          const items = techs.filter((tech) => tech.group === group.key);
          if (items.length === 0) return null;

          return (
            <div key={group.key} className="flex flex-col gap-4">
              <Reveal delay={delay + groupIndex * 0.03} y={16}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-base font-semibold">
                      {pickLocale(group.title, locale)}
                    </h3>
                    <span className="text-xs tabular-nums text-muted">
                      {items.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{pickLocale(group.subtitle, locale)}</p>
                </div>
              </Reveal>

              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((tech, index) => (
                  <li key={`${tech.group}-${tech.name}-${index}`} className="h-full">
                    <div className="gradient-border surface-card group relative flex h-full flex-col gap-4 overflow-hidden p-5 transition-colors duration-200 hover:border-primary/40 hover:bg-surface-2">
                      <span
                        aria-hidden
                        className={`absolute inset-x-5 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent ${accentLineClasses[tech.accent]} to-transparent transition-transform duration-300 group-hover:scale-x-100`}
                      />
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`grid size-10 shrink-0 place-items-center rounded-xl border text-sm font-bold ${accentClasses[tech.accent]}`}
                          aria-hidden
                        >
                          <bdi>{tech.name.charAt(0)}</bdi>
                        </span>
                        <span className="text-xs font-medium text-muted">
                          {pickLocale(tech.category, locale)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-base font-semibold">
                          <bdi>{tech.name}</bdi>
                        </h4>
                        <p className="text-sm leading-relaxed text-muted">
                          {pickLocale(tech.description, locale)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}