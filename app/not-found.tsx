import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";
import "./globals.css";

export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col antialiased">
        <main className="container-page flex min-h-[70vh] flex-1 flex-col items-center justify-center gap-5 py-20 text-center">
          <BrandMark size="lg" />
          <span className="text-sm font-semibold uppercase tracking-widest rtl:tracking-normal text-primary">
            404
          </span>
          <h1 className="text-3xl font-semibold sm:text-4xl">Next Soft · نكست سوفت</h1>
          <p className="max-w-md text-pretty text-muted">
            هذه الصفحة غير موجودة. · This page could not be found.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ar"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg"
            >
              العربية
            </Link>
            <Link
              href="/en"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-text"
            >
              English
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}