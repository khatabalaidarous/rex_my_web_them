import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Cta } from "@/components/sections/cta";
import { TeamPortrait } from "@/components/ui/team-portrait";
import { Link } from "@/i18n/navigation";
import { pickLocale, resolveMemberAvatar } from "@/content/site";
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
  const t = await getTranslations({ locale: l, namespace: "team" });

  return pageMetadata({
    locale: l,
    path: "/team",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "team" });
  const content = await getHomeContent(locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="section">
        <div className="container-page flex flex-col gap-8">
          {content.team.some((member) => member.placeholder) ? (
            <Reveal>
              <p className="rounded-xl border border-border bg-bg-elevated px-4 py-3 text-xs leading-relaxed text-muted">
                {t("notice")}
              </p>
            </Reveal>
          ) : null}

          {content.team.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
              {locale === "ar" ? "لا توجد ملفات أعضاء مضافة حالياً." : "No team profiles added yet."}
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {content.team.map((member, index) => {
                const displayName = member.name
                  ? pickLocale(member.name, locale)
                  : pickLocale(member.role, locale);
                const displayRole = member.name ? pickLocale(member.role, locale) : null;
                const avatar = resolveMemberAvatar(member.slug, member.avatar);

                return (
                  <li key={member.slug} className="h-full">
                    <Reveal delay={index * 0.06} y={26} className="h-full">
                      <article className="gradient-border surface-card group relative flex h-full flex-col gap-4 p-4 transition-colors duration-300 hover:border-primary/40 hover:bg-surface-2">
                        <TeamPortrait
                          src={avatar}
                          slug={member.slug}
                          alt={displayRole ? `${displayName} — ${displayRole}` : displayName}
                          initials={member.initials}
                          accentIndex={index}
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 92vw"
                          className="aspect-[5/4] w-full"
                        />

                        <div className="flex flex-1 flex-col gap-1.5 px-1">
                          <div className="flex items-start justify-between gap-2">
                            <h2 className="text-base font-semibold text-text">
                              <bdi>{displayName}</bdi>
                            </h2>
                            <ArrowRight
                              className="mt-1 size-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                              aria-hidden
                            />
                          </div>

                          {displayRole ? (
                            <p className="text-xs font-medium text-primary">
                              <bdi>{displayRole}</bdi>
                            </p>
                          ) : null}

                          <p className="mt-0.5 text-sm leading-relaxed text-muted">
                            {pickLocale(member.focus, locale)}
                          </p>

                          {(member.stack.length > 0 || member.placeholder) ? (
                            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-[11px] text-muted">
                              {member.stack.length > 0 ? (
                                <div dir="ltr" className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                  {member.stack.slice(0, 3).map((item, stackIdx) => (
                                    <span key={item} className="inline-flex items-center gap-1.5">
                                      {stackIdx > 0 ? <span aria-hidden>·</span> : null}
                                      <span>{item}</span>
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span />
                              )}
                              {member.placeholder ? (
                                <span className="text-[11px] uppercase tracking-wider rtl:tracking-normal text-muted">
                                  {t("placeholder")}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </div>

                        <Link
                          href={`/team/${member.slug}`}
                          aria-label={displayRole ? `${displayName} — ${displayRole}` : displayName}
                          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2"
                        />
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <Cta content={content} />
    </>
  );
}