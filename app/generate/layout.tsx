import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

/**
 * /generate 페이지 메타데이터 — 입력(맞춤 식단 만들기) 페이지 톤으로 개별 최적화
 *
 * - title: 사용자가 직접 식단을 만드는 입력 페이지임이 명확히 드러나도록 구성
 *   (맞춤 식단 만들기 / 14·28일 / 1인·2인)
 * - description: 검색 스니펫용(약 150자), "회원가입 없이 바로 시작 / 건강 참고용" 강조
 * - og/twitter: SNS 공유 카드용 짧은 임팩트 버전 별도 사용
 *
 * /generate 페이지는 client component (`"use client"`) 라서 같은 파일에서
 * metadata 를 export 할 수 없으므로, 본 server-side layout 으로 메타만 분리합니다.
 * UI/카피 본문에는 영향 없음.
 */

const GENERATE_TITLE =
  "맞춤 식단 만들기 — 1인·2인 14·28일 식단 무료 생성";

const GENERATE_DESCRIPTION =
  "회원가입 없이 바로 시작하는 맞춤 식단 만들기. 1인·2인 가정의 14일 또는 28일치 점심·저녁 메뉴를, 목표·취향·알레르기를 반영해 자동으로 짜 드립니다. 일반 건강 참고용 정보입니다.";

const GENERATE_SOCIAL_TITLE =
  "내 조건에 맞는 14·28일 식단 — 1분 만에 무료로";

const GENERATE_SOCIAL_DESCRIPTION =
  "1인·2인 가정용 점심·저녁 식단을 회원가입 없이 바로 생성. 건강 참고용으로 가볍게 시작해 보세요.";

const baseMetadata = buildMetadata({
  title: GENERATE_TITLE,
  description: GENERATE_DESCRIPTION,
  path: "/generate",
});

export const metadata: Metadata = {
  ...baseMetadata,
  // titleTemplate 중복 적용 방지를 위해 절대 title 로 고정
  title: { absolute: GENERATE_TITLE },
  openGraph: {
    ...baseMetadata.openGraph,
    title: GENERATE_SOCIAL_TITLE,
    description: GENERATE_SOCIAL_DESCRIPTION,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: GENERATE_SOCIAL_TITLE,
    description: GENERATE_SOCIAL_DESCRIPTION,
  },
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
