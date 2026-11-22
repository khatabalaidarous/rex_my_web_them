import { getSite } from "@/lib/data";
import { proxyRemoteImageUrl } from "@/lib/remote-image";

export async function GET() {
  const site = await getSite();
  return proxyRemoteImageUrl(site.logoUrl);
}
