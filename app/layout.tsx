import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";

/**
 * 루트 metadata
 *
 * - 모든 도메인/타이틀/디스크립션은 `lib/site-config.ts` 의 단일 소스를 사용합니다.
 * - 페이지별 metadata 가 없는 경우 본 metadata 의 default 가 그대로 적용됩니다.
 * - 페이지별 metadata 는 `lib/seo.ts` 의 `buildMetadata({ title, path, ... })` 헬퍼로 작성합니다.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  // 공통 메타 (description / openGraph / twitter / robots / canonical / keywords)
  ...buildMetadata({ path: "/" }),
  // AdSense 계정 메타태그
  other: {
    "google-adsense-account": siteConfig.adsensePublisherId,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteConfig.language}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsensePublisherId}`}
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
