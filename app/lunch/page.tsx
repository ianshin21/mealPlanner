import type { Metadata } from "next";
import LunchClient from "./LunchClient";

// OG 이미지: /public/og-lunch.png (1200×630) 제작 후 아래 url을 "/og-lunch.png" 으로 교체
export const metadata: Metadata = {
  title: "오늘 점심 뭐 먹지?",
  description:
    "현재 위치 기반으로 주변 점심 맛집을 즉시 추천해 드립니다. 매일 새로운 추천, 카카오맵 바로 연결.",
  keywords: ["점심 추천", "오늘 점심", "주변 맛집", "점심 메뉴 추천", "점심 뭐 먹지"],
  openGraph: {
    type: "website",
    url: "https://mealplanner-19t.pages.dev/lunch",
    title: "오늘 점심 뭐 먹지? — 주변 맛집 즉시 추천",
    description:
      "현재 위치 기반으로 주변 점심 맛집을 즉시 추천. 매일 새로운 추천, 카카오맵 바로 연결.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "오늘 점심 뭐 먹지? — 주변 맛집 즉시 추천",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘 점심 뭐 먹지?",
    description: "현재 위치 기반으로 주변 점심 맛집을 즉시 추천.",
  },
  alternates: {
    canonical: "https://mealplanner-19t.pages.dev/lunch",
  },
};

export default function LunchPage() {
  return <LunchClient />;
}
