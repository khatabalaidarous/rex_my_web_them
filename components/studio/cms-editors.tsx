"use client";

import { useRef, useState } from "react";
import type { User } from "firebase/auth";
import { Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import {
  TEAM_AVATAR_BY_SLUG,
  resolveMemberAvatar,
  type LegalPage,
  type Post,
  type Project,
  type Sector,
  type Service,
  type Tech,
} from "@/content/site";
import { BrandMark } from "@/components/layout/brand-mark";
import { TeamPortrait } from "@/components/ui/team-portrait";
import { prepareLogoDataUrl, preparePortraitDataUrl } from "@/lib/logo-upload";
import {
  deleteCmsDocument,
  saveFaq,
  saveLegal,
  saveMember,
  savePost,
  saveProject,
  saveSector,
  saveService,
  saveSiteSettings,
  saveTech,
  saveTestimonial,
  type FaqDoc,
  type MemberDoc,
  type SectorDoc,
  type ServiceDoc,
  type SiteSettingsDoc,
  type TechDoc,
  type TestimonialDoc,
} from "@/lib/firebase/cms";
import { buttonClass } from "@/components/ui/button";
import {
  ConfirmDeleteButton,
  fieldInputClass,
  formatCmsError,
  hasLocalizedText,
  LocalizedFieldPair,
  slugifyAscii,
  StudioEmptyState,
  triggerRevalidation,
} from "./studio-helpers";

type NotifyFn = (msg: string, isError?: boolean) => void;

export function SiteSettingsEditor({
  initial,
  user,
  locale,
  onSaved,
  notify,
}: {
  initial: SiteSettingsDoc;
  user: User | null;
  locale: string;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const [form, setForm] = useState<SiteSettingsDoc>(initial);
  const [saving, setSaving] = useState(false);
  const [processingLogo, setProcessingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const ar = locale === "ar";

  const statsList = form.stats ?? [];
  const processList = form.process ?? [];

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setProcessingLogo(true);
    try {
      const { dataUrl } = await prepareLogoDataUrl(file);
      setForm((prev) => ({ ...prev, logoUrl: dataUrl }));
      notify(
        ar
          ? "تم تجهيز الشعار ومعاينته — اضغط حفظ التغييرات لتثبيته في الموقع"
          : "Logo prepared for preview — click Save changes to publish it live",
      );
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "FILE_TOO_LARGE" || code === "LOGO_DATA_TOO_LARGE") {
        notify(
          ar
            ? "حجم الشعار كبير جداً. اختر صورة أصغر (PNG أو WebP أو SVG مبسّط)."
            : "Logo file is too large. Please choose a smaller PNG, WebP, or compact SVG.",
          true,
        );
      } else {
        notify(
          ar
            ? "تعذر قراءة ملف الشعار. الصيغ المدعومة: PNG وJPG وWebP وSVG."
            : "Could not read logo file. Supported formats: PNG, JPG, WebP, SVG.",
          true,
        );
      }
    } finally {
      setProcessingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = form.email.trim();
    const normalizedWhatsapp = form.whatsapp.replace(/\D+/g, "");
    const logoTrimmed = typeof form.logoUrl === "string" ? form.logoUrl.trim() : "";
    const validLogo =
      !logoTrimmed ||
      ((logoTrimmed.startsWith("data:image/") ||
        logoTrimmed.startsWith("/") ||
        logoTrimmed.startsWith("https://")) &&
        logoTrimmed.length <= 120000);
    const validEmail =
      emailTrimmed.length >= 5 &&
      emailTrimmed.length <= 160 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);
    const validWhatsapp = normalizedWhatsapp.length >= 6 && normalizedWhatsapp.length <= 20;
    const validSocials = form.socials.every(
      (s) => s.label.trim().length > 0 && /^https?:\/\/.+/.test(s.href.trim()),
    );
    const validStats = statsList.every(
      (item) =>
        item.value.trim().length >= 1 &&
        item.value.trim().length <= 20 &&
        hasLocalizedText(item.label),
    );
    const validProcess = processList.every(
      (item) =>
        item.number.trim().length >= 1 &&
        item.number.trim().length <= 10 &&
        hasLocalizedText(item.title) &&
        hasLocalizedText(item.description),
    );

    if (
      !hasLocalizedText(form.name) ||
      !hasLocalizedText(form.legalName) ||
      !hasLocalizedText(form.tagline) ||
      !hasLocalizedText(form.shortTagline) ||
      !hasLocalizedText(form.location) ||
      !validLogo ||
      !validEmail ||
      !validWhatsapp ||
      !validSocials ||
      !validStats ||
      !validProcess
    ) {
      notify(
        ar
          ? "تأكد من ملء جميع الحقول الأساسية والإحصائيات وخطوات العمل بالعربية والإنجليزية، وشعار بصيغة صالحة، وبريد ورقم واتساب (6–20 رقماً) وروابط تبدأ بـ https://."
          : "Please complete all Arabic/English fields, valid logo format, stats, process steps, valid email, WhatsApp (6–20 digits), and valid social URLs.",
        true,
      );
      return;
    }

    setSaving(true);
    try {
      const cleanedForm: SiteSettingsDoc = {
        ...form,
        logoUrl: logoTrimmed || undefined,
        email: emailTrimmed,
        whatsapp: normalizedWhatsapp,
        socials: form.socials.map((s) => ({
          label: s.label.trim(),
          href: s.href.trim(),
        })),
      };
      await saveSiteSettings(cleanedForm);
      await triggerRevalidation(user, ["site"]);
      await onSaved();
      notify(ar ? "تم حفظ إعدادات الموقع والشعار" : "Site settings & logo saved");
    } catch (error) {
      notify(formatCmsError(ar ? "فشل حفظ الإعدادات" : "Failed to save settings", error, ar), true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <h2 className="text-lg font-semibold">{ar ? "إعدادات الهوية والشعار والتواصل" : "Brand, Logo & Contact Settings"}</h2>
        <button type="submit" disabled={saving || processingLogo} className={buttonClass("primary", "sm")}>
          <Save className="size-4" aria-hidden />
          {saving ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ التغييرات" : "Save changes"}
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-bg-elevated p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">{ar ? "شعار الموقع المخصّص" : "Custom Site Logo"}</h3>
            <p className="text-xs text-muted">
              {ar
                ? "ارفع شعار فريقك (PNG بخلفية شفافة، SVG، WebP، أو JPG) وسيظهر فوراً في الشريط العلوي والتذييل."
                : "Upload your team logo (transparent PNG, SVG, WebP, or JPG) to display it across the header and footer."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => void handleLogoFileChange(e)}
              className="sr-only"
            />
            <button
              type="button"
              disabled={processingLogo}
              onClick={() => logoInputRef.current?.click()}
              className={buttonClass("outline", "sm")}
            >
              <Upload className="size-3.5" aria-hidden />
              {processingLogo
                ? ar
                  ? "جارٍ التجهيز…"
                  : "Preparing…"
                : ar
                  ? "رفع شعار من جهازك"
                  : "Upload logo"}
            </button>
            {form.logoUrl ? (
              <button
                type="button"
                onClick={() => setForm({ ...form, logoUrl: "" })}
                className={buttonClass("ghost", "sm")}
              >
                <RotateCcw className="size-3.5" aria-hidden />
                {ar ? "الشعار الافتراضي" : "Default mark"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#08080e] px-4 py-3 text-[#f5f5f7]">
            <div className="flex items-center gap-2.5">
              <BrandMark
                size="md"
                logoUrl={form.logoUrl}
                alt={ar ? form.name.ar : form.name.en}
              />
              <span className="text-sm font-semibold">
                {ar ? form.name.ar : form.name.en}
              </span>
            </div>
            <span className="text-[11px] text-white/60">{ar ? "الوضع الداكن" : "Dark mode"}</span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-[#f8f8f5] px-4 py-3 text-[#0b0b10]">
            <div className="flex items-center gap-2.5">
              <BrandMark
                size="md"
                logoUrl={form.logoUrl}
                alt={ar ? form.name.ar : form.name.en}
              />
              <span className="text-sm font-semibold">
                {ar ? form.name.ar : form.name.en}
              </span>
            </div>
            <span className="text-[11px] text-black/60">{ar ? "الوضع الفاتح" : "Light mode"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">
            {ar ? "أو أدخل مسار/رابط الشعار مباشرة (اختياري)" : "Or enter logo path / HTTPS URL directly (optional)"}
          </label>
          <input
            type="text"
            dir="ltr"
            value={form.logoUrl?.startsWith("data:image/") ? "" : (form.logoUrl ?? "")}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            placeholder={
              form.logoUrl?.startsWith("data:image/")
                ? ar
                  ? "شعار مرفوع ومضغوط جاهز للحفظ"
                  : "Uploaded logo ready — save changes to publish"
                : "/images/logo.png"
            }
            className={fieldInputClass}
          />
        </div>
      </div>

      <LocalizedFieldPair
        label={ar ? "اسم العلامة" : "Brand name"}
        value={form.name}
        onChange={(name) => setForm({ ...form, name })}
      />
      <LocalizedFieldPair
        label={ar ? "الاسم القانوني" : "Legal name"}
        value={form.legalName}
        onChange={(legalName) => setForm({ ...form, legalName })}
      />
      <LocalizedFieldPair
        label={ar ? "الشعار الرئيسي" : "Tagline"}
        value={form.tagline}
        onChange={(tagline) => setForm({ ...form, tagline })}
      />
      <LocalizedFieldPair
        label={ar ? "الوصف المختصر" : "Short tagline"}
        value={form.shortTagline}
        onChange={(shortTagline) => setForm({ ...form, shortTagline })}
      />
      <LocalizedFieldPair
        label={ar ? "الموقع" : "Location"}
        value={form.location}
        onChange={(location) => setForm({ ...form, location })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">{ar ? "البريد الإلكتروني" : "Email"}</label>
          <input
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={fieldInputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">{ar ? "رقم الواتساب (بدون +)" : "WhatsApp (digits only)"}</label>
          <input
            type="text"
            dir="ltr"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className={fieldInputClass}
          />
        </div>
      </div>

      {form.aboutMission ? (
        <LocalizedFieldPair
          label={ar ? "رسالة صفحة من نحن" : "About Mission"}
          value={form.aboutMission}
          onChange={(aboutMission) => setForm({ ...form, aboutMission })}
          multiline
        />
      ) : null}

      {form.aboutSecondary ? (
        <LocalizedFieldPair
          label={ar ? "النص الثانوي لصفحة من نحن" : "About Secondary Copy"}
          value={form.aboutSecondary}
          onChange={(aboutSecondary) => setForm({ ...form, aboutSecondary })}
          multiline
        />
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{ar ? "إحصائيات الرئيسية وصفحة من نحن" : "Home & About Stats"}</h3>
          <button
            type="button"
            disabled={statsList.length >= 8}
            onClick={() =>
              setForm({
                ...form,
                stats: [...statsList, { value: "10", suffix: "+", label: { ar: "", en: "" } }],
              })
            }
            className={buttonClass("outline", "sm")}
          >
            <Plus className="size-3.5" aria-hidden />
            {ar ? "إضافة رقم" : "Add stat"}
          </button>
        </div>
        {statsList.map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-3">
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                dir="ltr"
                value={stat.value}
                onChange={(e) => {
                  const next = [...statsList];
                  next[idx] = { ...next[idx], value: e.target.value };
                  setForm({ ...form, stats: next });
                }}
                className={fieldInputClass}
                placeholder={ar ? "القيمة (مثل 48)" : "Value (e.g. 48)"}
              />
              <input
                type="text"
                dir="ltr"
                value={stat.suffix ?? ""}
                onChange={(e) => {
                  const next = [...statsList];
                  next[idx] = { ...next[idx], suffix: e.target.value };
                  setForm({ ...form, stats: next });
                }}
                className={fieldInputClass}
                placeholder={ar ? "اللاحقة (+ أو %)" : "Suffix (+ or %)"}
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, stats: statsList.filter((_, i) => i !== idx) })}
                aria-label="Remove stat"
                className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted hover:text-danger"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
            <LocalizedFieldPair
              label={ar ? `تسمية الإحصائية #${idx + 1}` : `Stat #${idx + 1} label`}
              value={stat.label}
              onChange={(label) => {
                const next = [...statsList];
                next[idx] = { ...next[idx], label };
                setForm({ ...form, stats: next });
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{ar ? "خطوات العمل (منهجية التنفيذ)" : "Process Steps"}</h3>
          <button
            type="button"
            disabled={processList.length >= 8}
            onClick={() =>
              setForm({
                ...form,
                process: [
                  ...processList,
                  {
                    number: String(processList.length + 1).padStart(2, "0"),
                    title: { ar: "", en: "" },
                    description: { ar: "", en: "" },
                  },
                ],
              })
            }
            className={buttonClass("outline", "sm")}
          >
            <Plus className="size-3.5" aria-hidden />
            {ar ? "إضافة خطوة" : "Add step"}
          </button>
        </div>
        {processList.map((step, idx) => (
          <div key={idx} className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-3">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                dir="ltr"
                value={step.number}
                onChange={(e) => {
                  const next = [...processList];
                  next[idx] = { ...next[idx], number: e.target.value };
                  setForm({ ...form, process: next });
                }}
                className={`${fieldInputClass} max-w-28`}
                placeholder="01"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, process: processList.filter((_, i) => i !== idx) })}
                aria-label="Remove step"
                className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted hover:text-danger"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
            <LocalizedFieldPair
              label={ar ? `عنوان الخطوة #${idx + 1}` : `Step #${idx + 1} title`}
              value={step.title}
              onChange={(title) => {
                const next = [...processList];
                next[idx] = { ...next[idx], title };
                setForm({ ...form, process: next });
              }}
            />
            <LocalizedFieldPair
              label={ar ? `وصف الخطوة #${idx + 1}` : `Step #${idx + 1} description`}
              value={step.description}
              onChange={(description) => {
                const next = [...processList];
                next[idx] = { ...next[idx], description };
                setForm({ ...form, process: next });
              }}
              multiline
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{ar ? "روابط التواصل" : "Social Links"}</h3>
          <button
            type="button"
            disabled={form.socials.length >= 10}
            onClick={() => setForm({ ...form, socials: [...form.socials, { label: "Website", href: "https://" }] })}
            className={buttonClass("outline", "sm")}
          >
            <Plus className="size-3.5" aria-hidden />
            {ar ? "إضافة رابط" : "Add link"}
          </button>
        </div>
        {form.socials.map((social, idx) => (
          <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <input
              type="text"
              dir="ltr"
              value={social.label}
              onChange={(e) => {
                const next = [...form.socials];
                next[idx] = { ...next[idx], label: e.target.value };
                setForm({ ...form, socials: next });
              }}
              className={fieldInputClass}
              placeholder="Label"
            />
            <input
              type="url"
              dir="ltr"
              value={social.href}
              onChange={(e) => {
                const next = [...form.socials];
                next[idx] = { ...next[idx], href: e.target.value };
                setForm({ ...form, socials: next });
              }}
              className={fieldInputClass}
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, socials: form.socials.filter((_, i) => i !== idx) })}
              aria-label="Remove"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted hover:text-danger"
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}

export function ServicesEditor({
  items,
  user,
  locale,
  onSaved,
  notify,
}: {
  items: ServiceDoc[];
  user: User | null;
  locale: string;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const ar = locale === "ar";
  const [editing, setEditing] = useState<ServiceDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () =>
    setEditing({
      id: `service-${Date.now().toString(36)}`,
      order: items.length + 1,
      icon: "code",
      title: { ar: "", en: "" },
      description: { ar: "", en: "" },
    });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!hasLocalizedText(editing.title) || !hasLocalizedText(editing.description)) {
      notify(ar ? "أدخل العنوان والوصف باللغتين" : "Title and description are required in both languages", true);
      return;
    }

    setSaving(true);
    try {
      await saveService(editing.id, {
        order: editing.order,
        icon: editing.icon,
        title: editing.title,
        description: editing.description,
      });
      await triggerRevalidation(user, ["services"]);
      await onSaved();
      setEditing(null);
      notify(ar ? "تم حفظ الخدمة" : "Service saved");
    } catch {
      notify(ar ? "تعذر حفظ الخدمة" : "Failed to save service", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCmsDocument("services", id);
      await triggerRevalidation(user, ["services"]);
      await onSaved();
      notify(ar ? "تم حذف الخدمة" : "Service deleted");
    } catch {
      notify(ar ? "تعذر حذف الخدمة" : "Failed to delete service", true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{ar ? "الخدمات" : "Services"}</h2>
        <button type="button" onClick={startNew} className={buttonClass("primary", "sm")}>
          <Plus className="size-4" aria-hidden />
          {ar ? "خدمة جديدة" : "New service"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "الأيقونة" : "Icon"}</label>
              <select
                value={editing.icon}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value as Service["icon"] })}
                className={fieldInputClass}
              >
                {(["code", "palette", "rocket", "search", "shield", "sparkles"] as const).map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "الترتيب" : "Order"}</label>
              <input
                type="number"
                value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                className={fieldInputClass}
              />
            </div>
          </div>
          <LocalizedFieldPair
            label={ar ? "العنوان" : "Title"}
            value={editing.title}
            onChange={(title) => setEditing({ ...editing, title })}
          />
          <LocalizedFieldPair
            label={ar ? "الوصف" : "Description"}
            value={editing.description}
            onChange={(description) => setEditing({ ...editing, description })}
            multiline
          />
          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving} className={buttonClass("primary", "sm")}>
              <Save className="size-4" aria-hidden />
              {saving ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={buttonClass("outline", "sm")}>
              {ar ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </form>
      ) : null}

      {items.length === 0 ? (
        <StudioEmptyState
          message={
            ar
              ? "لا توجد خدمات محفوظة في Firestore بعد. أضف خدمة جديدة أو زامن المحتوى الافتراضي من تبويب نظرة عامة."
              : "No services saved in Firestore yet. Add a service or sync defaults from the Overview tab."
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted tabular-nums">#{item.order} · {item.icon}</span>
                <span className="font-medium">{ar ? item.title.ar : item.title.en}</span>
                <span className="line-clamp-2 text-xs text-muted">{ar ? item.description.ar : item.description.en}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
                >
                  {ar ? "تعديل" : "Edit"}
                </button>
                <ConfirmDeleteButton locale={locale} onConfirm={() => handleDelete(item.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProjectsEditor({
  items,
  user,
  locale,
  onSaved,
  notify,
}: {
  items: Project[];
  user: User | null;
  locale: string;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const ar = locale === "ar";
  const [editing, setEditing] = useState<Project | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setOriginalSlug(null);
    setEditing({
      slug: `project-${Date.now().toString(36)}`,
      title: { ar: "", en: "" },
      summary: { ar: "", en: "" },
      category: { ar: "منتج رقمي", en: "Digital product" },
      year: String(new Date().getFullYear()),
      client: { ar: "", en: "" },
      role: { ar: "", en: "" },
      duration: { ar: "6 أسابيع", en: "6 weeks" },
      challenge: { ar: "", en: "" },
      solution: { ar: "", en: "" },
      results: [{ value: "+40%", label: { ar: "تحسن الأداء", en: "Performance gain" } }],
      stack: ["Next.js", "TypeScript"],
      placeholder: false,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const yearTrimmed = editing.year.trim();
    if (
      yearTrimmed.length < 4 ||
      yearTrimmed.length > 10 ||
      !hasLocalizedText(editing.title) ||
      !hasLocalizedText(editing.summary) ||
      !hasLocalizedText(editing.category) ||
      !hasLocalizedText(editing.client) ||
      !hasLocalizedText(editing.role) ||
      !hasLocalizedText(editing.duration) ||
      !hasLocalizedText(editing.challenge) ||
      !hasLocalizedText(editing.solution)
    ) {
      notify(
        ar
          ? "يرجى استكمال السنة (4–10 أحرف) وجميع الحقول النصية بالعربية والإنجليزية"
          : "Please provide a valid year (4–10 chars) and complete all localized project fields",
        true,
      );
      return;
    }

    setSaving(true);
    try {
      const normalizedSlug = slugifyAscii(editing.slug || editing.title.en, "project");
      const cleanResults = editing.results.filter(
        (r) => r.value.trim().length > 0 && hasLocalizedText(r.label),
      );
      await saveProject({ ...editing, year: yearTrimmed, slug: normalizedSlug, results: cleanResults });
      if (originalSlug && originalSlug !== normalizedSlug) {
        await deleteCmsDocument("projects", originalSlug);
      }
      await triggerRevalidation(user, ["projects"]);
      await onSaved();
      setEditing(null);
      setOriginalSlug(null);
      notify(ar ? "تم حفظ المشروع" : "Project saved");
    } catch {
      notify(ar ? "تعذر حفظ المشروع" : "Failed to save project", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteCmsDocument("projects", slug);
      await triggerRevalidation(user, ["projects"]);
      await onSaved();
      notify(ar ? "تم حذف المشروع" : "Project deleted");
    } catch {
      notify(ar ? "تعذر حذف المشروع" : "Failed to delete project", true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{ar ? "المشاريع" : "Projects"}</h2>
        <button type="button" onClick={startNew} className={buttonClass("primary", "sm")}>
          <Plus className="size-4" aria-hidden />
          {ar ? "مشروع جديد" : "New project"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Slug</label>
              <input
                type="text"
                dir="ltr"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className={fieldInputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "السنة" : "Year"}</label>
              <input
                type="text"
                dir="ltr"
                value={editing.year}
                onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                className={fieldInputClass}
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input
                type="checkbox"
                checked={editing.placeholder}
                onChange={(e) => setEditing({ ...editing, placeholder: e.target.checked })}
              />
              {ar ? "نموذج توضيحي" : "Placeholder sample"}
            </label>
          </div>
          <LocalizedFieldPair
            label={ar ? "العنوان" : "Title"}
            value={editing.title}
            onChange={(title) => setEditing({ ...editing, title })}
          />
          <LocalizedFieldPair
            label={ar ? "الملخص" : "Summary"}
            value={editing.summary}
            onChange={(summary) => setEditing({ ...editing, summary })}
            multiline
          />
          <LocalizedFieldPair
            label={ar ? "التصنيف" : "Category"}
            value={editing.category}
            onChange={(category) => setEditing({ ...editing, category })}
          />
          <LocalizedFieldPair
            label={ar ? "العميل" : "Client"}
            value={editing.client}
            onChange={(client) => setEditing({ ...editing, client })}
          />
          <LocalizedFieldPair
            label={ar ? "الدور" : "Role"}
            value={editing.role}
            onChange={(role) => setEditing({ ...editing, role })}
          />
          <LocalizedFieldPair
            label={ar ? "المدة" : "Duration"}
            value={editing.duration}
            onChange={(duration) => setEditing({ ...editing, duration })}
          />
          <LocalizedFieldPair
            label={ar ? "التحدي" : "Challenge"}
            value={editing.challenge}
            onChange={(challenge) => setEditing({ ...editing, challenge })}
            multiline
          />
          <LocalizedFieldPair
            label={ar ? "الحل" : "Solution"}
            value={editing.solution}
            onChange={(solution) => setEditing({ ...editing, solution })}
            multiline
          />

          <div className="flex flex-col gap-3 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">{ar ? "النتائج والمؤشرات" : "Results & Metrics"}</span>
              <button
                type="button"
                disabled={editing.results.length >= 10}
                onClick={() =>
                  setEditing({
                    ...editing,
                    results: [...editing.results, { value: "", label: { ar: "", en: "" } }],
                  })
                }
                className={buttonClass("outline", "sm")}
              >
                <Plus className="size-3.5" aria-hidden />
                {ar ? "إضافة نتيجة" : "Add metric"}
              </button>
            </div>
            {editing.results.map((result, idx) => (
              <div key={idx} className="grid gap-3 rounded-xl border border-border bg-bg-elevated p-3 sm:grid-cols-[120px_1fr_auto] sm:items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted">{ar ? "القيمة" : "Value"}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={result.value}
                    onChange={(e) => {
                      const next = [...editing.results];
                      next[idx] = { ...next[idx], value: e.target.value };
                      setEditing({ ...editing, results: next });
                    }}
                    placeholder="+40%"
                    className={fieldInputClass}
                  />
                </div>
                <LocalizedFieldPair
                  label={ar ? "الوصف" : "Label"}
                  value={result.label}
                  onChange={(label) => {
                    const next = [...editing.results];
                    next[idx] = { ...next[idx], label };
                    setEditing({ ...editing, results: next });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      results: editing.results.filter((_, i) => i !== idx),
                    })
                  }
                  aria-label="Remove metric"
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted hover:text-danger"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">{ar ? "التقنيات (مفصولة بفاصلة)" : "Stack (comma separated)"}</label>
            <input
              type="text"
              dir="ltr"
              value={editing.stack.join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className={fieldInputClass}
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving} className={buttonClass("primary", "sm")}>
              <Save className="size-4" aria-hidden />
              {saving ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={buttonClass("outline", "sm")}>
              {ar ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </form>
      ) : null}

      {items.length === 0 ? (
        <StudioEmptyState
          message={
            ar
              ? "لا توجد مشاريع محفوظة في Firestore بعد. أضف مشروعاً جديداً أو زامن المحتوى الافتراضي من تبويب نظرة عامة."
              : "No projects saved in Firestore yet. Add a project or sync defaults from the Overview tab."
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.slug} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted tabular-nums">{item.year} · {ar ? item.category.ar : item.category.en}</span>
                <span className="font-medium">{ar ? item.title.ar : item.title.en}</span>
                <span className="line-clamp-2 text-xs text-muted">{ar ? item.summary.ar : item.summary.en}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setOriginalSlug(item.slug);
                    setEditing(item);
                  }}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
                >
                  {ar ? "تعديل" : "Edit"}
                </button>
                <ConfirmDeleteButton locale={locale} onConfirm={() => handleDelete(item.slug)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PostsEditor({
  items,
  user,
  locale,
  onSaved,
  notify,
}: {
  items: Post[];
  user: User | null;
  locale: string;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const ar = locale === "ar";
  const [editing, setEditing] = useState<Post | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setOriginalSlug(null);
    setEditing({
      slug: `post-${Date.now().toString(36)}`,
      title: { ar: "", en: "" },
      excerpt: { ar: "", en: "" },
      tag: { ar: "هندسة", en: "Engineering" },
      date: new Date().toISOString().slice(0, 10),
      readingMinutes: 4,
      body: [{ ar: "", en: "" }],
      placeholder: false,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const validBody = editing.body.filter((p) => hasLocalizedText(p));
    const dateTrimmed = editing.date.trim();
    const readingMinutesValid =
      Number.isFinite(editing.readingMinutes) &&
      editing.readingMinutes >= 1 &&
      editing.readingMinutes <= 120;
    if (
      dateTrimmed.length < 8 ||
      dateTrimmed.length > 32 ||
      !readingMinutesValid ||
      !hasLocalizedText(editing.title) ||
      !hasLocalizedText(editing.excerpt) ||
      !hasLocalizedText(editing.tag) ||
      validBody.length === 0
    ) {
      notify(
        ar
          ? "التاريخ (YYYY-MM-DD) ومدة القراءة (1–120) والعنوان والتصنيف والمقتطف وفقرة واحدة على الأقل مطلوبة"
          : "Valid date, reading minutes (1–120), title, tag, excerpt, and at least one paragraph are required",
        true,
      );
      return;
    }

    setSaving(true);
    try {
      const normalizedSlug = slugifyAscii(editing.slug || editing.title.en, "post");
      await savePost({ ...editing, date: dateTrimmed, slug: normalizedSlug, body: validBody });
      if (originalSlug && originalSlug !== normalizedSlug) {
        await deleteCmsDocument("posts", originalSlug);
      }
      await triggerRevalidation(user, ["posts"]);
      await onSaved();
      setEditing(null);
      setOriginalSlug(null);
      notify(ar ? "تم حفظ المقال" : "Post saved");
    } catch {
      notify(ar ? "تعذر حفظ المقال" : "Failed to save post", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteCmsDocument("posts", slug);
      await triggerRevalidation(user, ["posts"]);
      await onSaved();
      notify(ar ? "تم حذف المقال" : "Post deleted");
    } catch {
      notify(ar ? "تعذر حذف المقال" : "Failed to delete post", true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{ar ? "مقالات المدونة" : "Blog Posts"}</h2>
        <button type="button" onClick={startNew} className={buttonClass("primary", "sm")}>
          <Plus className="size-4" aria-hidden />
          {ar ? "مقال جديد" : "New post"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Slug</label>
              <input
                type="text"
                dir="ltr"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className={fieldInputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "التاريخ" : "Date"}</label>
              <input
                type="date"
                dir="ltr"
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                className={fieldInputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "دقائق القراءة" : "Reading minutes"}</label>
              <input
                type="number"
                min={1}
                max={60}
                value={editing.readingMinutes}
                onChange={(e) => setEditing({ ...editing, readingMinutes: Number(e.target.value) })}
                className={fieldInputClass}
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input
                type="checkbox"
                checked={editing.placeholder}
                onChange={(e) => setEditing({ ...editing, placeholder: e.target.checked })}
              />
              {ar ? "مقال توضيحي" : "Placeholder"}
            </label>
          </div>
          <LocalizedFieldPair
            label={ar ? "العنوان" : "Title"}
            value={editing.title}
            onChange={(title) => setEditing({ ...editing, title })}
          />
          <LocalizedFieldPair
            label={ar ? "التصنيف" : "Tag"}
            value={editing.tag}
            onChange={(tag) => setEditing({ ...editing, tag })}
          />
          <LocalizedFieldPair
            label={ar ? "المقتطف" : "Excerpt"}
            value={editing.excerpt}
            onChange={(excerpt) => setEditing({ ...editing, excerpt })}
            multiline
          />
          <div className="flex flex-col gap-3 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">{ar ? "فقرات المقال" : "Paragraphs"}</span>
              <button
                type="button"
                disabled={editing.body.length >= 50}
                onClick={() => setEditing({ ...editing, body: [...editing.body, { ar: "", en: "" }] })}
                className={buttonClass("outline", "sm")}
              >
                <Plus className="size-3.5" aria-hidden />
                {ar ? "فقرة" : "Paragraph"}
              </button>
            </div>
            {editing.body.map((para, idx) => (
              <div key={idx} className="flex flex-col gap-2 rounded-xl border border-border bg-bg-elevated p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">{`${ar ? "فقرة" : "Paragraph"} ${idx + 1}`}</span>
                  {editing.body.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({ ...editing, body: editing.body.filter((_, i) => i !== idx) })
                      }
                      aria-label="Remove paragraph"
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs text-muted hover:text-danger"
                    >
                      <Trash2 className="size-3" aria-hidden />
                    </button>
                  ) : null}
                </div>
                <LocalizedFieldPair
                  label={`${ar ? "المحتوى" : "Content"}`}
                  value={para}
                  onChange={(next) => {
                    const body = [...editing.body];
                    body[idx] = next;
                    setEditing({ ...editing, body });
                  }}
                  multiline
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving} className={buttonClass("primary", "sm")}>
              <Save className="size-4" aria-hidden />
              {saving ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={buttonClass("outline", "sm")}>
              {ar ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </form>
      ) : null}

      {items.length === 0 ? (
        <StudioEmptyState
          message={
            ar
              ? "لا توجد مقالات محفوظة في Firestore بعد. أضف مقالاً جديداً أو زامن المحتوى الافتراضي من تبويب نظرة عامة."
              : "No blog posts saved in Firestore yet. Add a post or sync defaults from the Overview tab."
          }
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.slug} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted tabular-nums">{item.date} · {ar ? item.tag.ar : item.tag.en}</span>
                <span className="font-medium">{ar ? item.title.ar : item.title.en}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setOriginalSlug(item.slug);
                    setEditing(item);
                  }}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
                >
                  {ar ? "تعديل" : "Edit"}
                </button>
                <ConfirmDeleteButton locale={locale} onConfirm={() => handleDelete(item.slug)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TeamEditor({
  items,
  user,
  locale,
  onSaved,
  notify,
}: {
  items: MemberDoc[];
  user: User | null;
  locale: string;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const ar = locale === "ar";
  const [editing, setEditing] = useState<MemberDoc | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [processingAvatar, setProcessingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const startNew = () => {
    setOriginalSlug(null);
    setEditing({
      slug: `member-${Date.now().toString(36)}`,
      order: items.length + 1,
      initials: "NS",
      name: { ar: "", en: "" },
      avatar: "/images/team/front-end.jpg",
      role: { ar: "", en: "" },
      focus: { ar: "", en: "" },
      responsibilities: [{ ar: "", en: "" }],
      stack: ["TypeScript"],
      placeholder: false,
    });
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editing) return;

    setProcessingAvatar(true);
    try {
      const { dataUrl } = await preparePortraitDataUrl(file);
      setEditing((prev) => (prev ? { ...prev, avatar: dataUrl } : prev));
      notify(
        ar
          ? "تم تجهيز الصورة الشخصية — اضغط حفظ لتثبيتها في صفحة الفريق"
          : "Portrait prepared — click Save to publish it to the team page",
      );
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "FILE_TOO_LARGE" || code === "LOGO_DATA_TOO_LARGE") {
        notify(
          ar
            ? "حجم الصورة كبير جداً. اختر صورة أصغر (PNG أو JPG أو WebP)."
            : "Image file is too large. Please choose a smaller PNG, JPG, or WebP.",
          true,
        );
      } else {
        notify(
          ar
            ? "تعذر قراءة الصورة. الصيغ المدعومة: PNG وJPG وWebP وSVG."
            : "Could not read image file. Supported formats: PNG, JPG, WebP, SVG.",
          true,
        );
      }
    } finally {
      setProcessingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const initialsTrimmed = editing.initials.trim();
    const avatarTrimmed = typeof editing.avatar === "string" ? editing.avatar.trim() : "";
    const validAvatar =
      !avatarTrimmed ||
      ((avatarTrimmed.startsWith("data:image/") ||
        avatarTrimmed.startsWith("/") ||
        avatarTrimmed.startsWith("https://")) &&
        avatarTrimmed.length <= 120000);
    if (
      initialsTrimmed.length < 1 ||
      initialsTrimmed.length > 6 ||
      !validAvatar ||
      !editing.name ||
      !hasLocalizedText(editing.name) ||
      !hasLocalizedText(editing.role) ||
      !hasLocalizedText(editing.focus)
    ) {
      notify(
        ar
          ? "الأحرف الأولى (1–6 أحرف) والاسم والدور والتركيز مطلوبة باللغتين، ويجب أن تكون الصورة بصيغة صالحة."
          : "Initials (1–6 chars), name, role, and focus are required in both languages, and the portrait image must be valid.",
        true,
      );
      return;
    }

    setSaving(true);
    try {
      const normalizedSlug = slugifyAscii(editing.slug || editing.name?.en || editing.role.en, "member");
      const cleanResponsibilities = editing.responsibilities.filter((r) => hasLocalizedText(r));
      await saveMember({
        ...editing,
        initials: initialsTrimmed,
        avatar: avatarTrimmed || undefined,
        slug: normalizedSlug,
        responsibilities: cleanResponsibilities,
      });
      if (originalSlug && originalSlug !== normalizedSlug) {
        await deleteCmsDocument("team", originalSlug);
      }
      await triggerRevalidation(user, ["team"]);
      await onSaved();
      setEditing(null);
      setOriginalSlug(null);
      notify(ar ? "تم حفظ العضو" : "Member saved");
    } catch (error) {
      notify(formatCmsError(ar ? "تعذر حفظ العضو" : "Failed to save member", error, ar), true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteCmsDocument("team", slug);
      await triggerRevalidation(user, ["team"]);
      await onSaved();
      notify(ar ? "تم حذف العضو" : "Member deleted");
    } catch {
      notify(ar ? "تعذر حذف العضو" : "Failed to delete member", true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{ar ? "أعضاء الفريق والأدوار" : "Team Members & Roles"}</h2>
        <button type="button" onClick={startNew} className={buttonClass("primary", "sm")}>
          <Plus className="size-4" aria-hidden />
          {ar ? "عضو جديد" : "New member"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">Slug</label>
              <input
                type="text"
                dir="ltr"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className={fieldInputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "الأحرف الأولى" : "Initials"}</label>
              <input
                type="text"
                dir="ltr"
                maxLength={6}
                value={editing.initials}
                onChange={(e) => setEditing({ ...editing, initials: e.target.value })}
                className={fieldInputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "الترتيب" : "Order"}</label>
              <input
                type="number"
                value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                className={fieldInputClass}
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input
                type="checkbox"
                checked={editing.placeholder}
                onChange={(e) => setEditing({ ...editing, placeholder: e.target.checked })}
              />
              {ar ? "عضو توضيحي" : "Placeholder member"}
            </label>
          </div>
          <LocalizedFieldPair
            label={ar ? "اسم العضو" : "Member name"}
            value={editing.name ?? { ar: "", en: "" }}
            onChange={(name) => setEditing({ ...editing, name })}
          />
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <TeamPortrait
                  src={resolveMemberAvatar(editing.slug, editing.avatar)}
                  slug={editing.slug}
                  alt={editing.name?.en || editing.role.en || editing.slug}
                  initials={editing.initials || "NS"}
                  interactive={false}
                  sizes="88px"
                  className="size-20 shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-text">
                    {ar ? "صورة العضو الشخصية" : "Member Portrait Photo"}
                  </span>
                  <span className="text-xs text-muted">
                    {ar
                      ? "ارفع صورة مباشرة من جهازك (PNG، JPG، WebP) أو اختر من القوالب الجاهزة."
                      : "Upload a portrait directly from your device (PNG, JPG, WebP) or choose a preset."}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => void handleAvatarFileChange(e)}
                  className="sr-only"
                />
                <button
                  type="button"
                  disabled={processingAvatar}
                  onClick={() => avatarInputRef.current?.click()}
                  className={buttonClass("outline", "sm")}
                >
                  <Upload className="size-3.5" aria-hidden />
                  {processingAvatar
                    ? ar
                      ? "جارٍ التجهيز…"
                      : "Preparing…"
                    : ar
                      ? "رفع صورة من جهازك"
                      : "Upload photo"}
                </button>
                {editing.avatar ? (
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        avatar: TEAM_AVATAR_BY_SLUG[editing.slug] ?? "",
                      })
                    }
                    className={buttonClass("ghost", "sm")}
                  >
                    <RotateCcw className="size-3.5" aria-hidden />
                    {ar ? "استعادة الافتراضية" : "Reset preset"}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">
                {ar ? "أو أدخل مسار/رابط الصورة مباشرة (اختياري)" : "Or enter portrait path / HTTPS URL directly (optional)"}
              </label>
              <input
                type="text"
                dir="ltr"
                value={editing.avatar?.startsWith("data:image/") ? "" : (editing.avatar ?? "")}
                onChange={(e) => setEditing({ ...editing, avatar: e.target.value })}
                placeholder={
                  editing.avatar?.startsWith("data:image/")
                    ? ar
                      ? "صورة مرفوعة ومضغوطة جاهزة للحفظ"
                      : "Uploaded portrait ready — save changes to publish"
                    : "/images/team/front-end.jpg"
                }
                className={fieldInputClass}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-muted">
                {ar ? "صور الاستوديو الجاهزة:" : "Studio presets:"}
              </span>
              {Object.entries(TEAM_AVATAR_BY_SLUG).map(([presetKey, presetPath]) => (
                <button
                  key={presetKey}
                  type="button"
                  onClick={() => setEditing({ ...editing, avatar: presetPath })}
                  className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                    editing.avatar === presetPath
                      ? "border-primary bg-primary/15 text-text"
                      : "border-border bg-surface text-muted hover:text-text"
                  }`}
                >
                  {presetKey}
                </button>
              ))}
            </div>
          </div>
          <LocalizedFieldPair
            label={ar ? "المسمى الوظيفي / الدور" : "Role / Title"}
            value={editing.role}
            onChange={(role) => setEditing({ ...editing, role })}
          />
          <LocalizedFieldPair
            label={ar ? "التركيز" : "Focus"}
            value={editing.focus}
            onChange={(focus) => setEditing({ ...editing, focus })}
            multiline
          />

          <div className="flex flex-col gap-3 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">{ar ? "المسؤوليات" : "Responsibilities"}</span>
              <button
                type="button"
                disabled={editing.responsibilities.length >= 15}
                onClick={() =>
                  setEditing({
                    ...editing,
                    responsibilities: [...editing.responsibilities, { ar: "", en: "" }],
                  })
                }
                className={buttonClass("outline", "sm")}
              >
                <Plus className="size-3.5" aria-hidden />
                {ar ? "إضافة مسؤولية" : "Add responsibility"}
              </button>
            </div>
            {editing.responsibilities.map((resp, idx) => (
              <div key={idx} className="grid gap-3 rounded-xl border border-border bg-bg-elevated p-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <LocalizedFieldPair
                  label={`${ar ? "مسؤولية" : "Responsibility"} ${idx + 1}`}
                  value={resp}
                  onChange={(next) => {
                    const nextList = [...editing.responsibilities];
                    nextList[idx] = next;
                    setEditing({ ...editing, responsibilities: nextList });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      responsibilities: editing.responsibilities.filter((_, i) => i !== idx),
                    })
                  }
                  aria-label="Remove responsibility"
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted hover:text-danger"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">{ar ? "الأدوات (مفصولة بفاصلة)" : "Stack (comma separated)"}</label>
            <input
              type="text"
              dir="ltr"
              value={editing.stack.join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className={fieldInputClass}
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving || processingAvatar} className={buttonClass("primary", "sm")}>
              <Save className="size-4" aria-hidden />
              {saving ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={buttonClass("outline", "sm")}>
              {ar ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </form>
      ) : null}

      {items.length === 0 ? (
        <StudioEmptyState
          message={
            ar
              ? "لا توجد ملفات فريق محفوظة في Firestore بعد. أضف عضواً جديداً أو زامن المحتوى الافتراضي من تبويب نظرة عامة."
              : "No team members saved in Firestore yet. Add a member or sync defaults from the Overview tab."
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const displayName = item.name ? (ar ? item.name.ar : item.name.en) : "";
            const displayRole = ar ? item.role.ar : item.role.en;
            return (
              <li key={item.slug} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start gap-3">
                  <TeamPortrait
                    src={resolveMemberAvatar(item.slug, item.avatar)}
                    slug={item.slug}
                    alt={displayName || displayRole}
                    initials={item.initials}
                    interactive={false}
                    sizes="48px"
                    className="size-12 shrink-0"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted">{item.initials} · #{item.order}</span>
                    <span className="font-medium">
                      {displayName ? `${displayName} — ${displayRole}` : displayRole}
                    </span>
                    <span className="line-clamp-2 text-xs text-muted">{ar ? item.focus.ar : item.focus.en}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOriginalSlug(item.slug);
                      setEditing({
                        ...item,
                        name: item.name ?? { ar: "", en: "" },
                        avatar: resolveMemberAvatar(item.slug, item.avatar) ?? "",
                      });
                    }}
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
                  >
                    {ar ? "تعديل" : "Edit"}
                  </button>
                  <ConfirmDeleteButton locale={locale} onConfirm={() => handleDelete(item.slug)} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function TechEditor({
  items,
  user,
  locale,
  onSaved,
  notify,
}: {
  items: TechDoc[];
  user: User | null;
  locale: string;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const ar = locale === "ar";
  const [editing, setEditing] = useState<TechDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () =>
    setEditing({
      id: `tech-${Date.now().toString(36)}`,
      name: "",
      group: "web",
      category: { ar: "", en: "" },
      description: { ar: "", en: "" },
      accent: "violet",
    });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.name.trim() || !hasLocalizedText(editing.category) || !hasLocalizedText(editing.description)) {
      notify(ar ? "اسم التقنية والتصنيف والوصف مطلوبون" : "Name, category, and description are required", true);
      return;
    }

    setSaving(true);
    try {
      const id = editing.id || slugifyAscii(editing.name, "tech");
      await saveTech(id, editing);
      await triggerRevalidation(user, ["tech"]);
      await onSaved();
      setEditing(null);
      notify(ar ? "تم حفظ التقنية" : "Tech saved");
    } catch {
      notify(ar ? "تعذر حفظ التقنية" : "Failed to save tech", true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{ar ? "التقنيات" : "Tech Stack"}</h2>
        <button type="button" onClick={startNew} className={buttonClass("primary", "sm")}>
          <Plus className="size-4" aria-hidden />
          {ar ? "تقنية جديدة" : "New tech"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "الاسم" : "Name"}</label>
              <input
                type="text"
                dir="ltr"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className={fieldInputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "المجموعة" : "Group"}</label>
              <select
                value={editing.group}
                onChange={(e) => setEditing({ ...editing, group: e.target.value as Tech["group"] })}
                className={fieldInputClass}
              >
                {(["web", "backend", "mobile", "database", "tools"] as const).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">{ar ? "اللون" : "Accent"}</label>
              <select
                value={editing.accent}
                onChange={(e) => setEditing({ ...editing, accent: e.target.value as Tech["accent"] })}
                className={fieldInputClass}
              >
                {(["violet", "mint", "sky", "amber"] as const).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          <LocalizedFieldPair
            label={ar ? "التصنيف" : "Category"}
            value={editing.category}
            onChange={(category) => setEditing({ ...editing, category })}
          />
          <LocalizedFieldPair
            label={ar ? "الوصف" : "Description"}
            value={editing.description}
            onChange={(description) => setEditing({ ...editing, description })}
          />
          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving} className={buttonClass("primary", "sm")}>
              <Save className="size-4" aria-hidden />
              {saving ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={buttonClass("outline", "sm")}>
              {ar ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </form>
      ) : null}

      {items.length === 0 ? (
        <StudioEmptyState
          message={
            ar
              ? "لا توجد تقنيات محفوظة في Firestore بعد. أضف تقنية جديدة أو زامن المحتوى الافتراضي من تبويب نظرة عامة."
              : "No tech items saved in Firestore yet. Add a tech item or sync defaults from the Overview tab."
          }
        />
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface p-3.5">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted">{item.group} · {ar ? item.category.ar : item.category.en}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface-2"
                >
                  {ar ? "تعديل" : "Edit"}
                </button>
                <ConfirmDeleteButton
                  locale={locale}
                  onConfirm={async () => {
                    try {
                      await deleteCmsDocument("techStack", item.id);
                      await triggerRevalidation(user, ["tech"]);
                      await onSaved();
                      notify(ar ? "تم الحذف" : "Deleted");
                    } catch {
                      notify(ar ? "تعذر الحذف" : "Failed to delete", true);
                    }
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExtrasEditor({
  sectors,
  testimonials,
  faqs,
  user,
  locale,
  onSaved,
  notify,
}: {
  sectors: SectorDoc[];
  testimonials: TestimonialDoc[];
  faqs: FaqDoc[];
  user: User | null;
  locale: string;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const ar = locale === "ar";
  const [faqEdit, setFaqEdit] = useState<FaqDoc | null>(null);
  const [quoteEdit, setQuoteEdit] = useState<TestimonialDoc | null>(null);
  const [sectorEdit, setSectorEdit] = useState<SectorDoc | null>(null);
  const [savingSection, setSavingSection] = useState<"faq" | "sector" | "quote" | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{ar ? "الأسئلة الشائعة" : "FAQs"}</h2>
          <button
            type="button"
            onClick={() =>
              setFaqEdit({ id: `faq-${Date.now().toString(36)}`, order: faqs.length + 1, q: { ar: "", en: "" }, a: { ar: "", en: "" } })
            }
            className={buttonClass("outline", "sm")}
          >
            <Plus className="size-3.5" aria-hidden />
            {ar ? "إضافة سؤال" : "Add FAQ"}
          </button>
        </div>
        {faqEdit ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!hasLocalizedText(faqEdit.q) || !hasLocalizedText(faqEdit.a)) {
                notify(ar ? "أدخل السؤال والإجابة باللغتين" : "Question and answer are required in both languages", true);
                return;
              }
              setSavingSection("faq");
              try {
                await saveFaq(faqEdit.id, { order: faqEdit.order, q: faqEdit.q, a: faqEdit.a });
                await triggerRevalidation(user, ["faqs"]);
                await onSaved();
                setFaqEdit(null);
                notify(ar ? "تم حفظ السؤال" : "FAQ saved");
              } catch {
                notify(ar ? "تعذر حفظ السؤال" : "Failed to save FAQ", true);
              } finally {
                setSavingSection(null);
              }
            }}
            className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-4"
          >
            <LocalizedFieldPair label={ar ? "السؤال" : "Question"} value={faqEdit.q} onChange={(q) => setFaqEdit({ ...faqEdit, q })} />
            <LocalizedFieldPair label={ar ? "الإجابة" : "Answer"} value={faqEdit.a} onChange={(a) => setFaqEdit({ ...faqEdit, a })} multiline />
            <div className="flex gap-2">
              <button type="submit" disabled={savingSection === "faq"} className={buttonClass("primary", "sm")}>
                {savingSection === "faq" ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ" : "Save"}
              </button>
              <button type="button" onClick={() => setFaqEdit(null)} className={buttonClass("outline", "sm")}>{ar ? "إلغاء" : "Cancel"}</button>
            </div>
          </form>
        ) : null}
        <ul className="flex flex-col gap-2">
          {faqs.map((faq) => (
            <li key={faq.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg-elevated p-3">
              <span className="text-sm">{ar ? faq.q.ar : faq.q.en}</span>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => setFaqEdit(faq)} className="rounded border border-border px-2 py-1 text-xs">{ar ? "تعديل" : "Edit"}</button>
                <ConfirmDeleteButton
                  locale={locale}
                  onConfirm={async () => {
                    try {
                      await deleteCmsDocument("faqs", faq.id);
                      await triggerRevalidation(user, ["faqs"]);
                      await onSaved();
                      notify(ar ? "تم الحذف" : "Deleted");
                    } catch {
                      notify(ar ? "تعذر الحذف" : "Failed to delete", true);
                    }
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{ar ? "القطاعات" : "Sectors"}</h2>
          <button
            type="button"
            onClick={() =>
              setSectorEdit({ id: `sector-${Date.now().toString(36)}`, order: sectors.length + 1, icon: "cpu", label: { ar: "", en: "" } })
            }
            className={buttonClass("outline", "sm")}
          >
            <Plus className="size-3.5" aria-hidden />
            {ar ? "إضافة قطاع" : "Add Sector"}
          </button>
        </div>
        {sectorEdit ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!hasLocalizedText(sectorEdit.label)) {
                notify(ar ? "أدخل اسم القطاع باللغتين" : "Sector label is required in both languages", true);
                return;
              }
              setSavingSection("sector");
              try {
                await saveSector(sectorEdit.id, { order: sectorEdit.order, icon: sectorEdit.icon, label: sectorEdit.label });
                await triggerRevalidation(user, ["sectors"]);
                await onSaved();
                setSectorEdit(null);
                notify(ar ? "تم حفظ القطاع" : "Sector saved");
              } catch {
                notify(ar ? "تعذر حفظ القطاع" : "Failed to save sector", true);
              } finally {
                setSavingSection(null);
              }
            }}
            className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-4"
          >
            <select
              value={sectorEdit.icon}
              onChange={(e) => setSectorEdit({ ...sectorEdit, icon: e.target.value as Sector["icon"] })}
              className={fieldInputClass}
            >
              {(["cart", "cpu", "book", "heart", "bank", "truck", "building", "plane"] as const).map((ic) => (
                <option key={ic} value={ic}>{ic}</option>
              ))}
            </select>
            <LocalizedFieldPair label={ar ? "الاسم" : "Label"} value={sectorEdit.label} onChange={(label) => setSectorEdit({ ...sectorEdit, label })} />
            <div className="flex gap-2">
              <button type="submit" disabled={savingSection === "sector"} className={buttonClass("primary", "sm")}>
                {savingSection === "sector" ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ" : "Save"}
              </button>
              <button type="button" onClick={() => setSectorEdit(null)} className={buttonClass("outline", "sm")}>{ar ? "إلغاء" : "Cancel"}</button>
            </div>
          </form>
        ) : null}
        <ul className="grid gap-2 sm:grid-cols-2">
          {sectors.map((s) => (
            <li key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-bg-elevated p-3">
              <span className="text-sm">{ar ? s.label.ar : s.label.en}</span>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => setSectorEdit(s)} className="rounded border border-border px-2 py-1 text-xs">{ar ? "تعديل" : "Edit"}</button>
                <ConfirmDeleteButton
                  locale={locale}
                  onConfirm={async () => {
                    try {
                      await deleteCmsDocument("sectors", s.id);
                      await triggerRevalidation(user, ["sectors"]);
                      await onSaved();
                      notify(ar ? "تم الحذف" : "Deleted");
                    } catch {
                      notify(ar ? "تعذر الحذف" : "Failed to delete", true);
                    }
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{ar ? "آراء العملاء" : "Testimonials"}</h2>
          <button
            type="button"
            onClick={() =>
              setQuoteEdit({
                id: `testimonial-${Date.now().toString(36)}`,
                order: testimonials.length + 1,
                initials: "CL",
                quote: { ar: "", en: "" },
                role: { ar: "", en: "" },
                placeholder: false,
              })
            }
            className={buttonClass("outline", "sm")}
          >
            <Plus className="size-3.5" aria-hidden />
            {ar ? "إضافة رأي" : "Add Quote"}
          </button>
        </div>
        {quoteEdit ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!quoteEdit.initials.trim() || !hasLocalizedText(quoteEdit.quote) || !hasLocalizedText(quoteEdit.role)) {
                notify(ar ? "الأحرف الأولى والاقتباس والدور مطلوبة" : "Initials, quote, and role are required", true);
                return;
              }
              setSavingSection("quote");
              try {
                await saveTestimonial(quoteEdit.id, {
                  order: quoteEdit.order,
                  initials: quoteEdit.initials,
                  quote: quoteEdit.quote,
                  role: quoteEdit.role,
                  placeholder: quoteEdit.placeholder,
                });
                await triggerRevalidation(user, ["testimonials"]);
                await onSaved();
                setQuoteEdit(null);
                notify(ar ? "تم حفظ الرأي" : "Testimonial saved");
              } catch {
                notify(ar ? "تعذر حفظ الرأي" : "Failed to save testimonial", true);
              } finally {
                setSavingSection(null);
              }
            }}
            className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                dir="ltr"
                maxLength={6}
                value={quoteEdit.initials}
                onChange={(e) => setQuoteEdit({ ...quoteEdit, initials: e.target.value })}
                className={fieldInputClass}
                placeholder="Initials"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={quoteEdit.placeholder}
                  onChange={(e) => setQuoteEdit({ ...quoteEdit, placeholder: e.target.checked })}
                />
                {ar ? "رأي توضيحي" : "Placeholder quote"}
              </label>
            </div>
            <LocalizedFieldPair label={ar ? "الاقتباس" : "Quote"} value={quoteEdit.quote} onChange={(quote) => setQuoteEdit({ ...quoteEdit, quote })} multiline />
            <LocalizedFieldPair label={ar ? "الدور" : "Role"} value={quoteEdit.role} onChange={(role) => setQuoteEdit({ ...quoteEdit, role })} />
            <div className="flex gap-2">
              <button type="submit" disabled={savingSection === "quote"} className={buttonClass("primary", "sm")}>
                {savingSection === "quote" ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ" : "Save"}
              </button>
              <button type="button" onClick={() => setQuoteEdit(null)} className={buttonClass("outline", "sm")}>{ar ? "إلغاء" : "Cancel"}</button>
            </div>
          </form>
        ) : null}
        <ul className="flex flex-col gap-2">
          {testimonials.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg-elevated p-3">
              <span className="line-clamp-1 text-sm">{ar ? item.quote.ar : item.quote.en}</span>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => setQuoteEdit(item)} className="rounded border border-border px-2 py-1 text-xs">{ar ? "تعديل" : "Edit"}</button>
                <ConfirmDeleteButton
                  locale={locale}
                  onConfirm={async () => {
                    try {
                      await deleteCmsDocument("testimonials", item.id);
                      await triggerRevalidation(user, ["testimonials"]);
                      await onSaved();
                      notify(ar ? "تم الحذف" : "Deleted");
                    } catch {
                      notify(ar ? "تعذر الحذف" : "Failed to delete", true);
                    }
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function LegalEditor({
  privacy,
  terms,
  user,
  locale,
  onSaved,
  notify,
}: {
  privacy: LegalPage;
  terms: LegalPage;
  user: User | null;
  locale: string;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const ar = locale === "ar";
  const [activeKey, setActiveKey] = useState<"privacy" | "terms">("privacy");
  const [formPrivacy, setFormPrivacy] = useState<LegalPage>(privacy);
  const [formTerms, setFormTerms] = useState<LegalPage>(terms);
  const [saving, setSaving] = useState(false);

  const current = activeKey === "privacy" ? formPrivacy : formTerms;
  const setCurrent = activeKey === "privacy" ? setFormPrivacy : setFormTerms;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSections = current.sections.filter(
      (s) => hasLocalizedText(s.heading) && hasLocalizedText(s.body),
    );
    if (!current.updated.trim() || !hasLocalizedText(current.notice) || !hasLocalizedText(current.intro)) {
      notify(ar ? "التاريخ والتنبيه والمقدمة مطلوبون باللغتين" : "Date, notice, and intro are required in both languages", true);
      return;
    }

    setSaving(true);
    try {
      await saveLegal(activeKey, { ...current, sections: cleanSections });
      await triggerRevalidation(user, ["legal"]);
      await onSaved();
      notify(ar ? "تم حفظ الصفحة القانونية" : "Legal page saved");
    } catch {
      notify(ar ? "تعذر الحفظ" : "Failed to save", true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex gap-2">
          {(["privacy", "terms"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setActiveKey(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                activeKey === k ? "bg-primary text-primary-fg" : "border border-border text-muted hover:text-text"
              }`}
            >
              {k === "privacy" ? (ar ? "سياسة الخصوصية" : "Privacy Policy") : ar ? "الشروط والأحكام" : "Terms & Conditions"}
            </button>
          ))}
        </div>
        <button type="submit" disabled={saving} className={buttonClass("primary", "sm")}>
          <Save className="size-4" aria-hidden />
          {saving ? (ar ? "جارٍ الحفظ…" : "Saving…") : ar ? "حفظ التغييرات" : "Save"}
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted">{ar ? "تاريخ التحديث" : "Last updated"}</label>
        <input
          type="date"
          dir="ltr"
          value={current.updated}
          onChange={(e) => setCurrent({ ...current, updated: e.target.value })}
          className={fieldInputClass}
        />
      </div>
      <LocalizedFieldPair label={ar ? "تنبيه" : "Notice"} value={current.notice} onChange={(notice) => setCurrent({ ...current, notice })} multiline />
      <LocalizedFieldPair label={ar ? "مقدمة" : "Intro"} value={current.intro} onChange={(intro) => setCurrent({ ...current, intro })} multiline />

      <div className="flex flex-col gap-3 border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">{ar ? "الأقسام" : "Sections"}</span>
          <button
            type="button"
            disabled={current.sections.length >= 20}
            onClick={() =>
              setCurrent({
                ...current,
                sections: [...current.sections, { heading: { ar: "", en: "" }, body: { ar: "", en: "" } }],
              })
            }
            className={buttonClass("outline", "sm")}
          >
            <Plus className="size-3.5" aria-hidden />
            {ar ? "إضافة قسم" : "Add section"}
          </button>
        </div>
        {current.sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-3 rounded-xl border border-border bg-bg-elevated p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">{`${ar ? "القسم" : "Section"} ${idx + 1}`}</span>
              <button
                type="button"
                onClick={() =>
                  setCurrent({
                    ...current,
                    sections: current.sections.filter((_, i) => i !== idx),
                  })
                }
                aria-label="Remove section"
                className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs text-muted hover:text-danger"
              >
                <Trash2 className="size-3" aria-hidden />
              </button>
            </div>
            <LocalizedFieldPair
              label={`${ar ? "عنوان القسم" : "Heading"} ${idx + 1}`}
              value={section.heading}
              onChange={(heading) => {
                const sections = [...current.sections];
                sections[idx] = { ...sections[idx], heading };
                setCurrent({ ...current, sections });
              }}
            />
            <LocalizedFieldPair
              label={`${ar ? "النص" : "Body"} ${idx + 1}`}
              value={section.body}
              onChange={(body) => {
                const sections = [...current.sections];
                sections[idx] = { ...sections[idx], body };
                setCurrent({ ...current, sections });
              }}
              multiline
            />
          </div>
        ))}
      </div>
    </form>
  );
}
