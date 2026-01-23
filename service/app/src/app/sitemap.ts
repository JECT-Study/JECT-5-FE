import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://re-creation.vercel.app",
      lastModified: new Date(),
    },
  ]
}
