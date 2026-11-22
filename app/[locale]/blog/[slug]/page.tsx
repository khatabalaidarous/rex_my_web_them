import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/content/site";
import { breadcrumbItems, pageMetadata } from "@/lib/seo";
import { getHomeContent, getPost, getSite } from "@/lib/data";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const contents = await Promise.all(
    routing.locales.map((locale) => getHomeContent(locale)),
  );

  return contents.flatMap((content, index) =>
    content.posts.map((post) => ({
      locale: routing.locales[index],
      slug: post.slug,
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
  const post = await getPost(slug);

  if (!post) {
    return {
      title: l === "ar" ? "المقال غير موجود" : "Post not found",
      robots: { index: false, follow: false },
    };
  }

  const base = pageMetadata({
    locale: l,
    path: `/blog/${slug}`,
    title: pickLocale(post.title, l),
    description: pickLocale(post.excerpt, l),
    type: "article",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const [post, site] = await Promise.all([getPost(slug), getSite()]);
  if (!post) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const navT = await getTranslations({ locale, namespace: "nav" });
  const ct = await getTranslations({ locale, namespace: "common" });
  const l = locale === "en" ? "en" : "ar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems(locale, [
          { name: "Home", path: "" },
          { name: t("back"), path: "/blog" },
          { name: pickLocale(post.title, locale), path: `/blog/${post.slug}` },
        ]),
      },
      {
        "@type": "BlogPosting",
        headline: pickLocale(post.title, locale),
        description: pickLocale(post.excerpt, locale),
        datePublished: post.date,
        inLanguage: l,
        author: { "@type": "Organization", name: site.name[l] },
        publisher: { "@type": "Organization", name: site.name[l] },
        mainEntityOfPage: `/${l}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={pickLocale(post.tag, locale)}
        title={pickLocale(post.title, locale)}
        subtitle={pickLocale(post.excerpt, locale)}
        breadcrumbs={
          <Breadcrumbs
            label={ct("breadcrumb")}
            items={[
              { label: navT("home"), href: "/" },
              { label: t("back"), href: "/blog" },
              { label: pickLocale(post.title, locale) },
            ]}
          />
        }
      />

      <article className="section">
        <div className="container-page max-w-3xl">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2.5 border-b border-border pb-6 text-xs text-muted">
              <span>
                {t("published")}{" "}
                <time dateTime={post.date} dir="ltr" className="tabular-nums">
                  {post.date}
                </time>
              </span>
              <span aria-hidden>·</span>
              <span className="tabular-nums">
                {post.readingMinutes} {t("minRead")}
              </span>
              {post.placeholder ? (
                <>
                  <span aria-hidden>·</span>
                  <span className="text-muted">{t("placeholder")}</span>
                </>
              ) : null}
            </div>
          </Reveal>

          <div className="mt-8 flex flex-col gap-6">
            {post.body.map((paragraph, index) => (
              <Reveal key={paragraph.en.slice(0, 32)} delay={index * 0.05} y={20}>
                <p className="text-pretty text-base leading-loose text-text/90">
                  {pickLocale(paragraph, locale)}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 border-t border-border pt-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
              >
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                {t("back")}
              </Link>
            </div>
          </Reveal>
        </div>
      </article>
    </>
  );
}