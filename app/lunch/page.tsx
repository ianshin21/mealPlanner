import type { Metadata } from "next";
import LunchClient from "./LunchClient";

export const metadata: Metadata = {
  title: "오늘 점심 뭐 먹지? — 주변 맛집 즉시 추천",
  description: "현재 위치 기반으로 주변 점심 맛집을 추천해 드립니다. 매일 새로운 추천, 중복 없이.",
  openGraph: {
    title: "오늘 점심 뭐 먹지?",
    description: "주변 맛집과 메뉴를 빠르게 추천받으세요",
  },
};

export default function LunchPage() {
  return <LunchClient />;
}
