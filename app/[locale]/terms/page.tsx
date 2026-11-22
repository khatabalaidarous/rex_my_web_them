import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/sections/legal-document";
import { getLegal } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "legal" });

  return pageMetadata({
    locale: l,
    path: "/terms",
    title: t("terms"),
    description: t("termsSubtitle"),
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const [t, page] = await Promise.all([
    getTranslations({ locale, namespace: "legal" }),
    getLegal("terms"),
  ]);

  return (
    <LegalDocument
      page={page}
      locale={locale}
      eyebrow={t("terms")}
      title={t("terms")}
      subtitle={t("termsSubtitle")}
      updatedLabel={t("updated")}
    />
  );
}