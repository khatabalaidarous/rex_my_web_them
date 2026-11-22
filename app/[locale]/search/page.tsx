import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Search } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { navItems, pickLocale, techGroups } from "@/content/site";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { matchesSearchQuery } from "@/lib/search";
import { getHomeContent } from "@/lib/data";

type GroupKey = "pages" | "services" | "projects" | "posts" | "team" | "skills" | "faqs";

type SearchItem = {
  href: string;
  title: string;
  description: string;
  keywords: string;
  group: GroupKey;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "search" });

  return {
    title: t("label"),
    description: t("noQuery"),
    alternates: alternatesFor(l, "/search"),
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const ar = locale !== "en";
  const t = await getTranslations({ locale, namespace: "search" });
  const navT = await getTranslations({ locale, namespace: "nav" });
  const faqT = await getTranslations({ locale, namespace: "faq" });
  const { q } = await searchParams;
  const content = await getHomeContent(locale);

  const query = (q ?? "").trim();

  const items: SearchItem[] = [
    ...navItems.map((item) => ({
      href: item.href,
      title: navT(item.key),
      description: navT(item.key),
      keywords: `${item.key} ${navT(item.key)}`,
      group: "pages" as const,
    })),
    ...content.services.map((service) => ({
      href: "/services",
      title: pickLocale(service.title, locale),
      description: pickLocale(service.description, locale),
      keywords: `${pickLocale(service.title, locale)} ${pickLocale(service.description, locale)}`,
      group: "services" as const,
    })),
    ...content.projects.map((project) => ({
      href: `/work/${project.slug}`,
      title: pickLocale(project.title, locale),
      description: pickLocale(project.summary, locale),
      keywords: `${pickLocale(project.category, locale)} ${project.stack.join(" ")}`,
      group: "projects" as const,
    })),
    ...content.posts.map((post) => ({
      href: `/blog/${post.slug}`,
      title: pickLocale(post.title, locale),
      description: pickLocale(post.excerpt, locale),
      keywords: pickLocale(post.tag, locale),
      group: "posts" as const,
    })),
    ...content.team.map((member) => {
      const displayName = member.name
        ? `${pickLocale(member.name, locale)} — ${pickLocale(member.role, locale)}`
        : pickLocale(member.role, locale);
      return {
        href: `/team/${member.slug}`,
        title: displayName,
        description: pickLocale(member.focus, locale),
        keywords: member.stack.join(" "),
        group: "team" as const,
      };
    }),
    ...content.techStack.map((tech) => {
      const group = techGroups.find((item) => item.key === tech.group);
      return {
        href: "/about#tech",
        title: tech.name,
        description: `${group ? pickLocale(group.title, locale) : ""} — ${pickLocale(tech.category, locale)} — ${pickLocale(tech.description, locale)}`,
        keywords: `${tech.name} ${pickLocale(tech.category, locale)}`,
        group: "skills" as const,
      };
    }),
    ...content.faqs.map((faq) => ({
      href: "/#faq",
      title: pickLocale(faq.q, locale),
      description: pickLocale(faq.a, locale),
      keywords: `${pickLocale(faq.q, locale)} ${pickLocale(faq.a, locale)}`,
      group: "faqs" as const,
    })),
  ];

  const results = query
    ? items.filter((item) =>
        matchesSearchQuery(`${item.title} ${item.description} ${item.keywords}`, query),
      )
    : [];

  const groups: { key: GroupKey; label: string }[] = [
    { key: "pages", label: t("pages") },
    { key: "services", label: t("services") },
    { key: "projects", label: t("projects") },
    { key: "posts", label: t("posts") },
    { key: "team", label: t("team") },
    { key: "skills", label: t("skills") },
    { key: "faqs", label: faqT("eyebrow") },
  ];

  const suggestedQueries = ar
    ? ["Next.js", "تصميم", "تطوير الويب", "TypeScript", "تواصل"]
    : ["Next.js", "Design", "Web development", "TypeScript", "Contact"];

  return (
    <>
      <PageHero
        eyebrow={t("label")}
        title={t("label")}
        subtitle={query ? `${t("results")} — ${results.length}` : t("noQuery")}
      />

      <section className="section">
        <div className="container-page flex flex-col gap-8">
          <Reveal>
            <form
              action={`/${locale}/search`}
              method="get"
              role="search"
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  aria-label={t("query")}
                  placeholder={t("placeholder")}
                  className="h-12 w-full rounded-full border border-border bg-bg-elevated ps-11 pe-4 text-sm text-text placeholder:text-muted/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </div>
              <button
                type="submit"
                className="h-12 shrink-0 cursor-pointer rounded-full bg-primary px-6 text-sm font-medium text-primary-fg transition-opacity hover:opacity-90"
              >
                {t("submit")}
              </button>
            </form>
          </Reveal>

          {!query ? (
            <Reveal delay={0.04}>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted">
                  {ar ? "مقترحات سريعة:" : "Quick searches:"}
                </span>
                {suggestedQueries.map((suggestion) => (
                  <Link
                    key={suggestion}
                    href={`/search?q=${encodeURIComponent(suggestion)}`}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 font-medium text-text transition-colors hover:border-primary/40 hover:bg-surface-2"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </Reveal>
          ) : null}

          {query && results.length === 0 ? (
            <Reveal>
              <p
                role="status"
                className="rounded-xl border border-border bg-bg-elevated px-4 py-6 text-center text-sm text-muted"
              >
                {t("empty")}
              </p>
            </Reveal>
          ) : null}

          {groups.map((group, groupIndex) => {
            const groupItems = results.filter((item) => item.group === group.key);
            if (groupItems.length === 0) return null;

            return (
              <div key={group.key} className="flex flex-col gap-3">
                <Reveal delay={groupIndex * 0.04} y={16}>
                  <h2 className="flex items-baseline gap-2 border-b border-border pb-2 text-sm font-semibold text-text">
                    {group.label}
                    <span className="text-xs font-normal tabular-nums text-muted">
                      {groupItems.length}
                    </span>
                  </h2>
                </Reveal>
                <ul className="flex flex-col gap-2">
                  {groupItems.map((item, index) => (
                    <li key={`${group.key}-${item.href}-${index}`}>
                      <Reveal delay={index * 0.03} y={14}>
                        <Link
                          href={item.href}
                          className="surface-card group flex items-start justify-between gap-4 p-4 transition-colors hover:bg-surface-2"
                        >
                          <span className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-text">
                              <bdi>{item.title}</bdi>
                            </span>
                            <span className="line-clamp-2 text-xs leading-relaxed text-muted">
                              {item.description}
                            </span>
                          </span>
                          <ArrowRight
                            className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 rtl:rotate-180"
                            aria-hidden
                          />
                        </Link>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}