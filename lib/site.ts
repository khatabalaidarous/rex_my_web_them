const fallbackUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://nextsoft.dev";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackUrl;
const normalizedSiteUrl = /^https?:\/\//i.test(rawSiteUrl)
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const siteUrl = normalizedSiteUrl.replace(/\/$/, "");