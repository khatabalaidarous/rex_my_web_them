import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/routing";
import {
  aboutMission,
  aboutSecondary,
  faqs as faqsContent,
  legalContent,
  navItems,
  pickLocale,
  posts as postsContent,
  process as processContent,
  projects as projectsContent,
  resolveMemberAvatar,
  sectors as sectorsContent,
  services as servicesContent,
  site as siteContent,
  stats,
  team as teamContent,
  techStack as techStackContent,
  testimonials as testimonialsContent,
  type Faq,
  type LegalPage,
  type Localized,
  type Member,
  type NavItem,
  type Post,
  type Project,
  type Sector,
  type Service,
  type SiteMeta,
  type Stat,
  type Step,
  type Tech,
  type Testimonial,
} from "@/content/site";
import {
  fetchCollectionFromDb,
  fetchDocByIdFromDb,
  fetchSiteSettingsFromDb,
  type SiteSettingsDoc,
} from "@/lib/firebase/cms";

export type ExtendedSiteMeta = SiteMeta & {
  aboutMission?: Localized;
  aboutSecondary?: Localized;
  stats?: Stat[];
  process?: Step[];
};

export type HomeContent = {
  site: ExtendedSiteMeta;
  nav: NavItem[];
  services: Service[];
  projects: Project[];
  process: Step[];
  stats: Stat[];
  techStack: Tech[];
  faqs: Faq[];
  team: Member[];
  posts: Post[];
  testimonials: Testimonial[];
  sectors: Sector[];
  locale: Locale;
};

export const getSite = unstable_cache(
  async (): Promise<ExtendedSiteMeta> => {
    const remote: SiteSettingsDoc | null = await fetchSiteSettingsFromDb();
    if (!remote) {
      return {
        ...siteContent,
        aboutMission,
        aboutSecondary,
        stats,
        process: processContent,
      };
    }
    const whatsapp =
      !remote.whatsapp || remote.whatsapp === "10000000000"
        ? siteContent.whatsapp
        : remote.whatsapp;
    const location =
      !remote.location || remote.location.ar === "الرياض، السعودية"
        ? siteContent.location
        : remote.location;
    const name =
      !remote.name ||
      remote.name.en === "CodeNest" ||
      remote.name.en === "NextSoft" ||
      remote.name.ar === "كود نست" ||
      remote.name.ar === "نيكست سوفت"
        ? siteContent.name
        : remote.name;
    const legalName =
      !remote.legalName ||
      remote.legalName.en === "CodeNest Technology" ||
      remote.legalName.en === "NextSoft Technology" ||
      remote.legalName.ar === "كود نست للتقنية" ||
      remote.legalName.ar === "نيكست سوفت للتقنية"
        ? siteContent.legalName
        : remote.legalName;
    const email =
      !remote.email || remote.email === "hello@codenest.example"
        ? siteContent.email
        : remote.email;
    const resolvedAboutMission =
      !remote.aboutMission ||
      remote.aboutMission.en.startsWith("CodeNest ") ||
      remote.aboutMission.ar.startsWith("كود نست ")
        ? aboutMission
        : remote.aboutMission;
    const logoUrl =
      typeof remote.logoUrl === "string" && remote.logoUrl.trim().length > 0
        ? remote.logoUrl.trim()
        : undefined;
    return {
      ...siteContent,
      ...remote,
      logoUrl,
      name,
      legalName,
      email,
      whatsapp,
      location,
      aboutMission: resolvedAboutMission,
      aboutSecondary: remote.aboutSecondary ?? aboutSecondary,
      stats: remote.stats ?? stats,
      process: remote.process ?? processContent,
    };
  },
  ["cms-site-v5"],
  { revalidate: 3600, tags: ["site"] },
);

export const getServices = unstable_cache(
  async (): Promise<Service[]> => {
    const remote = await fetchCollectionFromDb<Service & { order?: number }>("services", "order", "asc");
    if (remote.length === 0) return servicesContent;
    return remote.map(({ icon, title, description }) => ({ icon, title, description }));
  },
  ["cms-services"],
  { revalidate: 3600, tags: ["services"] },
);

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const remote = await fetchCollectionFromDb<Project>("projects", "year", "desc");
    if (remote.length === 0) return projectsContent;
    return remote.map((p) => ({
      slug: p.slug || p.id,
      title: p.title,
      summary: p.summary,
      category: p.category,
      year: p.year,
      client: p.client,
      role: p.role,
      duration: p.duration,
      challenge: p.challenge,
      solution: p.solution,
      results: p.results,
      stack: p.stack,
      placeholder: p.placeholder,
    }));
  },
  ["cms-projects"],
  { revalidate: 3600, tags: ["projects"] },
);

export const getProject = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    const remote = await fetchDocByIdFromDb<Project>("projects", slug);
    if (remote) return remote;
    const all = await getProjects();
    return all.find((project) => project.slug === slug) ?? null;
  },
  ["cms-project"],
  { revalidate: 3600, tags: ["projects"] },
);

