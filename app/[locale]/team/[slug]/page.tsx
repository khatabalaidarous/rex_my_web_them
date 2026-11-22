import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { Cta } from "@/components/sections/cta";
import { TeamPortrait } from "@/components/ui/team-portrait";
import { Link } from "@/i18n/navigation";
import { pickLocale, resolveMemberAvatar } from "@/content/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getHomeContent, getMember } from "@/lib/data";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const contents = await Promise.all(
    routing.locales.map((locale) => getHomeContent(locale)),
  );

  return contents.flatMap((content, index) =>
    content.team.map((member) => ({
      locale: routing.locales[index],
      slug: member.slug,
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
  const member = await getMember(slug);

  if (!member) {
    return {
      title: l === "ar" ? "العضو غير موجود" : "Member not found",
      robots: { index: false, follow: false },
    };
  }

  const displayName = member.name ? pickLocale(member.name, l) : pickLocale(member.role, l);
  const displayRole = member.name ? pickLocale(member.role, l) : null;
  const avatar = resolveMemberAvatar(member.slug, member.avatar);
  const ogImage = avatar?.startsWith("data:image/")
    ? undefined
    : avatar?.startsWith("https://")
      ? `/api/team-avatar/${encodeURIComponent(member.slug)}`
      : avatar;

  return pageMetadata({
    locale: l,
    path: `/team/${slug}`,
    title: displayRole ? `${displayName} — ${displayRole}` : displayName,
    description: pickLocale(member.focus, l),
    image: ogImage,
  });
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const member = await getMember(slug);
  if (!member) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "team" });
  const navT = await getTranslations({ locale, namespace: "nav" });
  const ct = await getTranslations({ locale, namespace: "common" });
  const content = await getHomeContent(locale);

  const displayName = member.name ? pickLocale(member.name, locale) : pickLocale(member.role, locale);
  const displayRole = member.name ? pickLocale(member.role, locale) : null;
  const avatar = resolveMemberAvatar(member.slug, member.avatar);
  const heroSubtitle = displayRole
    ? `${displayRole} — ${pickLocale(member.focus, locale)}`
    : pickLocale(member.focus, locale);

  const jsonLd = breadcrumbJsonLd(locale, [
    { name: "Home", path: "" },
    { name: t("eyebrow"), path: "/team" },
    { name: displayName, path: `/team/${member.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={t("eyebrow")}
        title={displayName}
        subtitle={heroSubtitle}
        breadcrumbs={
          <Breadcrumbs
            label={ct("breadcrumb")}
            items={[
              { label: navT("home"), href: "/" },
              { label: t("eyebrow"), href: "/team" },
              { label: displayName },
            ]}
          />
        }
      />

      <section className="section">
        <div className="container-page flex flex-col gap-10">
          <div className="grid items-stretch gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <Reveal className="h-full">
              <div className="gradient-border surface-card flex h-full flex-col gap-3 p-4">
                <TeamPortrait
                  src={avatar}
                  slug={member.slug}
                  alt={displayRole ? `${displayName} — ${displayRole}` : displayName}
                  initials={member.initials}
                  priority
                  interactive={false}
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 280px, 90vw"
                  className="aspect-square w-full lg:flex-1 lg:aspect-auto lg:min-h-[260px]"
                />
                <div className="flex flex-col gap-0.5 px-1">
                  <p className="text-sm font-semibold text-text">
                    <bdi>{displayName}</bdi>
                  </p>
                  {displayRole ? (
                    <p className="text-xs font-medium text-primary">
                      <bdi>{displayRole}</bdi>
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2">
              <Reveal delay={0.04} y={24} className="h-full">
                <div className="gradient-border surface-card flex h-full flex-col gap-4 p-6">
                  <h2 className="text-base font-semibold">{t("focus")}</h2>
                  <ul className="flex flex-col gap-3">
                    {member.responsibilities.map((item) => (
                      <li key={item.en} className="flex items-start gap-2.5 text-sm text-muted">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                        <span>{pickLocale(item, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.08} y={24} className="h-full">
                <div className="gradient-border surface-card flex h-full flex-col gap-4 p-6">
                  <h2 className="text-base font-semibold">{t("stack")}</h2>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {member.stack.map((tech, idx) => (
                      <li
                        key={tech}
                        className="flex items-baseline gap-2.5 border-b border-border/70 pb-2 text-sm text-text"
                      >
                        <span className="text-xs font-medium tabular-nums text-primary" dir="ltr">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <bdi>{tech}</bdi>
                      </li>
                    ))}
                  </ul>
                  {member.placeholder ? (
                    <p className="mt-auto rounded-lg border border-border bg-bg-elevated px-3 py-2 text-xs leading-relaxed text-muted">
                      {t("notice")}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
              >
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                {t("eyebrow")}
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
              >
                {t("contactCta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Cta content={content} />
    </>
  );
}