"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Briefcase,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  Inbox,
  Layers,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  Scale,
  Settings,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import firebaseConfig from "@/firebase-applet-config.json";
import {
  aboutMission,
  aboutSecondary,
  legalContent,
  process as defaultProcess,
  site as defaultSite,
  stats as defaultStats,
  type LegalPage,
  type Post,
  type Project,
} from "@/content/site";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase/client";
import {
  deleteContactSubmission,
  ensureAdminRecord,
  fetchCollectionFromDb,
  fetchDocByIdFromDb,
  fetchSiteSettingsFromDb,
  mapContactDoc,
  seedDefaultContentToFirestore,
  syncLegacySiteSettingsInFirestore,
  updateContactSubmission,
  type ContactStatus,
  type ContactSubmission,
  type FaqDoc,
  type MemberDoc,
  type SectorDoc,
  type ServiceDoc,
  type SiteSettingsDoc,
  type TechDoc,
  type TestimonialDoc,
} from "@/lib/firebase/cms";
import { useFirebase } from "@/components/providers/firebase-provider";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/layout/brand-mark";
import { buttonClass } from "@/components/ui/button";
import {
  ExtrasEditor,
  LegalEditor,
  PostsEditor,
  ProjectsEditor,
  ServicesEditor,
  SiteSettingsEditor,
  TeamEditor,
  TechEditor,
} from "./cms-editors";
import {
  ConfirmDeleteButton,
  fieldInputClass,
  fieldTextareaClass,
  triggerRevalidation,
} from "./studio-helpers";

type TabKey =
  | "overview"
  | "inbox"
  | "settings"
  | "services"
  | "projects"
  | "posts"
  | "team"
  | "tech"
  | "extras"
  | "legal";

