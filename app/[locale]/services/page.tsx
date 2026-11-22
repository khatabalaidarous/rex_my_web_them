import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { pickLocale } from "@/content/site";
import { getHomeContent } from "@/lib/data";
import { breadcrumbItems, pageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "pages.services" });

  return pageMetadata({
    locale: l,
    path: "/services",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.services" });
  const content = await getHomeContent(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems(locale, [
          { name: t("eyebrow"), path: "/services" },
        ]),
      },
      {
        "@type": "ItemList",
        itemListElement: content.services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: pickLocale(service.title, locale),
            description: pickLocale(service.description, locale),
            provider: { "@type": "Organization", name: pickLocale(content.site.name, locale) },
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map((faq) => ({
          "@type": "Question",
          name: pickLocale(faq.q, locale),
          acceptedAnswer: {
            "@type": "Answer",
            text: pickLocale(faq.a, locale),
          },
        })),
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
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <Services content={content} />
      <Process content={content} />
      <Faq content={content} />
      <Cta content={content} />
    </>
  );
}