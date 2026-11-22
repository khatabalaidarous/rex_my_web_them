import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-primary">
          <span aria-hidden className="h-px w-4 bg-primary/70" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="max-w-2xl text-balance text-3xl font-semibold sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="max-w-2xl text-pretty text-muted sm:text-lg">{subtitle}</p>
      ) : null}
      {children}
    </div>
  );
}