export function StudioDashboard() {
  const locale = useLocale();
  const ar = locale === "ar";
  const t = useTranslations("studio");
  const { user, authReady, isAdmin, dbConnected, authError, signInWithGoogle, signOut } =
    useFirebase();

  const [tab, setTab] = useState<TabKey>("overview");
  const [loadingData, setLoadingData] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [cmsVersion, setCmsVersion] = useState(0);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const bootstrappedRef = useRef<string | null>(null);

  // CMS State
  const [siteSettings, setSiteSettings] = useState<SiteSettingsDoc>({
    ...defaultSite,
    aboutMission,
    aboutSecondary,
    stats: defaultStats,
    process: defaultProcess,
  });
  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [team, setTeam] = useState<MemberDoc[]>([]);
  const [techs, setTechs] = useState<TechDoc[]>([]);
  const [sectors, setSectors] = useState<SectorDoc[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialDoc[]>([]);
  const [faqs, setFaqs] = useState<FaqDoc[]>([]);
  const [privacyDoc, setPrivacyDoc] = useState<LegalPage>(legalContent.privacy);
  const [termsDoc, setTermsDoc] = useState<LegalPage>(legalContent.terms);

  // Inbox State
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [inboxFilter, setInboxFilter] = useState<"all" | ContactStatus>("all");
  const [inboxSearch, setInboxSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { status: ContactStatus; notes: string }>>({});
  const [savingSubmission, setSavingSubmission] = useState(false);

  const notify = useCallback((msg: string, error = false) => {
    setToast({ msg, error });
    window.setTimeout(() => {
      setToast((prev) => (prev?.msg === msg ? null : prev));
    }, error ? 8000 : 4000);
  }, []);

  const fetchAllCmsSnapshot = useCallback(async () => {
    const [
      remoteSite,
      remoteServices,
      remoteProjects,
      remotePosts,
      remoteTeam,
      remoteTechs,
      remoteSectors,
      remoteTestimonials,
      remoteFaqs,
      remotePrivacy,
      remoteTerms,
    ] = await Promise.all([
      fetchSiteSettingsFromDb(),
      fetchCollectionFromDb<Omit<ServiceDoc, "id">>("services", "order", "asc"),
      fetchCollectionFromDb<Project>("projects", "year", "desc"),
      fetchCollectionFromDb<Post>("posts", "date", "desc"),
      fetchCollectionFromDb<MemberDoc>("team", "order", "asc"),
      fetchCollectionFromDb<Omit<TechDoc, "id">>("techStack", "name", "asc"),
      fetchCollectionFromDb<Omit<SectorDoc, "id">>("sectors", "order", "asc"),
      fetchCollectionFromDb<Omit<TestimonialDoc, "id">>("testimonials", "order", "asc"),
      fetchCollectionFromDb<Omit<FaqDoc, "id">>("faqs", "order", "asc"),
      fetchDocByIdFromDb<LegalPage>("legal", "privacy"),
      fetchDocByIdFromDb<LegalPage>("legal", "terms"),
    ]);

    return {
      remoteSite,
      remoteServices,
      remoteProjects,
      remotePosts,
      remoteTeam,
      remoteTechs,
      remoteSectors,
      remoteTestimonials,
      remoteFaqs,
      remotePrivacy,
      remoteTerms,
    };
  }, []);

  const applyCmsSnapshot = useCallback(
    (snapshot: Awaited<ReturnType<typeof fetchAllCmsSnapshot>>) => {
      if (snapshot.remoteSite) setSiteSettings(snapshot.remoteSite);
      setServices(snapshot.remoteServices);
      setProjects(snapshot.remoteProjects);
      setPosts(snapshot.remotePosts);
      setTeam(snapshot.remoteTeam);
      setTechs(snapshot.remoteTechs);
      setSectors(snapshot.remoteSectors);
      setTestimonials(snapshot.remoteTestimonials);
      setFaqs(snapshot.remoteFaqs);
      if (snapshot.remotePrivacy) setPrivacyDoc(snapshot.remotePrivacy);
      if (snapshot.remoteTerms) setTermsDoc(snapshot.remoteTerms);
      setCmsVersion((v) => v + 1);
    },
    [],
  );

  const loadAllCms = useCallback(async () => {
    setLoadingData(true);
    try {
      const snapshot = await fetchAllCmsSnapshot();
      applyCmsSnapshot(snapshot);
    } finally {
      setLoadingData(false);
    }
  }, [fetchAllCmsSnapshot, applyCmsSnapshot]);

  useEffect(() => {
    if (!authReady || !user || !isAdmin) return;

    let cancelled = false;

    const bootstrapSession = async () => {
      try {
        await ensureAdminRecord(user.uid, user.email);
      } catch {
        // Non-fatal if already handled by email allowlist
      }

      const snapshot = await fetchAllCmsSnapshot();
      if (cancelled) return;

      const isDbEmpty =
        !snapshot.remoteSite &&
        snapshot.remoteServices.length === 0 &&
        snapshot.remoteProjects.length === 0 &&
        snapshot.remotePosts.length === 0 &&
        snapshot.remoteTeam.length === 0 &&
        snapshot.remoteTechs.length === 0 &&
        snapshot.remoteSectors.length === 0 &&
        snapshot.remoteTestimonials.length === 0 &&
        snapshot.remoteFaqs.length === 0 &&
        !snapshot.remotePrivacy &&
        !snapshot.remoteTerms;

      if (isDbEmpty && bootstrappedRef.current !== user.uid) {
        bootstrappedRef.current = user.uid;
        setSeeding(true);
        try {
          const { count } = await seedDefaultContentToFirestore();
          await triggerRevalidation(user, [
            "site",
            "services",
            "projects",
            "posts",
            "team",
            "testimonials",
            "sectors",
            "tech",
            "faqs",
            "legal",
          ]);
          const seededSnapshot = await fetchAllCmsSnapshot();
          if (!cancelled) {
            applyCmsSnapshot(seededSnapshot);
            notify(`${t("seedSuccess")} (${count})`);
          }
        } catch {
          if (!cancelled) {
            applyCmsSnapshot(snapshot);
          }
        } finally {
          if (!cancelled) {
            setSeeding(false);
          }
        }
        return;
      }

      if (!cancelled && snapshot.remoteSite && bootstrappedRef.current !== user.uid) {
        bootstrappedRef.current = user.uid;
        try {
          const synced = await syncLegacySiteSettingsInFirestore();
          if (synced) {
            await triggerRevalidation(user, ["site"]);
            const refreshed = await fetchAllCmsSnapshot();
            if (!cancelled) {
              applyCmsSnapshot(refreshed);
              notify(
                ar
                  ? "تم تثبيت وتحديث إعدادات Next Soft في Firestore تلقائياً"
                  : "Next Soft settings synced to Firestore automatically",
              );
            }
            return;
          }
        } catch {
          // Non-fatal; user can still save manually in Settings tab
        }
      }

      applyCmsSnapshot(snapshot);
    };

    void bootstrapSession();

    const q = query(collection(db, "contactSubmissions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) =>
          mapContactDoc(d.id, d.data() as Record<string, unknown>),
        );
        setSubmissions(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "contactSubmissions");
      },
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [authReady, user, isAdmin, ar, fetchAllCmsSnapshot, applyCmsSnapshot, notify, t]);

  const filteredSubmissions = useMemo(() => {
    const q = inboxSearch.trim().toLowerCase();
    return submissions.filter((item) => {
      if (inboxFilter !== "all" && item.status !== inboxFilter) return false;
      if (!q) return true;
      return `${item.name} ${item.email} ${item.company} ${item.message}`.toLowerCase().includes(q);
    });
  }, [submissions, inboxFilter, inboxSearch]);

  const selectedSubmission = useMemo(
    () => submissions.find((s) => s.id === selectedId) ?? filteredSubmissions[0] ?? null,
    [submissions, selectedId, filteredSubmissions],
  );

  const activeDraft = selectedSubmission
    ? drafts[selectedSubmission.id] ?? {
        status: selectedSubmission.status,
        notes: selectedSubmission.notes,
      }
    : null;

  const selectSubmission = (item: ContactSubmission) => {
    setSelectedId(item.id);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const { count } = await seedDefaultContentToFirestore();
      await triggerRevalidation(user, [
        "site",
        "services",
        "projects",
        "posts",
        "team",
        "testimonials",
        "sectors",
        "tech",
        "faqs",
        "legal",
      ]);
      await loadAllCms();
      notify(`${t("seedSuccess")} (${count})`);
    } catch {
      notify(t("error"), true);
    } finally {
      setSeeding(false);
    }
  };

  const handleRefreshCache = async () => {
    const ok = await triggerRevalidation(user, [
      "site",
      "services",
      "projects",
      "posts",
      "team",
      "testimonials",
      "sectors",
      "tech",
      "faqs",
      "legal",
    ]);
    notify(ok ? t("saved") : t("error"), !ok);
  };

  if (!authReady) {
    return (
      <section className="section">
        <div className="container-page flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-muted">
            <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
            {t("loading")}
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="container-page flex min-h-[55vh] items-center justify-center">
          <div className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-border bg-surface p-8">
            <span className="grid size-12 place-items-center rounded-2xl border border-border bg-bg-elevated text-primary">
              <LayoutDashboard className="size-6" aria-hidden />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold">{t("signInTitle")}</h1>
              <p className="text-sm leading-relaxed text-muted">{t("signInDesc")}</p>
            </div>
            {authError ? (
              <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                {authError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className={buttonClass("primary", "lg", "w-full")}
            >
              {t("signInGoogle")}
            </button>
            <Link href="/" className="text-center text-xs text-muted hover:text-text">
              {t("actions.backToSite")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="section">
        <div className="container-page flex min-h-[55vh] items-center justify-center">
          <div className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-border bg-surface p-8">
            <span className="grid size-12 place-items-center rounded-2xl border border-danger/30 bg-danger/10 text-danger">
              <ShieldAlert className="size-6" aria-hidden />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold">{t("accessDenied")}</h1>
              <p className="text-sm leading-relaxed text-muted">{t("accessDeniedDesc")}</p>
              <p className="text-xs text-muted" dir="ltr">
                {user.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void signOut()}
                className={buttonClass("outline", "md")}
              >
                <LogOut className="size-4" aria-hidden />
                {t("signOut")}
              </button>
              <Link href="/" className={buttonClass("ghost", "md")}>
                {t("actions.backToSite")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const navTabs: { key: TabKey; label: string; icon: typeof LayoutDashboard; count?: number }[] = [
    { key: "overview", label: t("tabs.overview"), icon: LayoutDashboard },
    {
      key: "inbox",
      label: t("tabs.inbox"),
      icon: Inbox,
      count: submissions.filter((s) => s.status === "new").length,
    },
    { key: "settings", label: t("tabs.settings"), icon: Settings },
    { key: "services", label: t("tabs.services"), icon: Layers, count: services.length },
    { key: "projects", label: t("tabs.projects"), icon: Briefcase, count: projects.length },
    { key: "posts", label: t("tabs.posts"), icon: FileText, count: posts.length },
    { key: "team", label: t("tabs.team"), icon: Users, count: team.length },
    { key: "tech", label: t("tabs.tech"), icon: Cpu, count: techs.length },
    { key: "extras", label: t("tabs.extras"), icon: Sparkles },
    { key: "legal", label: t("tabs.legal"), icon: Scale },
  ];

  const statsCards = [
    { label: t("tabs.inbox"), value: submissions.length },
    { label: t("tabs.projects"), value: projects.length },
    { label: t("tabs.posts"), value: posts.length },
    { label: t("tabs.services"), value: services.length },
    { label: t("tabs.team"), value: team.length },
    { label: t("tabs.tech"), value: techs.length },
  ];

  return (
    <section className="py-10">
      <div className="container-page flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold sm:text-3xl">{t("title")}</h1>
            <p className="text-sm text-muted">{t("subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted" dir="ltr">
              {user.email}
            </span>
            <button
              type="button"
              onClick={() => void handleRefreshCache()}
              className={buttonClass("outline", "sm")}
            >
              <RefreshCw className="size-3.5" aria-hidden />
              {t("refreshCache")}
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className={buttonClass("ghost", "sm")}
            >
              <LogOut className="size-3.5" aria-hidden />
              {t("signOut")}
            </button>
          </div>
        </div>

        {toast ? (
          <div
            role="status"
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
              toast.error
                ? "border-danger/30 bg-danger/10 text-danger"
                : "border-accent/30 bg-accent/10 text-text"
            }`}
          >
            <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden />
            <span>{toast.msg}</span>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-2 h-fit">
            {navTabs.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors whitespace-nowrap ${
                    active
                      ? "bg-primary text-primary-fg font-medium"
                      : "text-muted hover:bg-surface-2 hover:text-text"
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="size-4 shrink-0" aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {typeof item.count === "number" ? (
                    <span
                      className={`text-xs tabular-nums ${
                        active ? "text-primary-fg/80" : "text-muted"
                      }`}
                    >
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </aside>

          <div className="min-w-0">
            {loadingData && tab !== "inbox" ? (
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
                <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
                {t("loading")}
              </div>
            ) : null}

            {tab === "overview" ? (
              <div className="flex flex-col gap-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {statsCards.map((card) => (
                    <div
                      key={card.label}
                      className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-5"
                    >
                      <span className="text-xs text-muted">{card.label}</span>
                      <span className="text-2xl font-semibold tabular-nums">{card.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
                  <div className="flex items-start gap-3">
                    <Database className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <div className="flex flex-col gap-1">
                      <h2 className="text-base font-semibold">
                        {ar ? "مزامنة البيانات الافتراضية إلى Firestore" : "Sync Default Content to Firestore"}
                      </h2>
                      <p className="text-sm text-muted">
                        {ar
                          ? "عند بدء المشروع لأول مرة تكون مجموعات Firestore فارغة ويعتمد الموقع على البيانات الاحتياطية المحلية. اضغط هنا لرفع جميع المشاريع، الخدمات، المقالات، الفريق، التقنيات، والأسئلة إلى Firestore لتتمكن من تعديلها وحذفها بحرية."
                          : "On first setup, Firestore collections are empty and the site serves local defaults. Click below to seed all default projects, services, posts, team roles, tech stack, and legal pages into Firestore so you can edit them directly."}
                      </p>
                      <p className="text-xs text-muted">
                        Firestore: {dbConnected === true ? (ar ? "متصل" : "Connected") : dbConnected === false ? (ar ? "غير متصل" : "Offline") : "…"}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" dir="ltr">
                        <span>Project: {firebaseConfig.projectId}</span>
                        <span>Database: {firebaseConfig.firestoreDatabaseId}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-bg-elevated px-3.5 py-2.5 text-xs text-muted">
                        <div className="flex flex-wrap items-center gap-3">
                          <BrandMark
                            size="sm"
                            logoUrl={siteSettings.logoUrl}
                            alt={ar ? siteSettings.name.ar : siteSettings.name.en}
                          />
                          <span>
                            {ar ? "الهوية النشطة:" : "Active brand:"}{" "}
                            <strong className="text-text">
                              {ar ? siteSettings.name.ar : siteSettings.name.en}
                            </strong>
                          </span>
                          <span dir="ltr">{siteSettings.email}</span>
                          <span dir="ltr">+{siteSettings.whatsapp}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTab("settings")}
                          className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-text transition-colors hover:border-primary/40"
                        >
                          {ar ? "تغيير الشعار والهوية" : "Change logo & brand"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={seeding}
                      onClick={() => void handleSeed()}
                      className={buttonClass("primary", "md")}
                    >
                      {seeding ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                          {t("seeding")}
                        </>
                      ) : (
                        t("seedButton")
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "inbox" ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1">
                    {(["all", "new", "in_review", "replied", "archived"] as const).map((st) => {
                      const count =
                        st === "all"
                          ? submissions.length
                          : submissions.filter((s) => s.status === st).length;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setInboxFilter(st)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                            inboxFilter === st
                              ? "bg-primary text-primary-fg"
                              : "text-muted hover:text-text"
                          }`}
                        >
                          {t(`inbox.${st}`)}{" "}
                          <span className="tabular-nums opacity-75">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="search"
                    value={inboxSearch}
                    onChange={(e) => setInboxSearch(e.target.value)}
                    placeholder={ar ? "ابحث بالاسم أو البريد…" : "Search name or email…"}
                    className={`${fieldInputClass} max-w-xs`}
                  />
                </div>

                {filteredSubmissions.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
                    {t("inbox.empty")}
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <ul className="flex flex-col gap-2">
                      {filteredSubmissions.map((item) => {
                        const active = selectedSubmission?.id === item.id;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => selectSubmission(item)}
                              className={`flex w-full flex-col gap-1 rounded-xl border p-4 text-start transition-colors ${
                                active
                                  ? "border-primary bg-surface-2"
                                  : "border-border bg-surface hover:bg-surface-2"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-text">{item.name}</span>
                                <span className="text-xs text-muted">{t(`inbox.${item.status}`)}</span>
                              </div>
                              <span className="text-xs text-muted" dir="ltr">
                                {item.email}
                              </span>
                              <span className="line-clamp-1 text-xs text-muted">
                                {item.message}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {selectedSubmission && activeDraft ? (
                      <div className="flex h-fit flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                          <div className="flex flex-col gap-1">
                            <h2 className="text-lg font-semibold">{selectedSubmission.name}</h2>
                            <p className="text-xs text-muted" dir="ltr">
                              {selectedSubmission.email}
                              {selectedSubmission.company ? ` · ${selectedSubmission.company}` : ""}
                            </p>
                            <p className="text-xs text-muted tabular-nums" dir="ltr">
                              {selectedSubmission.createdAt.slice(0, 16).replace("T", " ")}
                            </p>
                          </div>
                          <a
                            href={`mailto:${selectedSubmission.email}?subject=${encodeURIComponent(
                              `Re: ${siteSettings.name.en} Inquiry`,
                            )}`}
                            className={buttonClass("outline", "sm")}
                          >
                            <Mail className="size-3.5" aria-hidden />
                            {t("inbox.replyEmail")}
                          </a>
                        </div>

                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
                          {selectedSubmission.message}
                        </p>

                        <div className="flex flex-col gap-3 border-t border-border pt-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-muted">
                              {ar ? "الحالة" : "Status"}
                            </label>
                            <select
                              value={activeDraft.status}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [selectedSubmission.id]: {
                                    ...activeDraft,
                                    status: e.target.value as ContactStatus,
                                  },
                                }))
                              }
                              className={fieldInputClass}
                            >
                              {(["new", "in_review", "replied", "archived"] as const).map((st) => (
                                <option key={st} value={st}>
                                  {t(`inbox.${st}`)}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-muted">
                              {t("inbox.notes")}
                            </label>
                            <textarea
                              value={activeDraft.notes}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [selectedSubmission.id]: {
                                    ...activeDraft,
                                    notes: e.target.value,
                                  },
                                }))
                              }
                              className={fieldTextareaClass}
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              disabled={savingSubmission}
                              onClick={async () => {
                                setSavingSubmission(true);
                                try {
                                  await updateContactSubmission(
                                    selectedSubmission.id,
                                    activeDraft.status,
                                    activeDraft.notes,
                                  );
                                  setDrafts((prev) => {
                                    const next = { ...prev };
                                    delete next[selectedSubmission.id];
                                    return next;
                                  });
                                  notify(t("saved"));
                                } catch {
                                  notify(t("error"), true);
                                } finally {
                                  setSavingSubmission(false);
                                }
                              }}
                              className={buttonClass("primary", "sm")}
                            >
                              {t("inbox.saveChanges")}
                            </button>
                            <ConfirmDeleteButton
                              locale={locale}
                              label={t("inbox.delete")}
                              onConfirm={async () => {
                                try {
                                  await deleteContactSubmission(selectedSubmission.id);
                                  setSelectedId(null);
                                  notify(t("deleted"));
                                } catch {
                                  notify(t("error"), true);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}

            {tab === "settings" ? (
              <SiteSettingsEditor
                key={`settings-${cmsVersion}`}
                initial={siteSettings}
                user={user}
                locale={locale}
                onSaved={loadAllCms}
                notify={notify}
              />
            ) : null}

            {tab === "services" ? (
              <ServicesEditor
                items={services}
                user={user}
                locale={locale}
                onSaved={loadAllCms}
                notify={notify}
              />
            ) : null}

            {tab === "projects" ? (
              <ProjectsEditor
                items={projects}
                user={user}
                locale={locale}
                onSaved={loadAllCms}
                notify={notify}
              />
            ) : null}

            {tab === "posts" ? (
              <PostsEditor
                items={posts}
                user={user}
                locale={locale}
                onSaved={loadAllCms}
                notify={notify}
              />
            ) : null}

            {tab === "team" ? (
              <TeamEditor
                items={team}
                user={user}
                locale={locale}
                onSaved={loadAllCms}
                notify={notify}
              />
            ) : null}

            {tab === "tech" ? (
              <TechEditor
                items={techs}
                user={user}
                locale={locale}
                onSaved={loadAllCms}
                notify={notify}
              />
            ) : null}

            {tab === "extras" ? (
              <ExtrasEditor
                sectors={sectors}
                testimonials={testimonials}
                faqs={faqs}
                user={user}
                locale={locale}
                onSaved={loadAllCms}
                notify={notify}
              />
            ) : null}

            {tab === "legal" ? (
              <LegalEditor
                key={`legal-${cmsVersion}`}
                privacy={privacyDoc}
                terms={termsDoc}
                user={user}
                locale={locale}
                onSaved={loadAllCms}
                notify={notify}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
