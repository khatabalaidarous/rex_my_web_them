"use client";

import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/button";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="section">
      <div className="container-page flex flex-col items-start gap-6">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">404</span>
        <h1 className="text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <LinkButton href="/" size="lg">
          {t("back")}
        </LinkButton>
      </div>
    </section>
  );
}