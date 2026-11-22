import { NextResponse } from "next/server";

export function isAllowedRemoteImageUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "0.0.0.0" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^127\./.test(host) ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      host.startsWith("[") ||
      host.includes(":")
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export async function proxyRemoteImageUrl(rawUrl?: string | null): Promise<NextResponse> {
  const cleaned = typeof rawUrl === "string" ? rawUrl.trim() : "";
  if (!cleaned) {
    return new NextResponse(null, { status: 404 });
  }

  const remoteUrl = isAllowedRemoteImageUrl(cleaned);
  if (!remoteUrl) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const res = await fetch(remoteUrl.toString(), {
      signal: AbortSignal.timeout(5000),
      headers: { Accept: "image/*" },
      cache: "no-store",
    });
    if (!res.ok) {
      return new NextResponse(null, { status: 502 });
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return new NextResponse(null, { status: 415 });
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength === 0 || buf.byteLength > 2 * 1024 * 1024) {
      return new NextResponse(null, { status: 413 });
    }

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 504 });
  }
}
