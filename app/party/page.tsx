import type { Metadata } from "next";
import PartyClient from "./PartyClient";

// OG 이미지: /public/og-party.png (1200×630) 제작 후 아래 url을 "/og-party.png" 으로 교체
export const metadata: Metadata = {
  title: "오늘 회식 어디서 하지?",
  description:
    "인원, 예산, 분위기에 맞는 회식 장소를 즉시 추천해 드립니다. 현재 위치 기반, 중복 방지, 카카오맵 바로 연결.",
  keywords: ["회식 장소 추천", "오늘 회식", "회식 메뉴", "회식 어디서", "회식 맛집"],
  openGraph: {
    type: "website",
    url: "https://mealplanner-19t.pages.dev/party",
    title: "오늘 회식 어디서 하지? — 회식 장소 즉시 추천",
    description:
      "인원·예산·분위기에 맞는 회식 장소를 즉시 추천. 카카오맵 바로 연결.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "오늘 회식 어디서 하지? — 회식 장소 즉시 추천",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘 회식 어디서 하지?",
    description: "인원·예산·분위기에 맞는 회식 장소를 즉시 추천.",
  },
  alternates: {
    canonical: "https://mealplanner-19t.pages.dev/party",
  },
};

export default function PartyPage() {
  return <PartyClient />;
}
