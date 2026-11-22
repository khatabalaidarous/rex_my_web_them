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
    path: "/privacy",
    title: t("privacy"),
    description: t("privacySubtitle"),
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const [t, page] = await Promise.all([
    getTranslations({ locale, namespace: "legal" }),
    getLegal("privacy"),
  ]);

  return (
    <LegalDocument
      page={page}
      locale={locale}
      eyebrow={t("privacy")}
      title={t("privacy")}
      subtitle={t("privacySubtitle")}
      updatedLabel={t("updated")}
    />
  );
}