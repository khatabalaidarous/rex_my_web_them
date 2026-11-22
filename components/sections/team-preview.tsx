import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TeamPortrait } from "@/components/ui/team-portrait";
import { Link } from "@/i18n/navigation";
import { pickLocale, resolveMemberAvatar, type Member } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { buttonClass } from "@/components/ui/button";

export async function TeamPreview({
  members,
  locale,
}: {
  members: Member[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "team" });
  if (members.length === 0) return null;

  return (
    <section className="section border-y border-border bg-bg-elevated">
      <div className="container-page flex flex-col gap-10">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("homeTitle")}
              subtitle={t("homeSubtitle")}
            />
            <Link href="/team" className={buttonClass("outline", "md", "w-fit shrink-0 whitespace-nowrap")}>
              {t("homeCta")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => {
            const displayName = member.name ? pickLocale(member.name, locale) : pickLocale(member.role, locale);
            const displayRole = member.name ? pickLocale(member.role, locale) : null;
            const avatar = resolveMemberAvatar(member.slug, member.avatar);
            return (
              <li key={member.slug} className="h-full">
                <Reveal delay={index * 0.05} y={24} className="h-full">
                  <Link
                    href={`/team/${member.slug}`}
                    className="gradient-border surface-card group flex h-full flex-col gap-4 p-4 transition-colors duration-300 hover:border-primary/40 hover:bg-surface-2"
                  >
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
                        <h3 className="text-base font-semibold text-text">
                          <bdi>{displayName}</bdi>
                        </h3>
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
                      <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-muted">
                        {pickLocale(member.focus, locale)}
                      </p>

                      {member.stack.length > 0 ? (
                        <div
                          dir="ltr"
                          className="mt-auto flex flex-wrap items-center gap-x-1.5 gap-y-0.5 border-t border-border/70 pt-3 text-[11px] text-muted"
                        >
                          {member.stack.slice(0, 3).map((item, stackIdx) => (
                            <span key={item} className="inline-flex items-center gap-1.5">
                              {stackIdx > 0 ? <span aria-hidden>·</span> : null}
                              <span>{item}</span>
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}