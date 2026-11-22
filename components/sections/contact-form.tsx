"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

type Values = {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const briefStarters: { label: { ar: string; en: string }; text: { ar: string; en: string } }[] = [
  {
    label: { ar: "موقع شركة", en: "Company site" },
    text: {
      ar: "نحتاج موقعاً تعريفياً سريعاً وثنائي اللغة يعرض خدماتنا وأعمالنا مع لوحة تحكم لتحديث المحتوى.",
      en: "We need a fast bilingual company site showcasing our services and portfolio with a built-in CMS.",
    },
  },
  {
    label: { ar: "متجر إلكتروني", en: "Online store" },
    text: {
      ar: "نرغب في إطلاق متجر إلكتروني مخصص بتجربة شراء سلسة وربط بوابات الدفع والشحن وإدارة المخزون.",
      en: "We want to launch a custom e-commerce storefront with seamless checkout, payments, shipping & inventory.",
    },
  },
  {
    label: { ar: "منصة ويب / SaaS", en: "SaaS platform" },
    text: {
      ar: "نخطط لبناء منصة ويب تفاعلية بحسابات مستخدمين وصلاحيات لوحات تحكم وتقارير أداء.",
      en: "We are planning a SaaS web platform with user accounts, role permissions, dashboards and reporting.",
    },
  },
  {
    label: { ar: "تطبيق جوال", en: "Mobile app" },
    text: {
      ar: "نبحث عن تطوير تطبيق جوال لنظامي iOS وAndroid مرتبط بلوحة تحكم وواجهة برمجة API خاصة بنا.",
      en: "We need a mobile app for iOS and Android synced with a backend dashboard and custom APIs.",
    },
  },
];

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-bg-elevated px-4 text-sm text-text placeholder:text-muted/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

const textareaClass =
  "min-h-36 w-full resize-y rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm leading-relaxed text-text placeholder:text-muted/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

const labelClass = "text-sm font-medium text-text";

export function ContactForm({ initialMessage = "" }: { initialMessage?: string }) {
  const t = useTranslations("form");
  const locale = useLocale();
  const ar = locale !== "en";
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: { name: "", email: "", company: "", message: initialMessage, website: "" },
  });

  useEffect(() => {
    if (initialMessage) {
      setValue("message", initialMessage, { shouldDirty: false });
    }
  }, [initialMessage, setValue]);

  const onSubmit = async (values: Values) => {
    setStatus("submitting");
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; id?: string; errors?: Record<string, string[]> }
        | null;

      if (!response.ok || !data?.ok) {
        const firstError = data?.errors ? Object.values(data.errors).flat()[0] : undefined;
        setServerError(firstError ?? t("error"));
        setStatus("error");
        return;
      }

      setReferenceId(data.id ?? null);
      reset();
      setStatus("success");
    } catch {
      setServerError(t("error"));
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="gradient-border surface-card flex flex-col items-start gap-4 p-8"
      >
        <span className="grid size-12 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h3 className="text-xl font-semibold">{t("success")}</h3>
        <p className="text-sm leading-relaxed text-muted">{t("successBody")}</p>
        {referenceId ? (
          <p className="text-xs text-muted">
            {t("referenceId")}:{" "}
            <code className="font-mono tabular-nums text-text" dir="ltr">
              {referenceId.slice(0, 8)}
            </code>
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setReferenceId(null);
            setStatus("idle");
          }}
          className={buttonClass("outline", "md")}
        >
          {t("reset")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className={labelClass}>
            {t("name")}
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass}
            {...register("name", { required: t("required") })}
          />
          {errors.name ? (
            <p id="contact-name-error" className="text-xs text-danger">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="contact-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClass}
            {...register("email", {
              required: t("required"),
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: t("invalidEmail") },
            })}
          />
          {errors.email ? (
            <p id="contact-email-error" className="text-xs text-danger">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="contact-company" className={labelClass}>
            {t("company")} <span className="text-muted">({t("optional")})</span>
          </label>
          <input
            id="contact-company"
            type="text"
            autoComplete="organization"
            placeholder={t("companyPlaceholder")}
            aria-invalid={errors.company ? "true" : undefined}
            aria-describedby={errors.company ? "contact-company-error" : undefined}
            className={inputClass}
            {...register("company", { maxLength: { value: 120, message: t("tooLong") } })}
          />
          {errors.company ? (
            <p id="contact-company-error" className="text-xs text-danger">
              {errors.company.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="contact-message" className={labelClass}>
              {t("message")}
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
              <Sparkles className="size-3 text-primary" aria-hidden />
              {t("quickStarters")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pb-1">
            {briefStarters.map((starter) => (
              <button
                key={starter.label.en}
                type="button"
                onClick={() =>
                  setValue("message", ar ? starter.text.ar : starter.text.en, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className="shrink-0 whitespace-nowrap rounded-lg border border-border bg-bg px-2.5 py-1 text-xs text-muted transition-colors hover:border-primary/40 hover:text-text"
              >
                {ar ? starter.label.ar : starter.label.en}
              </button>
            ))}
          </div>
          <textarea
            id="contact-message"
            placeholder={t("messagePlaceholder")}
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={textareaClass}
            {...register("message", {
              required: t("required"),
              minLength: { value: 20, message: t("tooShort") },
              maxLength: { value: 2000, message: t("tooLong") },
            })}
          />
          {errors.message ? (
            <p id="contact-message-error" className="text-xs text-danger">
              {errors.message.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="hidden" aria-hidden>
        <label htmlFor="contact-website">{t("company")}</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={buttonClass("primary", "lg", "w-full sm:w-fit")}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t("submitting")}
            </>
          ) : (
            <>
              {t("submit")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </>
          )}
        </button>
        <p aria-live="polite" className="min-h-5 text-sm">
          {status === "error" && serverError ? (
            <span role="alert" className="text-danger">
              {serverError}
            </span>
          ) : null}
        </p>
      </div>
    </form>
  );
}