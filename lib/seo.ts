import type { Metadata } from "next";

export type Locale = "ar" | "en";

export function toLocale(value: string): Locale {
  return value === "en" ? "en" : "ar";
}

export function localePath(locale: string, path: string): string {
  return `/${toLocale(locale)}${path}`;
}

export function alternatesFor(locale: string, path: string) {
  const l = toLocale(locale);
  return {
    canonical: `/${l}${path}`,
    languages: {
      ar: `/ar${path}`,
      en: `/en${path}`,
    },
  };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  siteName,
  image,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  siteName?: string;
  image?: string;
}): Metadata {
  const l = toLocale(locale);
  const resolvedSiteName = siteName ?? (l === "ar" ? "نكست سوفت" : "Next Soft");
  const resolvedImage = image ?? "/og-cover.jpg";

  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type,
      title,
      description,
      siteName: resolvedSiteName,
      locale: l === "ar" ? "ar_YE" : "en_US",
      alternateLocale: l === "ar" ? ["en_US"] : ["ar_YE"],
      url: `/${l}${path}`,
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: image ? 1200 : 675,
          alt: `${title} — ${resolvedSiteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedImage],
    },
  };
}

export function breadcrumbItems(
  locale: string,
  items: { name: string; path: string }[],
) {
  const l = toLocale(locale);

  return items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `/${l}${item.path}`,
  }));
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems(locale, items),
  };
}