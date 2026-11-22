import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import firebaseConfig from "@/firebase-applet-config.json";
import { isBootstrapAdminEmail } from "@/lib/firebase/client";

const VALID_TAGS = new Set([
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

type Payload = {
  tags?: string[];
};

async function verifyFirebaseAdminToken(idToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );

    if (!response.ok) return false;
    const data = (await response.json()) as {
      users?: { localId?: string; email?: string; emailVerified?: boolean }[];
    };
    const user = data.users?.[0];
    if (!user?.emailVerified) return false;
    if (isBootstrapAdminEmail(user.email)) return true;

    if (user.localId && /^[a-zA-Z0-9_-]+$/.test(user.localId)) {
      const databaseId = firebaseConfig.firestoreDatabaseId || "(default)";
      const adminDocUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${encodeURIComponent(databaseId)}/documents/admins/${user.localId}`;
      const adminRes = await fetch(adminDocUrl, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      return adminRes.ok;
    }
    return false;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!token) {
    return NextResponse.json({ ok: false, error: "missing auth token" }, { status: 401 });
  }

  const authorized = await verifyFirebaseAdminToken(token);
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as Payload | null;
  const requestedTags = payload?.tags?.length ? payload.tags : [...VALID_TAGS];
  const tags = requestedTags.filter((tag) => VALID_TAGS.has(tag));

  if (tags.length === 0) {
    return NextResponse.json({ ok: false, error: "no valid tags" }, { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
  revalidatePath("/[locale]", "layout");

  return NextResponse.json({ ok: true, tags });
}