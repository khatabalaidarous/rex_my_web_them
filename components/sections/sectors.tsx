import { getTranslations } from "next-intl/server";
import {
  BookOpen,
  Building2,
  Cpu,
  HeartPulse,
  Landmark,
  Plane,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { pickLocale, type Sector } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/motion/reveal";

const icons = {
  cart: ShoppingCart,
  cpu: Cpu,
  book: BookOpen,
  heart: HeartPulse,
  bank: Landmark,
  truck: Truck,
  building: Building2,
  plane: Plane,
} satisfies Record<Sector["icon"], typeof Cpu>;

export async function Sectors({
  items,
  locale,
}: {
  items: Sector[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "sectors" });
  if (items.length === 0) return null;

  return (
    <section className="border-y border-border bg-bg-elevated py-10">
      <div className="container-page flex flex-col gap-6">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold">{t("title")}</h2>
            <p className="text-xs text-muted">{t("subtitle")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.05} y={16}>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:gap-3">
            {items.map((sector, index) => {
              const Icon = icons[sector.icon];
              return (
                <li
                  key={`${sector.icon}-${index}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted transition-colors duration-200 hover:border-primary/40 hover:bg-surface-2 hover:text-text"
                >
                  <Icon
                    className="size-4 shrink-0 text-primary transition-transform duration-200 group-hover:scale-110"
                    aria-hidden
                  />
                  <span className="truncate font-medium">{pickLocale(sector.label, locale)}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}