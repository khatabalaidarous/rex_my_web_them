import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="absolute inset-0 -z-10 grid-backdrop opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 start-1/3 -z-10 h-72 w-[34rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_20%,transparent),transparent)]"
      />

      <div className="container-page flex flex-col gap-5 pt-12 pb-16 sm:pt-16 sm:pb-20">
        {breadcrumbs}
        <span className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-primary">
          <span aria-hidden className="h-px w-4 bg-primary/70" />
          {eyebrow}
        </span>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.15] sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-pretty text-muted sm:text-lg">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}