import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Cta } from "@/components/sections/cta";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { getHomeContent } from "@/lib/data";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "blog" });

  return pageMetadata({
    locale: l,
    path: "/blog",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const content = await getHomeContent(locale);
  const [featuredPost, ...restPosts] = content.posts;

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="section">
        <div className="container-page flex flex-col gap-6">
          {!featuredPost ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
              {locale === "ar" ? "لا توجد مقالات منشورة حالياً." : "No published posts yet."}
            </div>
          ) : (
            <>
              <Reveal y={20}>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="gradient-border surface-card group grid gap-6 bg-[radial-gradient(ellipse_75%_90%_at_95%_10%,color-mix(in_srgb,var(--primary)_9%,transparent),transparent_70%)] p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-surface-2 sm:p-8 md:grid-cols-[1.45fr_auto] md:items-end"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted">
                      <span className="font-semibold text-primary">
                        {pickLocale(featuredPost.tag, locale)}
                      </span>
                      <span aria-hidden>·</span>
                      <time dateTime={featuredPost.date} dir="ltr" className="tabular-nums">
                        {featuredPost.date}
                      </time>
                      <span aria-hidden>·</span>
                      <span className="tabular-nums">
                        {featuredPost.readingMinutes} {t("minRead")}
                      </span>
                      {featuredPost.placeholder ? (
                        <>
                          <span aria-hidden>·</span>
                          <span>{t("placeholder")}</span>
                        </>
                      ) : null}
                    </div>
                    <h2 className="max-w-3xl text-2xl font-semibold leading-snug transition-colors group-hover:text-primary sm:text-3xl">
                      <bdi>{pickLocale(featuredPost.title, locale)}</bdi>
                    </h2>
                    <p className="max-w-2xl text-base leading-relaxed text-muted">
                      {pickLocale(featuredPost.excerpt, locale)}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary">
                    {t("readMore")}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>

              {restPosts.length > 0 ? (
                <ul className="grid gap-4 md:grid-cols-2">
                  {restPosts.map((post, index) => (
                    <li key={post.slug} className="h-full">
                      <Reveal delay={index * 0.05} y={22} className="h-full">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="gradient-border surface-card group flex h-full flex-col gap-3.5 p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-surface-2"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                            <span className="font-medium text-primary">
                              {pickLocale(post.tag, locale)}
                            </span>
                            <span aria-hidden>·</span>
                            <time dateTime={post.date} dir="ltr" className="tabular-nums">
                              {post.date}
                            </time>
                            <span aria-hidden>·</span>
                            <span className="tabular-nums">
                              {post.readingMinutes} {t("minRead")}
                            </span>
                            {post.placeholder ? (
                              <>
                                <span aria-hidden>·</span>
                                <span>{t("placeholder")}</span>
                              </>
                            ) : null}
                          </div>
                          <h2 className="text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
                            <bdi>{pickLocale(post.title, locale)}</bdi>
                          </h2>
                          <p className="text-sm leading-relaxed text-muted">
                            {pickLocale(post.excerpt, locale)}
                          </p>
                          <span className="mt-auto inline-flex items-center gap-2 border-t border-border/70 pt-3.5 text-sm font-medium text-primary">
                            {t("readMore")}
                            <ArrowRight
                              className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                              aria-hidden
                            />
                          </span>
                        </Link>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>
      </section>

      <Cta content={content} />
    </>
  );
}