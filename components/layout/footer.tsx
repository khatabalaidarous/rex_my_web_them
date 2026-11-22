import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Mail } from "lucide-react";
import { BrandMark } from "./brand-mark";
import type { SiteMeta } from "@/lib/data";

type FooterProps = {
  nav: { key: string; href: string }[];
  locale: string;
  site: SiteMeta;
};

export async function Footer({ nav, locale, site }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const navT = await getTranslations({ locale, namespace: "nav" });
  const legalT = await getTranslations({ locale, namespace: "legal" });
  const ar = locale !== "en";
  const name = site.name[ar ? "ar" : "en"];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1.15fr] lg:py-16">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex w-fit items-center gap-2.5">
            <BrandMark size="md" logoUrl={site.logoUrl} alt={name} />
            <span className="text-base font-semibold tracking-tight">{name}</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {site.tagline[ar ? "ar" : "en"]}
          </p>
          <p className="text-xs text-muted">{site.location[ar ? "ar" : "en"]}</p>
        </div>

        <nav aria-label={t("nav")} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text">{t("nav")}</h2>
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="w-fit text-sm text-muted transition-colors hover:text-text"
            >
              {navT(item.key)}
            </Link>
          ))}
        </nav>

        <nav
          aria-label={ar ? "الموارد والأدوات" : "Resources"}
          className="flex flex-col gap-3"
        >
          <h2 className="text-sm font-semibold text-text">
            {ar ? "أدوات ومعلومات" : "Studio & Tools"}
          </h2>
          <Link
            href="/contact"
            className="w-fit text-sm text-muted transition-colors hover:text-text"
          >
            {navT("contact")}
          </Link>
          <Link
            href="/search"
            className="w-fit text-sm text-muted transition-colors hover:text-text"
          >
            {ar ? "البحث في الموقع" : "Site Search"}
          </Link>
          <Link
            href="/studio"
            className="w-fit text-sm text-muted transition-colors hover:text-text"
          >
            {ar ? "إدارة المحتوى (Studio)" : "Content Studio"}
          </Link>
          <Link
            href="/privacy"
            className="w-fit text-sm text-muted transition-colors hover:text-text"
          >
            {legalT("privacy")}
          </Link>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text">{t("contact")}</h2>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-text"
          >
            <Mail className="size-4 shrink-0 text-primary" aria-hidden />
            <span dir="ltr">{site.email}</span>
          </a>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-text"
              >
                <span>{social.label}</span>
                <ArrowUpRight
                  className="size-3.5 text-muted/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page flex flex-col items-start justify-between gap-3 border-t border-border py-6 text-xs text-muted sm:flex-row sm:items-center">
        <p>
          © <span className="tabular-nums">{year}</span> {name}. {t("rights")}.
        </p>
        <nav
          aria-label={ar ? "روابط قانونية" : "Legal links"}
          className="flex flex-wrap items-center gap-4"
        >
          <Link href="/privacy" className="transition-colors hover:text-text">
            {legalT("privacy")}
          </Link>
          <Link href="/terms" className="transition-colors hover:text-text">
            {legalT("terms")}
          </Link>
          <Link href="/studio" className="transition-colors hover:text-text">
            {ar ? "الاستوديو" : "Studio"}
          </Link>
        </nav>
        <p>
          {t("madeWith")} · {ar ? "بالعربية" : "in English"}
        </p>
      </div>
    </footer>
  );
}