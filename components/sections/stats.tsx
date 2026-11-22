import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { pickLocale, type HomeContent } from "@/lib/data";

export async function Stats({ content }: { content: HomeContent }) {
  const { locale } = content;
  if (content.stats.length === 0) return null;

  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="container-page grid grid-cols-2 divide-border lg:grid-cols-4 lg:divide-x rtl:lg:divide-x-reverse">
        {content.stats.map((stat, index) => (
          <Reveal
            key={`${stat.label.en}-${index}`}
            delay={index * 0.06}
            y={20}
            className="flex flex-col gap-1.5 border-b border-border/60 py-8 pe-4 sm:py-12 [&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:px-6 lg:first:ps-0 lg:last:pe-0"
          >
            <span
              dir="ltr"
              className="w-fit text-3xl font-semibold tracking-tight tabular-nums text-text sm:text-4xl"
            >
              <Counter value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="text-sm text-muted">{pickLocale(stat.label, locale)}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}