import type { MetadataRoute } from "next";
import { getHomeContent } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const baseUrl = siteUrl;

const primaryRoutes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "weekly" },
  { path: "/work", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.85, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
  { path: "/team", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.85, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getHomeContent("ar");
  const now = new Date();

  const detailRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    ...content.projects.map((project) => ({
      path: `/work/${project.slug}`,
      priority: 0.78,
      changeFrequency: "monthly" as const,
    })),
    ...content.posts.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: 0.75,
      changeFrequency: "monthly" as const,
    })),
    ...content.team.map((member) => ({
      path: `/team/${member.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

  const allRoutes = [...primaryRoutes, ...detailRoutes];

  return (["ar", "en"] as const).flatMap((locale) =>
    allRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar${route.path}`,
          en: `${baseUrl}/en${route.path}`,
        },
      },
    })),
  );
}