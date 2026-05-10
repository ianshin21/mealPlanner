import type { Metadata } from "next";
import SplitClient from "./SplitClient";

// OG 이미지: /public/og-split.png (1200×630) 제작 후 아래 url을 "/og-split.png" 으로 교체
export const metadata: Metadata = {
  title: "1/N 더치페이 계산기",
  description:
    "점심값, 회식비, 술값을 인원 수로 나눠 1인당 금액을 빠르게 계산하세요. 음식·술값 분리, 단위 올림, 카카오 공유 지원.",
  keywords: ["더치페이 계산기", "1/N 계산", "회식비 계산", "점심값 나누기", "술값 계산"],
  openGraph: {
    type: "website",
    url: "https://mealplanner-19t.pages.dev/tools/split",
    title: "1/N 더치페이 계산기 — 점심·회식비",
    description:
      "점심값·회식비·술값을 인원 수로 나눠 1인당 금액을 즉시 계산. 음식·술값 분리, 단위 올림 지원.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "1/N 더치페이 계산기 — 점심·회식비",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "1/N 더치페이 계산기",
    description: "점심값·회식비를 인원 수로 나눠 1인당 금액을 즉시 계산.",
  },
  alternates: {
    canonical: "https://mealplanner-19t.pages.dev/tools/split",
  },
};

export default function SplitPage() {
  return <SplitClient />;
}
