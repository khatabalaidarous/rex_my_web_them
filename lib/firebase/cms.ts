import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import {
  aboutMission,
  aboutSecondary,
  faqs as defaultFaqs,
  legalContent as defaultLegal,
  posts as defaultPosts,
  process as defaultProcess,
  projects as defaultProjects,
  sectors as defaultSectors,
  services as defaultServices,
  site as defaultSite,
  stats as defaultStats,
  team as defaultTeam,
  techStack as defaultTechStack,
  testimonials as defaultTestimonials,
  type Faq,
  type LegalPage,
  type Localized,
  type Member,
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
import { db, handleFirestoreError, OperationType } from "./client";

export type SiteSettingsDoc = SiteMeta & {
  aboutMission?: Localized;
  aboutSecondary?: Localized;
  stats?: Stat[];
  process?: Step[];
};

export type ServiceDoc = Service & { id: string; order: number };
export type ProjectDoc = Project;
export type PostDoc = Post;
export type MemberDoc = Member & { order: number };
export type TestimonialDoc = Testimonial & { id: string; order: number };
export type SectorDoc = Sector & { id: string; order: number };
export type TechDoc = Tech & { id: string };
export type FaqDoc = Faq & { id: string; order: number };
export type LegalDoc = LegalPage & { key: "privacy" | "terms" };

export type ContactStatus = "new" | "in_review" | "replied" | "archived";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  status: ContactStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

function formatTimestamp(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate().toISOString();
  }
  return new Date().toISOString();
}

function isLegacyName(val: Localized | undefined): boolean {
  return !val || val.en === "CodeNest" || val.en === "NextSoft" || val.ar === "كود نست" || val.ar === "نيكست سوفت";
}

function isLegacyLegalName(val: Localized | undefined): boolean {
  return (
    !val ||
    val.en === "CodeNest Technology" ||
    val.en === "NextSoft Technology" ||
    val.ar === "كود نست للتقنية" ||
    val.ar === "نيكست سوفت للتقنية"
  );
}

function isLegacyAboutMission(val: Localized | undefined): boolean {
  return !val || val.en.startsWith("CodeNest ") || val.ar.startsWith("كود نست ");
}

function normalizeSiteSettingsData(data: Record<string, unknown>): SiteSettingsDoc {
  const rawWhatsapp = typeof data.whatsapp === "string" ? data.whatsapp.trim() : "";
  const whatsapp =
    !rawWhatsapp || rawWhatsapp === "10000000000" ? defaultSite.whatsapp : rawWhatsapp;
  const rawLocation = data.location as Localized | undefined;
  const location =
    !rawLocation || rawLocation.ar === "الرياض، السعودية" ? defaultSite.location : rawLocation;
  const rawName = data.name as Localized | undefined;
  const name = isLegacyName(rawName) ? defaultSite.name : (rawName as Localized);
  const rawLegalName = data.legalName as Localized | undefined;
  const legalName = isLegacyLegalName(rawLegalName)
    ? defaultSite.legalName
    : (rawLegalName as Localized);
  const rawEmail = typeof data.email === "string" ? data.email.trim() : "";
  const email =
    !rawEmail || rawEmail === "hello@codenest.example" ? defaultSite.email : rawEmail;
  const rawAboutMission = data.aboutMission as Localized | undefined;
  const resolvedAboutMission = isLegacyAboutMission(rawAboutMission)
    ? aboutMission
    : rawAboutMission;

  const rawLogoUrl = typeof data.logoUrl === "string" ? data.logoUrl.trim().slice(0, 120000) : "";

  return {
    name,
    legalName,
    tagline: (data.tagline as Localized | undefined) ?? defaultSite.tagline,
    shortTagline: (data.shortTagline as Localized | undefined) ?? defaultSite.shortTagline,
    logoUrl: rawLogoUrl || undefined,
    email,
    whatsapp,
    location,
    socials: Array.isArray(data.socials) ? data.socials : defaultSite.socials,
    aboutMission: resolvedAboutMission,
    aboutSecondary: (data.aboutSecondary as Localized | undefined) ?? aboutSecondary,
    stats: Array.isArray(data.stats) ? data.stats : defaultStats,
    process: Array.isArray(data.process) ? data.process : defaultProcess,
  };
}

