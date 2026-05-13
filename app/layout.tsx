import type { Metadata } from "next";
import "./globals.css";
import KakaoSDKScript from "@/components/KakaoSDKScript";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mealplanner-19t.pages.dev";
const siteName = "자동 식단 생성기";
const defaultTitle = "자동 식단 생성기 | 1인·2인 맞춤 식단 14·28일 자동 생성";
const defaultDescription =
  "회원가입 없이 1인·2인 맞춤 식단을 자동으로 생성해보세요. 14일·28일 식단을 간편하게 만듭니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
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
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "자동 식단 생성기 서비스 소개 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.png"],
  },
  robots: {
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
  alternates: {
    canonical: "/",
  },
  other: {
    "google-adsense-account": "ca-pub-5247269257735944",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta property="fb:app_id" content="1475424594316558" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5247269257735944" crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <KakaoSDKScript />
        {children}
      </body>
    </html>
  );
}