export const getPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const remote = await fetchCollectionFromDb<Post>("posts", "date", "desc");
    if (remote.length === 0) return postsContent;
    return remote.map((p) => ({
      slug: p.slug || p.id,
      title: p.title,
      excerpt: p.excerpt,
      tag: p.tag,
      date: p.date,
      readingMinutes: p.readingMinutes,
      body: p.body,
      placeholder: p.placeholder,
    }));
  },
  ["cms-posts"],
  { revalidate: 3600, tags: ["posts"] },
);

export const getPost = unstable_cache(
  async (slug: string): Promise<Post | null> => {
    const remote = await fetchDocByIdFromDb<Post>("posts", slug);
    if (remote) return remote;
    const all = await getPosts();
    return all.find((post) => post.slug === slug) ?? null;
  },
  ["cms-post"],
  { revalidate: 3600, tags: ["posts"] },
);

export const getTeam = unstable_cache(
  async (): Promise<Member[]> => {
    const remote = await fetchCollectionFromDb<Member & { order?: number }>("team", "order", "asc");
    if (remote.length === 0) return teamContent;
    return remote.map((m) => {
      const slug = m.slug || m.id;
      return {
        slug,
        initials: m.initials,
        name: m.name,
        avatar: resolveMemberAvatar(slug, m.avatar),
        role: m.role,
        focus: m.focus,
        responsibilities: m.responsibilities,
        stack: m.stack,
        placeholder: m.placeholder,
      };
    });
  },
  ["cms-team-v3"],
  { revalidate: 3600, tags: ["team"] },
);

export const getMember = unstable_cache(
  async (slug: string): Promise<Member | null> => {
    const remote = await fetchDocByIdFromDb<Member>("team", slug);
    if (remote) {
      return {
        ...remote,
        avatar: resolveMemberAvatar(remote.slug || slug, remote.avatar),
      };
    }
    const all = await getTeam();
    return all.find((member) => member.slug === slug) ?? null;
  },
  ["cms-member-v3"],
  { revalidate: 3600, tags: ["team"] },
);

export const getTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const remote = await fetchCollectionFromDb<Testimonial & { order?: number }>(
      "testimonials",
      "order",
      "asc",
    );
    if (remote.length === 0) return testimonialsContent;
    return remote.map(({ quote, role, initials, placeholder }) => ({
      quote,
      role,
      initials,
      placeholder,
    }));
  },
  ["cms-testimonials"],
  { revalidate: 3600, tags: ["testimonials"] },
);

export const getSectors = unstable_cache(
  async (): Promise<Sector[]> => {
    const remote = await fetchCollectionFromDb<Sector & { order?: number }>("sectors", "order", "asc");
    if (remote.length === 0) return sectorsContent;
    return remote.map(({ icon, label }) => ({ icon, label }));
  },
  ["cms-sectors"],
  { revalidate: 3600, tags: ["sectors"] },
);

export const getTechStack = unstable_cache(
  async (): Promise<Tech[]> => {
    const remote = await fetchCollectionFromDb<Tech>("techStack", "name", "asc");
    if (remote.length === 0) return techStackContent;
    return remote.map(({ name, group, category, description, accent }) => ({
      name,
      group,
      category,
      description,
      accent,
    }));
  },
  ["cms-tech"],
  { revalidate: 3600, tags: ["tech"] },
);

export const getFaqs = unstable_cache(
  async (): Promise<Faq[]> => {
    const remote = await fetchCollectionFromDb<Faq & { order?: number }>("faqs", "order", "asc");
    if (remote.length === 0) return faqsContent;
    return remote.map(({ q, a }) => ({ q, a }));
  },
  ["cms-faqs"],
  { revalidate: 3600, tags: ["faqs"] },
);

export const getLegal = unstable_cache(
  async (kind: "privacy" | "terms"): Promise<LegalPage> => {
    const remote = await fetchDocByIdFromDb<LegalPage>("legal", kind);
    return remote ?? legalContent[kind];
  },
  ["cms-legal"],
  { revalidate: 3600, tags: ["legal"] },
);

export async function getHomeContent(locale: Locale): Promise<HomeContent> {
  const [site, services, projects, team, posts, testimonials, sectors, techStack, faqs] =
    await Promise.all([
      getSite(),
      getServices(),
      getProjects(),
      getTeam(),
      getPosts(),
      getTestimonials(),
      getSectors(),
      getTechStack(),
      getFaqs(),
    ]);

  return {
    site,
    nav: navItems,
    services,
    projects,
    process: site.process ?? processContent,
    stats: site.stats ?? stats,
    techStack,
    faqs,
    team,
    posts,
    testimonials,
    sectors,
    locale,
  };
}

export { pickLocale };
export type {
  Faq,
  LegalPage,
  Member,
  NavItem,
  Post,
  Project,
  Sector,
  Service,
  SiteMeta,
  Stat,
  Step,
  Tech,
  Testimonial,
};