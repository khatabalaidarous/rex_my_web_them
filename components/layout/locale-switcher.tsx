"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const options = [
  { code: "ar", label: "ع" },
  { code: "en", label: "EN" },
] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="flex items-center gap-0.5 rounded-full border border-border p-0.5"
    >
      {options.map((option) => {
        const active = locale === option.code;
        return (
          <Link
            key={option.code}
            href={pathname}
            locale={option.code}
            scroll={false}
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors",
              active
                ? "bg-primary text-primary-fg"
                : "text-muted hover:bg-surface hover:text-text",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}