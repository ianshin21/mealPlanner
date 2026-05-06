import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

/**
 * 사이트맵
 *
 * - baseUrl 은 `lib/site-config.ts` 의 단일 소스를 사용합니다.
 * - 새 라우트가 생기면 본 배열에 path 만 추가하세요.
 */

interface SitemapEntry {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

const ROUTES: SitemapEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/generate", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  // 블로그
  { path: "/blog/1in-diet-guide", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog/easy-korean-cooking", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog/healthy-meal-tips", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog/diet-for-weight-loss", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog/high-protein-meals", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog/meal-prep-tips", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog/budget-cooking", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog/two-person-cooking", changeFrequency: "monthly", priority: 0.8 },
  // 정책
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // siteConfig 참조를 1회 강제하여 단일 소스 사용을 명시
  void siteConfig.url;

  return ROUTES.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
