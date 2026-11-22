import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { pickLocale } from "@/content/site";
import { getHomeContent } from "@/lib/data";
import { Hero } from "@/components/sections/hero";
import { Sectors } from "@/components/sections/sectors";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { Process } from "@/components/sections/process";
import { Stats } from "@/components/sections/stats";
import { TechStack } from "@/components/sections/tech-stack";
import { TeamPreview } from "@/components/sections/team-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const content = await getHomeContent(locale);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: pickLocale(faq.q, locale),
      acceptedAnswer: {
        "@type": "Answer",
        text: pickLocale(faq.a, locale),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero content={content} />
      <Sectors items={content.sectors} locale={locale} />
      <Services content={content} />
      <Work content={content} />
      <Process content={content} />
      <Stats content={content} />
      <TechStack content={content} />
      <TeamPreview members={content.team} locale={locale} />
      <Testimonials items={content.testimonials} />
      <BlogPreview posts={content.posts} locale={locale} />
      <Faq content={content} />
      <Cta content={content} />
    </>
  );
}