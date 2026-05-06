import type { Metadata } from "next";
import { siteConfig, absoluteUrl } from "./site-config";

/**
 * 페이지별 Metadata 빌더
 *
 * - 사용처: 각 페이지의 `export const metadata = buildMetadata({...})`
 * - canonical / openGraph.url / openGraph.images / twitter.images 를 한 번에 일관되게 채워 줍니다.
 * - `path` 만 넘기면 canonical 과 og:url 이 자동 정합화됩니다.
 *
 * 예) buildMetadata({ title: "내 맞춤 식단 만들기", path: "/generate" })
 */

export interface BuildMetadataOptions {
  /** 페이지 제목 (titleTemplate 가 적용됨). 미지정 시 사이트 기본 title 사용 */
  title?: string;
  /** 페이지 설명. 미지정 시 사이트 기본 description 사용 */
  description?: string;
  /** site-relative path. 예: "/", "/generate", "/blog/foo" */
  path?: string;
  /** OG/Twitter 카드 이미지 경로 override (기본: siteConfig.ogImage.path) */
  ogImagePath?: string;
  /** 색인 차단 여부 */
  noIndex?: boolean;
  /** 키워드 override (미지정 시 사이트 기본 키워드 사용) */
  keywords?: string[];
}

export function buildMetadata(options: BuildMetadataOptions = {}): Metadata {
  const {
    title,
    description = siteConfig.defaultDescription,
    path = "/",
    ogImagePath = siteConfig.ogImage.path,
    noIndex = false,
    keywords = [...siteConfig.keywords],
  } = options;

  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(ogImagePath);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: title ?? siteConfig.defaultTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: siteConfig.ogImage.alt,
        },
      ],
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: title ?? siteConfig.defaultTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
