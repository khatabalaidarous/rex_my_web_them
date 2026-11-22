import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { CopyButton } from "@/components/ui/copy-button";
import { SectionHeading } from "@/components/ui/section-heading";
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
  const t = await getTranslations({ locale: l, namespace: "pages.contact" });

  return pageMetadata({
    locale: l,
    path: "/contact",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ brief?: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  const ft = await getTranslations({ locale, namespace: "form" });
  const { brief } = await searchParams;
  const content = await getHomeContent(locale);
  const { site } = content;
  const l = locale === "en" ? "en" : "ar";
  const initialBrief = typeof brief === "string" ? brief.slice(0, 2000) : "";

  const formattedWhatsapp = /^967\d{9}$/.test(site.whatsapp)
    ? `+967 ${site.whatsapp.slice(3, 6)} ${site.whatsapp.slice(6, 9)} ${site.whatsapp.slice(9, 12)}`
    : `+${site.whatsapp}`;

  const cards = [
    {
      icon: Mail,
      title: t("emailTitle"),
      body: t("emailBody"),
      value: site.email,
      href: `mailto:${site.email}`,
      ltr: true,
      copyable: true,
    },
    {
      icon: MessageCircle,
      title: t("whatsappTitle"),
      body: t("whatsappBody"),
      value: formattedWhatsapp,
      href: `https://wa.me/${site.whatsapp}`,
      ltr: true,
      copyable: false,
    },
    {
      icon: MapPin,
      title: t("locationTitle"),
      body: t("locationBody"),
      value: site.location[l],
      href: undefined,
      ltr: false,
      copyable: false,
    },
  ];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="section">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Reveal key={card.title} delay={index * 0.06} y={24} className="h-full">
                {card.copyable ? (
                  <div className="gradient-border surface-card group flex h-full flex-col gap-4 p-6 transition-colors duration-300 hover:bg-surface-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-11 place-items-center rounded-xl border border-border bg-bg-elevated text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <CopyButton
                        value={card.value}
                        label={ft("copyEmail")}
                        copiedLabel={ft("copiedEmail")}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-lg font-semibold">{card.title}</h2>
                      <p className="text-sm leading-relaxed text-muted">{card.body}</p>
                      <a
                        href={card.href}
                        className="mt-1 w-fit text-sm font-medium text-text underline-offset-4 hover:text-primary hover:underline"
                        dir="ltr"
                      >
                        {card.value}
                      </a>
                    </div>
                  </div>
                ) : card.href ? (
                  <a
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={card.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="gradient-border surface-card group flex h-full flex-col gap-4 p-6 transition-colors duration-300 hover:bg-surface-2"
                  >
                    <span className="grid size-11 place-items-center rounded-xl border border-border bg-bg-elevated text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="flex flex-col gap-2">
                      <span className="text-lg font-semibold">{card.title}</span>
                      <span className="text-sm leading-relaxed text-muted">{card.body}</span>
                      <span
                        className="mt-1 text-sm font-medium text-text"
                        dir={card.ltr ? "ltr" : undefined}
                      >
                        {card.value}
                      </span>
                    </span>
                  </a>
                ) : (
                  <div className="gradient-border surface-card group flex h-full flex-col gap-4 p-6">
                    <span className="grid size-11 place-items-center rounded-xl border border-border bg-bg-elevated text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="flex flex-col gap-2">
                      <span className="text-lg font-semibold">{card.title}</span>
                      <span className="text-sm leading-relaxed text-muted">{card.body}</span>
                      <span className="mt-1 text-sm font-medium text-text">{card.value}</span>
                    </span>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section border-t border-border bg-bg-elevated">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={ft("title")}
              subtitle={ft("subtitle")}
            />
          </Reveal>
          <Reveal delay={0.08} y={24}>
            <ContactForm initialMessage={initialBrief} />
          </Reveal>
        </div>
      </section>

      <Faq content={content} />
      <Cta content={content} />
    </>
  );
}