"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { FirebaseProvider } from "@/components/providers/firebase-provider";

const StudioDashboard = dynamic(
  () => import("./studio-dashboard").then((mod) => mod.StudioDashboard),
  {
    ssr: false,
    loading: () => (
      <section className="section">
        <div className="container-page flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
        </div>
      </section>
    ),
  },
);

export function StudioShell() {
  return (
    <FirebaseProvider>
      <StudioDashboard />
    </FirebaseProvider>
  );
}
