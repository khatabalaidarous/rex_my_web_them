"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import { Trash2 } from "lucide-react";
import type { Localized } from "@/content/site";

export const fieldInputClass =
  "h-10 w-full rounded-lg border border-border bg-bg-elevated px-3 text-sm text-text placeholder:text-muted/60 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export const fieldTextareaClass =
  "min-h-24 w-full resize-y rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm leading-relaxed text-text placeholder:text-muted/60 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export async function triggerRevalidation(user: User | null, tags: string[]): Promise<boolean> {
  if (!user) return false;
  try {
    const token = await user.getIdToken();
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tags }),
    });
    if (!response.ok) {
      console.warn("[studio] revalidation failed with status:", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[studio] revalidation request skipped:", error);
    return false;
  }
}

export function StudioEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
      {message}
    </div>
  );
}

export function slugifyAscii(value: string, fallback = "item"): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `${fallback}-${Date.now().toString(36)}`;
}

export function hasLocalizedText(value: Localized): boolean {
  return value.ar.trim().length > 0 && value.en.trim().length > 0;
}

export function formatCmsError(baseMessage: string, error: unknown, ar: boolean): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  let detail = raw;
  try {
    const parsed = JSON.parse(raw) as { error?: string; authInfo?: { email?: string | null; emailVerified?: boolean | null } };
    if (parsed?.error) detail = parsed.error;
  } catch {
    // Plain error message
  }

  const lower = detail.toLowerCase();
  if (lower.includes("insufficient permissions") || lower.includes("permission-denied")) {
    return ar
      ? `${baseMessage}: تم رفض الصلاحية من Firestore. تأكد من تسجيل الدخول بحساب الإدارة المصرّح به.`
      : `${baseMessage}: Firestore permission denied. Ensure you are signed in with an authorized admin account.`;
  }
  if (lower.includes("quota exceeded") || lower.includes("resource-exhausted")) {
    return ar
      ? `${baseMessage}: تم تجاوز حصة الكتابة اليومية المجانية لقاعدة البيانات، وسيتم تصفيرها غداً.`
      : `${baseMessage}: Daily Firestore write quota exceeded; quota resets tomorrow.`;
  }
  if (lower.includes("offline") || lower.includes("unavailable") || lower.includes("network")) {
    return ar
      ? `${baseMessage}: تعذر الاتصال بقاعدة البيانات حالياً، تحقق من اتصال الإنترنت.`
      : `${baseMessage}: Database connection unavailable; please check your network.`;
  }
  if (detail && detail.length < 180) {
    return `${baseMessage} (${detail})`;
  }
  return baseMessage;
}

export function ConfirmDeleteButton({
  onConfirm,
  locale,
  label,
}: {
  onConfirm: () => Promise<void> | void;
  locale: string;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const ar = locale === "ar";

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={label ?? (ar ? "حذف" : "Delete")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border p-1.5 text-xs text-muted transition-colors hover:border-danger/40 hover:text-danger"
      >
        <Trash2 className="size-3.5" aria-hidden />
        {label ? <span>{label}</span> : null}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setConfirming(false);
          }
        }}
        className="rounded-lg border border-danger/40 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/20 disabled:opacity-50 whitespace-nowrap"
      >
        {busy ? "…" : ar ? "تأكيد الحذف" : "Confirm"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => setConfirming(false)}
        className="rounded-lg border border-border px-2 py-1 text-xs text-muted hover:text-text whitespace-nowrap"
      >
        {ar ? "إلغاء" : "Cancel"}
      </button>
    </span>
  );
}

export function LocalizedFieldPair({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: Localized;
  onChange: (next: Localized) => void;
  multiline?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted">
          {label} (AR)
        </label>
        {multiline ? (
          <textarea
            dir="rtl"
            value={value.ar}
            onChange={(e) => onChange({ ...value, ar: e.target.value })}
            className={fieldTextareaClass}
          />
        ) : (
          <input
            type="text"
            dir="rtl"
            value={value.ar}
            onChange={(e) => onChange({ ...value, ar: e.target.value })}
            className={fieldInputClass}
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted">
          {label} (EN)
        </label>
        {multiline ? (
          <textarea
            dir="ltr"
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            className={fieldTextareaClass}
          />
        ) : (
          <input
            type="text"
            dir="ltr"
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            className={fieldInputClass}
          />
        )}
      </div>
    </div>
  );
}
