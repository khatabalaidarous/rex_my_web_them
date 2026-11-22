import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Next Soft — نكست سوفت",
    short_name: "Next Soft",
    description:
      "فريق هندسة وتطوير برمجيات يبني تطبيقات الويب عالية الأداء والمنتجات الرقمية بالعربية والإنجليزية.",
    start_url: "/ar",
    scope: "/",
    lang: "ar",
    dir: "rtl",
    display: "standalone",
    background_color: "#06060a",
    theme_color: "#06060a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}