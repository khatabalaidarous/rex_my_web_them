import { getMember } from "@/lib/data";
import { proxyRemoteImageUrl } from "@/lib/remote-image";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!slug || !/^[a-zA-Z0-9_-]{1,128}$/.test(slug)) {
    return new Response(null, { status: 400 });
  }
  const member = await getMember(slug);
  return proxyRemoteImageUrl(member?.avatar);
}
