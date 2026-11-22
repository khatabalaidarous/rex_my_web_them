import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { formatCmsError, slugifyAscii } from "@/components/studio/studio-helpers";
import { navItems, pickLocale, projects, resolveMemberAvatar, services, site, team } from "@/content/site";
import { isBootstrapAdminEmail } from "@/lib/firebase/client";
import { matchesSearchQuery, normalizeSearchText } from "@/lib/search";
import { alternatesFor, breadcrumbItems, pageMetadata, toLocale } from "@/lib/seo";

describe("SEO & localization helpers", () => {
  it("normalizes unsupported locales to Arabic default", () => {
    expect(toLocale("en")).toBe("en");
    expect(toLocale("ar")).toBe("ar");
    expect(toLocale("fr")).toBe("ar");
  });

  it("builds hreflang alternates and canonical paths", () => {
    expect(alternatesFor("ar", "/work")).toEqual({
      canonical: "/ar/work",
      languages: { ar: "/ar/work", en: "/en/work" },
    });
  });

  it("produces OpenGraph locale metadata and share card image accurately", () => {
    const arMeta = pageMetadata({
      locale: "ar",
      path: "/services",
      title: "الخدمات",
      description: "وصف الخدمات",
    });
    expect(arMeta.openGraph?.locale).toBe("ar_YE");
    expect(arMeta.openGraph?.images).toBeDefined();
    expect(arMeta.twitter?.images).toEqual(["/og-cover.jpg"]);

    const enMeta = pageMetadata({
      locale: "en",
      path: "/services",
      title: "Services",
      description: "Services overview",
    });
    expect(enMeta.openGraph?.locale).toBe("en_US");
  });

  it("disallows studio admin routes and api endpoints in robots.txt", () => {
    const config = robots();
    const rule = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    expect(rule.disallow).toEqual(["/ar/studio", "/en/studio", "/api/"]);
  });

  it("builds 1-indexed Schema.org breadcrumb items", () => {
    const items = breadcrumbItems("en", [
      { name: "Home", path: "" },
      { name: "Work", path: "/work" },
    ]);
    expect(items[0].position).toBe(1);
    expect(items[1].item).toBe("/en/work");
  });

  it("keeps Next Soft bilingual fallback data complete for both locales", () => {
    expect(pickLocale(site.name, "ar")).toBe("نكست سوفت");
    expect(pickLocale(site.name, "en")).toBe("Next Soft");
    expect(services.length).toBeGreaterThanOrEqual(4);
    expect(projects.every((p) => p.slug && p.title.ar && p.title.en)).toBe(true);
    expect(
      team.every((m) => m.slug && m.name?.ar && m.name?.en && m.role.ar && m.role.en),
    ).toBe(true);
  });

  it("normalizes Arabic alef, diacritics, and multi-token search queries", () => {
    expect(normalizeSearchText("أَعْمَالُنَا المميّزة")).toBe("اعمالنا المميزه");
    expect(matchesSearchQuery("تطوير تطبيقات الويب بـ Next.js", "تطوير ويب")).toBe(true);
    expect(matchesSearchQuery("إدارة المحتوى الرقمي", "اداره محتوي")).toBe(true);
    expect(matchesSearchQuery("تطوير تطبيقات الويب", "تطبيق جوال")).toBe(false);
  });

  it("authorizes bootstrap admin emails case-insensitively and rejects others", () => {
    expect(isBootstrapAdminEmail("abduarahman.naif.ali@gmail.com")).toBe(true);
    expect(isBootstrapAdminEmail(" ABDUARAHMAN.NAIF.ALI@GMAIL.COM ")).toBe(true);
    expect(isBootstrapAdminEmail("abdelrahmandevcode@gmail.com")).toBe(true);
    expect(isBootstrapAdminEmail("someone@example.com")).toBe(false);
    expect(isBootstrapAdminEmail(null)).toBe(false);
  });

  it("normalizes ASCII slugs cleanly", () => {
    expect(slugifyAscii("  My New Project!  ")).toBe("my-new-project");
    expect(slugifyAscii("___", "item")).toBe("___");
    expect(slugifyAscii("مرحبا", "post")).toMatch(/^post-/);
  });

  it("includes team and blog in primary top navigation items", () => {
    const hrefs = navItems.map((item) => item.href);
    expect(hrefs).toEqual(["/", "/services", "/work", "/team", "/blog", "/about"]);
  });

  it("resolves local, data-URL, HTTPS, and fallback team member portraits", () => {
    expect(resolveMemberAvatar("front-end", "/images/team/custom.jpg")).toBe("/images/team/custom.jpg");
    expect(resolveMemberAvatar("front-end", "data:image/webp;base64,abc")).toBe(
      "data:image/webp;base64,abc",
    );
    expect(resolveMemberAvatar("front-end", "https://cdn.example.com/p.jpg")).toBe(
      "https://cdn.example.com/p.jpg",
    );
    expect(resolveMemberAvatar("front-end", "")).toBe("/images/team/front-end.jpg");
  });

  it("formats Firestore permission and quota errors clearly", () => {
    const permErr = new Error(JSON.stringify({ error: "Missing or insufficient permissions." }));
    expect(formatCmsError("فشل الحفظ", permErr, true)).toContain("الصلاحية");
    const quotaErr = new Error("Quota exceeded.");
    expect(formatCmsError("Save failed", quotaErr, false)).toContain("quota");
  });
});
