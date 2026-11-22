"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("common");
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDark = !mounted || resolvedTheme !== "light";
  const label = `${t("theme")}: ${isDark ? t("dark") : t("light")}`;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-pressed={mounted ? !isDark : undefined}
      aria-label={label}
      title={label}
      className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface hover:text-text"
    >
      {mounted && !isDark ? (
        <Moon className="size-4" aria-hidden />
      ) : (
        <Sun className="size-4" aria-hidden />
      )}
    </button>
  );
}