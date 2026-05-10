import type { Metadata } from "next";
import LadderClient from "./LadderClient";

// OG 이미지: /public/og-ladder.png (1200×630) 제작 후 아래 url을 "/og-ladder.png" 으로 교체
export const metadata: Metadata = {
  title: "사다리타기",
  description:
    "사다리타기 게임으로 누가 밥값 낼지 공정하게 정해요. 참가자와 항목을 입력하고 바로 시작, 결과 카카오 공유 가능.",
  keywords: ["사다리타기", "밥값 당번", "사다리 게임", "밥값 정하기", "랜덤 추첨"],
  openGraph: {
    type: "website",
    url: "https://mealplanner-19t.pages.dev/games/ladder",
    title: "사다리타기 — 밥값 당번 정하기",
    description:
      "사다리타기 게임으로 누가 밥값 낼지 공정하게 결정. 참가자·항목 입력 후 바로 시작, 결과 공유 가능.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "사다리타기 — 밥값 당번 정하기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "사다리타기",
    description: "사다리타기 게임으로 누가 밥값 낼지 공정하게 결정.",
  },
  alternates: {
    canonical: "https://mealplanner-19t.pages.dev/games/ladder",
  },
};

export default function LadderPage() {
  return <LadderClient />;
}
