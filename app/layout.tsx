import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://meal-planner.pages.dev"),
  title: {
    default: "자동 식단 생성기 | 1인·2인 가정을 위한 14·28일 식단",
    template: "%s | 자동 식단 생성기",
  },
  description:
    "회원가입 없이 바로 사용하는 1인·2인 가정용 자동 식단 생성기. 14일 또는 28일치 점심·저녁 식단을 목표와 취향에 맞게 자동으로 만들어 드립니다.",
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
    url: "https://meal-planner.pages.dev",
    siteName: "자동 식단 생성기",
    title: "자동 식단 생성기 | 1인·2인 가정용 14·28일 식단",
    description:
      "회원가입 없이 바로 사용. 14일 또는 28일치 점심·저녁 식단을 자동으로 만들어 드립니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "자동 식단 생성기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "자동 식단 생성기",
    description: "1인·2인 가정을 위한 14·28일 자동 식단 생성기",
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
    canonical: "https://meal-planner.pages.dev",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Google AdSense - replace with actual publisher ID */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