export async function fetchSiteSettingsFromDb(): Promise<SiteSettingsDoc | null> {
  try {
    const snap = await getDoc(doc(db, "siteSettings", "main"));
    if (!snap.exists()) return null;
    return normalizeSiteSettingsData(snap.data() as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function syncLegacySiteSettingsInFirestore(): Promise<boolean> {
  const path = "siteSettings/main";
  try {
    const snap = await getDoc(doc(db, "siteSettings", "main"));
    if (!snap.exists()) return false;
    const data = snap.data() as Record<string, unknown>;
    const rawWhatsapp = typeof data.whatsapp === "string" ? data.whatsapp.trim() : "";
    const rawLocation = data.location as Localized | undefined;
    const rawEmail = typeof data.email === "string" ? data.email.trim() : "";
    const needsSync =
      !rawWhatsapp ||
      rawWhatsapp === "10000000000" ||
      !rawLocation ||
      rawLocation.ar === "الرياض، السعودية" ||
      !rawEmail ||
      rawEmail === "hello@codenest.example" ||
      isLegacyName(data.name as Localized | undefined) ||
      isLegacyLegalName(data.legalName as Localized | undefined) ||
      isLegacyAboutMission(data.aboutMission as Localized | undefined);

    if (!needsSync) return false;
    const cleaned = normalizeSiteSettingsData(data);
    await saveSiteSettings(cleaned);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function fetchCollectionFromDb<T>(
  collectionName: string,
  orderField?: string,
  direction: "asc" | "desc" = "asc",
): Promise<(T & { id: string })[]> {
  try {
    const ref = collection(db, collectionName);
    const q = orderField ? query(ref, orderBy(orderField, direction)) : ref;
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      ...(d.data() as T),
      id: d.id,
    }));
  } catch {
    return [];
  }
}

export async function fetchDocByIdFromDb<T>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  try {
    const snap = await getDoc(doc(db, collectionName, id));
    if (!snap.exists()) return null;
    return snap.data() as T;
  } catch {
    return null;
  }
}

function cleanLocalized(val: Localized | undefined, maxLen: number): Localized | null {
  const ar = typeof val?.ar === "string" ? val.ar.trim().slice(0, maxLen) : "";
  const en = typeof val?.en === "string" ? val.en.trim().slice(0, maxLen) : "";
  if (!ar || !en) return null;
  return { ar, en };
}

export async function saveSiteSettings(payload: SiteSettingsDoc): Promise<void> {
  const path = "siteSettings/main";
  try {
    const logoTrimmed =
      typeof payload.logoUrl === "string" ? payload.logoUrl.trim().slice(0, 120000) : "";
    const name = cleanLocalized(payload.name, 120) ?? defaultSite.name;
    const legalName = cleanLocalized(payload.legalName, 160) ?? defaultSite.legalName;
    const tagline = cleanLocalized(payload.tagline, 240) ?? defaultSite.tagline;
    const shortTagline = cleanLocalized(payload.shortTagline, 80) ?? defaultSite.shortTagline;
    const location = cleanLocalized(payload.location, 160) ?? defaultSite.location;

    const data: Record<string, unknown> = {
      name,
      legalName,
      tagline,
      shortTagline,
      email: payload.email.trim().slice(0, 160),
      whatsapp: payload.whatsapp.trim().slice(0, 32),
      location,
      socials: payload.socials
        .slice(0, 10)
        .map((s) => ({
          label: String(s.label ?? "").trim().slice(0, 80),
          href: String(s.href ?? "").trim().slice(0, 400),
        }))
        .filter((s) => s.label && s.href),
      updatedAt: serverTimestamp(),
    };

    if (logoTrimmed) data.logoUrl = logoTrimmed;

    const cleanMission = cleanLocalized(payload.aboutMission, 1000);
    if (cleanMission) data.aboutMission = cleanMission;

    const cleanSecondary = cleanLocalized(payload.aboutSecondary, 1000);
    if (cleanSecondary) data.aboutSecondary = cleanSecondary;

    if (Array.isArray(payload.stats)) {
      data.stats = payload.stats
        .slice(0, 8)
        .map((item) => {
          const label = cleanLocalized(item.label, 120);
          const value = String(item.value ?? "").trim().slice(0, 20);
          if (!label || !value) return null;
          return {
            value,
            suffix: String(item.suffix ?? "").trim().slice(0, 12),
            label,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
    }

    if (Array.isArray(payload.process)) {
      data.process = payload.process
        .slice(0, 8)
        .map((item) => {
          const number = String(item.number ?? "").trim().slice(0, 10);
          const title = cleanLocalized(item.title, 120);
          const description = cleanLocalized(item.description, 500);
          if (!number || !title || !description) return null;
          return { number, title, description };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
    }

    await setDoc(doc(db, "siteSettings", "main"), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveService(id: string, payload: Omit<ServiceDoc, "id">): Promise<void> {
  const path = `services/${id}`;
  try {
    await setDoc(doc(db, "services", id), {
      order: Number(payload.order) || 0,
      icon: payload.icon,
      title: payload.title,
      description: payload.description,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveProject(payload: Project): Promise<void> {
  const path = `projects/${payload.slug}`;
  try {
    await setDoc(doc(db, "projects", payload.slug), {
      slug: payload.slug,
      title: payload.title,
      summary: payload.summary,
      category: payload.category,
      year: payload.year,
      client: payload.client,
      role: payload.role,
      duration: payload.duration,
      challenge: payload.challenge,
      solution: payload.solution,
      results: payload.results.slice(0, 10),
      stack: payload.stack.slice(0, 20),
      placeholder: Boolean(payload.placeholder),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function savePost(payload: Post): Promise<void> {
  const path = `posts/${payload.slug}`;
  try {
    await setDoc(doc(db, "posts", payload.slug), {
      slug: payload.slug,
      title: payload.title,
      excerpt: payload.excerpt,
      tag: payload.tag,
      date: payload.date,
      readingMinutes: Number(payload.readingMinutes) || 1,
      body: payload.body.slice(0, 50),
      placeholder: Boolean(payload.placeholder),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveMember(payload: MemberDoc): Promise<void> {
  const path = `team/${payload.slug}`;
  try {
    const data: Record<string, unknown> = {
      slug: payload.slug,
      order: Number(payload.order) || 0,
      initials: payload.initials.slice(0, 6),
      role: payload.role,
      focus: payload.focus,
      responsibilities: payload.responsibilities.slice(0, 15),
      stack: payload.stack.slice(0, 20),
      placeholder: Boolean(payload.placeholder),
      updatedAt: serverTimestamp(),
    };
    if (payload.name?.ar?.trim() && payload.name?.en?.trim()) {
      data.name = { ar: payload.name.ar.trim(), en: payload.name.en.trim() };
    }
    const avatarTrimmed = typeof payload.avatar === "string" ? payload.avatar.trim().slice(0, 120000) : "";
    if (avatarTrimmed) {
      data.avatar = avatarTrimmed;
    }
    await setDoc(doc(db, "team", payload.slug), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveTech(id: string, payload: Tech): Promise<void> {
  const path = `techStack/${id}`;
  try {
    await setDoc(doc(db, "techStack", id), {
      name: payload.name,
      group: payload.group,
      category: payload.category,
      description: payload.description,
      accent: payload.accent,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveFaq(id: string, payload: Omit<FaqDoc, "id">): Promise<void> {
  const path = `faqs/${id}`;
  try {
    await setDoc(doc(db, "faqs", id), {
      order: Number(payload.order) || 0,
      q: payload.q,
      a: payload.a,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveTestimonial(
  id: string,
  payload: Omit<TestimonialDoc, "id">,
): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    await setDoc(doc(db, "testimonials", id), {
      order: Number(payload.order) || 0,
      quote: payload.quote,
      role: payload.role,
      initials: payload.initials.slice(0, 6),
      placeholder: Boolean(payload.placeholder),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveSector(id: string, payload: Omit<SectorDoc, "id">): Promise<void> {
  const path = `sectors/${id}`;
  try {
    await setDoc(doc(db, "sectors", id), {
      order: Number(payload.order) || 0,
      icon: payload.icon,
      label: payload.label,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveLegal(key: "privacy" | "terms", payload: LegalPage): Promise<void> {
  const path = `legal/${key}`;
  try {
    await setDoc(doc(db, "legal", key), {
      key,
      updated: payload.updated,
      notice: payload.notice,
      intro: payload.intro,
      sections: payload.sections.slice(0, 20),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCmsDocument(collectionName: string, id: string): Promise<void> {
  const path = `${collectionName}/${id}`;
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateContactSubmission(
  id: string,
  status: ContactStatus,
  notes: string,
): Promise<void> {
  const path = `contactSubmissions/${id}`;
  try {
    await updateDoc(doc(db, "contactSubmissions", id), {
      status,
      notes: notes.slice(0, 1000),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const path = `contactSubmissions/${id}`;
  try {
    await deleteDoc(doc(db, "contactSubmissions", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function mapContactDoc(id: string, data: Record<string, unknown>): ContactSubmission {
  return {
    id,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    company: String(data.company ?? ""),
    message: String(data.message ?? ""),
    status: (data.status as ContactStatus) ?? "new",
    notes: String(data.notes ?? ""),
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
  };
}

function slugifyId(value: string, fallbackPrefix: string, index: number): string {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || `${fallbackPrefix}-${index + 1}`;
}

export async function seedDefaultContentToFirestore(): Promise<{ count: number }> {
  try {
    const batch = writeBatch(db);
    let count = 0;

    batch.set(doc(db, "siteSettings", "main"), {
      ...defaultSite,
      aboutMission,
      aboutSecondary,
      stats: defaultStats,
      process: defaultProcess,
      updatedAt: serverTimestamp(),
    });
    count++;

    defaultServices.forEach((service, index) => {
      batch.set(doc(db, "services", `service-${index + 1}`), {
        order: index + 1,
        icon: service.icon,
        title: service.title,
        description: service.description,
        updatedAt: serverTimestamp(),
      });
      count++;
    });

    defaultProjects.forEach((project) => {
      batch.set(doc(db, "projects", project.slug), {
        ...project,
        updatedAt: serverTimestamp(),
      });
      count++;
    });

    defaultPosts.forEach((post) => {
      batch.set(doc(db, "posts", post.slug), {
        ...post,
        updatedAt: serverTimestamp(),
      });
      count++;
    });

    defaultTeam.forEach((member, index) => {
      batch.set(doc(db, "team", member.slug), {
        ...member,
        order: index + 1,
        updatedAt: serverTimestamp(),
      });
      count++;
    });

    defaultTestimonials.forEach((testimonial, index) => {
      batch.set(doc(db, "testimonials", `testimonial-${index + 1}`), {
        ...testimonial,
        order: index + 1,
        updatedAt: serverTimestamp(),
      });
      count++;
    });

    defaultSectors.forEach((sector, index) => {
      batch.set(doc(db, "sectors", `sector-${index + 1}`), {
        ...sector,
        order: index + 1,
        updatedAt: serverTimestamp(),
      });
      count++;
    });

    defaultTechStack.forEach((tech, index) => {
      const id = slugifyId(tech.name, "tech", index);
      batch.set(doc(db, "techStack", id), {
        ...tech,
        updatedAt: serverTimestamp(),
      });
      count++;
    });

    defaultFaqs.forEach((faq, index) => {
      batch.set(doc(db, "faqs", `faq-${index + 1}`), {
        ...faq,
        order: index + 1,
        updatedAt: serverTimestamp(),
      });
      count++;
    });

    batch.set(doc(db, "legal", "privacy"), {
      key: "privacy",
      ...defaultLegal.privacy,
      updatedAt: serverTimestamp(),
    });
    count++;

    batch.set(doc(db, "legal", "terms"), {
      key: "terms",
      ...defaultLegal.terms,
      updatedAt: serverTimestamp(),
    });
    count++;

    await batch.commit();
    return { count };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "seed");
  }
}

export async function ensureAdminRecord(uid: string, email: string | null | undefined): Promise<void> {
  if (!uid || !email) return;
  const path = `admins/${uid}`;
  try {
    const ref = doc(db, "admins", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: email.trim().toLowerCase().slice(0, 160),
        role: "admin",
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
