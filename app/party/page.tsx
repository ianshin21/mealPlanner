import type { Metadata } from "next";
import PartyClient from "./PartyClient";

export const metadata: Metadata = {
  title: "오늘 회식 어디서 하지? — 회식 장소 추천",
  description:
    "인원, 예산, 분위기에 맞는 회식 장소를 추천해 드립니다. 현재 위치 기반, 중복 방지, 카카오맵 바로 연결.",
  openGraph: {
    title: "오늘 회식 어디서 하지?",
    description: "인원, 예산, 분위기에 맞는 회식 메뉴 추천",
  },
};

export default function PartyPage() {
  return <PartyClient />;
}
