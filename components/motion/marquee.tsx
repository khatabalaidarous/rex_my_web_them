import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
  itemClassName?: string;
  speed?: number;
  reverse?: boolean;
};

export function Marquee({
  items,
  className,
  itemClassName,
  speed = 46,
  reverse = false,
}: MarqueeProps) {
  const loop = [...items, ...items];

  return (
    <div
      className={cn(
        "marquee-mask relative flex w-full overflow-hidden",
        className,
      )}
    >
      <ul
        className={cn(
          "animate-marquee flex w-max items-center gap-10 hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {loop.map((item, index) => (
          <li
            key={`${item}-${index}`}
            aria-hidden={index >= items.length}
            className={cn("flex items-center gap-3 text-sm text-muted", itemClassName)}
          >
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary/70" />
            <span className="whitespace-nowrap">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}