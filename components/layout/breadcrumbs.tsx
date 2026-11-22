import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-text">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-text" : undefined}>
                  {item.label}
                </span>
              )}
              {isLast ? null : (
                <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}