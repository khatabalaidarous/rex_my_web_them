import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/content/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getHomeContent, getProject } from "@/lib/data";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const contents = await Promise.all(
    routing.locales.map((locale) => getHomeContent(locale)),
  );

  return contents.flatMap((content, index) =>
    content.projects.map((project) => ({
      locale: routing.locales[index],
      slug: project.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: l === "ar" ? "المشروع غير موجود" : "Project not found",
      robots: { index: false, follow: false },
    };
  }

  return pageMetadata({
    locale: l,
    path: `/work/${slug}`,
    title: pickLocale(project.title, l),
    description: pickLocale(project.summary, l),
    type: "article",
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const project = await getProject(slug);
  if (!project) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "work" });
  const navT = await getTranslations({ locale, namespace: "nav" });
  const ct = await getTranslations({ locale, namespace: "common" });
  const content = await getHomeContent(locale);

  const index = content.projects.findIndex((item) => item.slug === slug);
  const next = content.projects[(index + 1) % content.projects.length];

  const meta = [
    { label: t("client"), value: pickLocale(project.client, locale), ltr: false },
    { label: t("role"), value: pickLocale(project.role, locale), ltr: false },
    { label: t("duration"), value: pickLocale(project.duration, locale), ltr: false },
    { label: t("year"), value: project.year, ltr: true },
  ];

  const jsonLd = breadcrumbJsonLd(locale, [
    { name: "Home", path: "" },
    { name: t("backToWork"), path: "/work" },
    { name: pickLocale(project.title, locale), path: `/work/${project.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={pickLocale(project.category, locale)}
        title={pickLocale(project.title, locale)}
        subtitle={pickLocale(project.summary, locale)}
        breadcrumbs={
          <Breadcrumbs
            label={ct("breadcrumb")}
            items={[
              { label: navT("home"), href: "/" },
              { label: t("backToWork"), href: "/work" },
              { label: pickLocale(project.title, locale) },
            ]}
          />
        }
      />

      <section className="section border-t border-border">
        <div className="container-page flex flex-col gap-12">
          <Reveal>
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {meta.map((item) => (
                <div
                  key={item.label}
                  className="gradient-border surface-card flex flex-col gap-2 p-5"
                >
                  <dt className="text-xs font-medium uppercase tracking-wider rtl:tracking-normal text-muted">
                    {item.label}
                  </dt>
                  <dd className="text-sm font-medium text-text" dir={item.ltr ? "ltr" : undefined}>
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { heading: t("challenge"), body: pickLocale(project.challenge, locale) },
              { heading: t("solution"), body: pickLocale(project.solution, locale) },
            ].map((block, blockIndex) => (
              <Reveal key={block.heading} delay={blockIndex * 0.08} y={28} className="h-full">
                <article className="gradient-border surface-card flex h-full flex-col gap-3 p-6">
                  <h2 className="text-lg font-semibold">
                    <bdi>{block.heading}</bdi>
                  </h2>
                  <p className="text-sm leading-relaxed text-muted">{block.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <Reveal>
              <h2 className="text-lg font-semibold">{t("results")}</h2>
            </Reveal>
            <dl className="grid gap-3 sm:grid-cols-3">
              {project.results.map((result, resultIndex) => (
                <Reveal key={`${result.label.en}-${resultIndex}`} delay={resultIndex * 0.07} y={22} className="h-full">
                  <div className="surface-card flex h-full flex-col gap-1.5 p-5">
                    <dd className="text-2xl font-semibold tabular-nums text-gradient" dir="ltr">
                      {result.value}
                    </dd>
                    <dt className="text-xs text-muted">{pickLocale(result.label, locale)}</dt>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="me-2 text-sm font-medium text-muted">{t("stack")}:</h2>
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border bg-surface px-3 py-1 text-xs text-text"
                  >
                    <bdi>{tech}</bdi>
                  </span>
                ))}
              </div>
              {project.placeholder ? (
                <span className="text-xs text-muted">{t("placeholderBadge")}</span>
              ) : null}
            </div>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
              >
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                {t("backToWork")}
              </Link>

              {content.projects.length > 1 && next && next.slug !== project.slug ? (
                <Link
                  href={`/work/${next.slug}`}
                  className="gradient-border surface-card group flex items-center gap-4 p-5 transition-colors hover:bg-surface-2"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-xs text-muted">{t("nextProject")}</span>
                    <span className="text-sm font-semibold">
                      <bdi>{pickLocale(next.title, locale)}</bdi>
                    </span>
                  </span>
                  <ArrowLeft className="size-4 text-primary transition-transform group-hover:-translate-x-1 rtl:hidden" aria-hidden />
                  <ArrowRight className="hidden size-4 text-primary transition-transform group-hover:translate-x-1 rtl:block" aria-hidden />
                </Link>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}