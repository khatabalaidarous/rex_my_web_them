import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { WorkGallery } from "@/components/sections/work-gallery";
import { Cta } from "@/components/sections/cta";
import { getHomeContent } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "pages.work" });

  return pageMetadata({
    locale: l,
    path: "/work",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.work" });
  const wt = await getTranslations({ locale, namespace: "work" });
  const content = await getHomeContent(locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <WorkGallery
        projects={content.projects}
        locale={locale}
        labels={{
          viewCase: wt("viewCase"),
          placeholder: wt("placeholderBadge"),
          all: wt("all"),
          filter: wt("filter"),
        }}
      />
      <Cta content={content} />
    </>
  );
}