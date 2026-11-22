import { NextResponse } from "next/server";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { contactSchema } from "@/lib/validation/contact";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    hits.clear();
    hits.set(key, recent);
  }

  return recent.length > MAX_REQUESTS;
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  return ip || "local";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      {
        ok: false,
        errors: { form: ["Too many messages. Please try again later."] },
      },
      { status: 429 },
    );
  }

  const submissionId = crypto.randomUUID();

  try {
    await setDoc(doc(db, "contactSubmissions", submissionId), {
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      message: parsed.data.message,
      status: "new",
      notes: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[contact] Firestore write failed", error);
    return NextResponse.json(
      {
        ok: false,
        errors: { form: ["Could not save your message. Please email us instead."] },
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: submissionId });
}