/**
 * 사이트 전역 설정 단일 소스 (Single Source of Truth)
 *
 * - 운영 도메인은 `NEXT_PUBLIC_SITE_URL` 환경변수로 주입합니다.
 *   설정되지 않은 경우 `DEFAULT_SITE_URL` 을 fallback 으로 사용합니다.
 * - canonical / openGraph.url / twitter / sitemap / robots 등 모든 곳에서
 *   본 모듈의 값을 참조하도록 통일합니다.
 * - 새 운영 도메인이 정해지면 환경변수만 교체하면 됩니다.
 */

const DEFAULT_SITE_URL = "https://mealplanner-19t.pages.dev";

/**
 * 끝의 슬래시를 제거하고 정규화한 URL 을 반환합니다.
 * (Next.js metadataBase / canonical 모두 trailing slash 가 없는 형태를 권장)
 */
function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim().length > 0
    ? process.env.NEXT_PUBLIC_SITE_URL
    : DEFAULT_SITE_URL;

export const siteConfig = {
  /** 사이트 root URL (trailing slash 제거된 형태) */
  url: normalizeUrl(RAW_SITE_URL),

  /** 기본 사이트 이름 */
  name: "자동 식단 생성기",

  /** 사이트 기본 title (홈 등 default title) */
  defaultTitle: "자동 식단 생성기 | 1인·2인 가정을 위한 14·28일 식단",

  /** 페이지별 title 에 적용되는 template ("페이지명 | 자동 식단 생성기") */
  titleTemplate: "%s | 자동 식단 생성기",

  /** 사이트 기본 description */
  defaultDescription:
    "회원가입 없이 바로 사용하는 1인·2인 가정용 자동 식단 생성기. 14일 또는 28일치 점심·저녁 식단을 목표와 취향에 맞게 자동으로 만들어 드립니다.",

  /** 짧은 description (OG/Twitter 카드용) */
  shortDescription:
    "회원가입 없이 바로 사용. 14일 또는 28일치 점심·저녁 식단을 자동으로 만들어 드립니다.",

  /** 로케일 */
  locale: "ko_KR",
  language: "ko",

  /** 키워드 */
  keywords: [
    "식단 생성기",
    "1인 가정 식단",
    "2인 가정 식단",
    "다이어트 식단",
    "건강 식단",
    "14일 식단",
    "28일 식단",
    "점심 저녁 식단",
    "한식 식단",
    "쉬운 요리",
  ],

  /** OG 이미지 (사이트 root 기준 절대 경로) */
  ogImage: {
    path: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "자동 식단 생성기",
  },

  /** Twitter 카드 타입 */
  twitter: {
    card: "summary_large_image" as const,
  },

  /** Google AdSense Publisher ID (메타태그 검증용) */
  adsensePublisherId: "ca-pub-5247269257735944",
} as const;

/**
 * site-relative path 를 받아 절대 URL 로 만들어 줍니다.
 * 빈 문자열·"/" 입력 시 사이트 root 가 반환됩니다.
 */
export function absoluteUrl(path: string = "/"): string {
  if (!path || path === "/") return siteConfig.url;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
