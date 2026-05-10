// ──────────────────────────────────────────────────────────────────────────────
// Kakao Share SDK 유틸
//
// TODO (셋업 필수):
//   1. https://developers.kakao.com 에서 앱 등록 → JavaScript 키 발급
//   2. .env.local 에 추가:
//        NEXT_PUBLIC_KAKAO_APP_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//        NEXT_PUBLIC_SERVICE_URL=https://your-domain.com
//   3. Kakao 개발자 콘솔 → 플랫폼 → Web → 사이트 도메인에 서비스 도메인 등록
//      (미등록 시 SDK init 단계에서 차단됨)
// ──────────────────────────────────────────────────────────────────────────────

import { formatDistance } from "@/lib/places";

const KAKAO_APP_KEY  = process.env.NEXT_PUBLIC_KAKAO_APP_KEY  ?? "";
const SERVICE_URL    = process.env.NEXT_PUBLIC_SERVICE_URL    ?? "http://localhost:3000";

// TODO: OG 이미지 경로 확정 후 업데이트
const DEFAULT_IMAGE_URL = `${SERVICE_URL}/og-image.png`;

const SHARE_TITLES: Record<"lunch" | "party", string> = {
  lunch: "오늘 점심 후보 찾았어",
  party: "오늘 회식 후보 골라봤어",
};

// ── Kakao JS SDK 전역 타입 ────────────────────────────────────────────────────

interface KakaoLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoButton {
  title: string;
  link: KakaoLink;
}

interface KakaoFeedOptions {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: KakaoLink;
  };
  buttons?: KakaoButton[];
}

interface KakaoTextOptions {
  objectType: "text";
  text: string;          // 최대 200자 (Kakao 정책)
  link: KakaoLink;
  buttons?: KakaoButton[];
}

interface KakaoCustomOptions {
  templateId: number;
  templateArgs?: Record<string, string>;
}

interface KakaoSDK {
  init(key: string): void;
  isInitialized(): boolean;
  Share: {
    sendDefault(options: KakaoFeedOptions | KakaoTextOptions): void;
    sendCustom(options: KakaoCustomOptions): void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

// ── SDK 초기화 / 로드 ─────────────────────────────────────────────────────────

/**
 * SDK 초기화. 이미 초기화된 경우 아무 작업도 하지 않음.
 *
 * Next.js 권장 방법 — layout.tsx 에서 Script 로드 후 콜백으로 호출:
 *   <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
 *           crossOrigin="anonymous" onLoad={initKakaoSDK} />
 */
export function initKakaoSDK(): void {
  if (typeof window === "undefined" || !window.Kakao) return;
  if (window.Kakao.isInitialized()) return;
  window.Kakao.init(KAKAO_APP_KEY);
}

/**
 * Script 태그를 직접 삽입해 SDK를 동적으로 로드하고 초기화.
 * next/script 방식을 쓸 수 없는 환경에서 사용.
 *
 * TODO: integrity / crossorigin 해시는
 *       https://developers.kakao.com/docs/latest/ko/javascript/download 에서 확인
 * TODO: SDK 버전을 주기적으로 최신 버전으로 갱신
 */
export function loadKakaoSDK(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Kakao) {
    initKakaoSDK();
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.crossOrigin = "anonymous";
    script.onload  = () => { initKakaoSDK(); resolve(); };
    script.onerror = () => reject(new Error("Kakao SDK 로드 실패"));
    document.head.appendChild(script);
  });
}

/** SDK가 준비되어 공유 기능을 사용할 수 있는지 확인. 버튼 노출 조건으로 활용. */
export function isKakaoShareAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.Kakao &&
    window.Kakao.isInitialized() &&
    KAKAO_APP_KEY !== ""
  );
}

// ── 내부 헬퍼 ─────────────────────────────────────────────────────────────────

function getSDK(): KakaoSDK | null {
  if (
    typeof window === "undefined" ||
    !window.Kakao ||
    !window.Kakao.isInitialized()
  ) {
    console.warn("[kakao share] SDK가 초기화되지 않았습니다.");
    return null;
  }
  return window.Kakao;
}

function won(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

function pageLink(path: string): KakaoLink {
  const url = `${SERVICE_URL}${path}`;
  return { mobileWebUrl: url, webUrl: url };
}

// ── 범용 링크 공유 ────────────────────────────────────────────────────────────

export interface LinkShareOptions {
  title: string;
  description: string;
  imageUrl?: string;
  /** 서비스 내 경로. 예: "/lunch", "/games/ladder" */
  linkPath: string;
  buttonLabel?: string;
}

/** 피드(링크) 형태로 범용 공유. 특정 시나리오 함수로 커버되지 않을 때 사용. */
export function shareLink(options: LinkShareOptions): void {
  const sdk = getSDK();
  if (!sdk) return;

  const link = pageLink(options.linkPath);
  sdk.Share.sendDefault({
    objectType: "feed",
    content: {
      title:       options.title,
      description: options.description,
      imageUrl:    options.imageUrl ?? DEFAULT_IMAGE_URL,
      link,
    },
    buttons: [{ title: options.buttonLabel ?? "자세히 보기", link }],
  });
}

// ── 점심 / 회식 추천 공유 (피드 타입) ────────────────────────────────────────

export interface PlaceShareParams {
  type: "lunch" | "party";
  placeName: string;
  category: string;
  address?: string;
  distance?: number;            // meters
  estimatedPricePerPerson?: number;
  kakaoMapUrl?: string;
  imageUrl?: string;
}

/** 점심 또는 회식 추천 장소를 피드로 공유. 카카오맵 버튼을 함께 제공. */
export function sharePlace(params: PlaceShareParams): void {
  const sdk = getSDK();
  if (!sdk) return;

  const label    = params.type === "lunch" ? "점심" : "회식";
  const pagePath = params.type === "lunch" ? "/lunch" : "/party";
  const link     = pageLink(pagePath);

  const descParts: string[] = [params.category];
  if (params.distance != null)         descParts.push(formatDistance(params.distance));
  if (params.address)                  descParts.push(params.address);
  if (params.estimatedPricePerPerson)  descParts.push(`1인 약 ${won(params.estimatedPricePerPerson)}`);

  const buttons: KakaoButton[] = [{ title: `${label} 추천받기`, link }];
  if (params.kakaoMapUrl) {
    const mapLink: KakaoLink = { mobileWebUrl: params.kakaoMapUrl, webUrl: params.kakaoMapUrl };
    buttons.push({ title: "카카오맵에서 보기", link: mapLink });
  }

  sdk.Share.sendDefault({
    objectType: "feed",
    content: {
      title:       `${SHARE_TITLES[params.type]} — ${params.placeName}`,
      description: descParts.join(" · "),
      imageUrl:    params.imageUrl ?? DEFAULT_IMAGE_URL,
      link,
    },
    buttons,
  });
}

// ── 1/N 계산 결과 공유 (텍스트 타입) ─────────────────────────────────────────

export interface SplitShareParams {
  total: number;
  headcount: number;
  perPerson: number;
  roundUnit: 1 | 10 | 100 | 1000;
  separateAlcohol?: boolean;
  foodPerPerson?: number;
  alcoholPerPerson?: number;
  totalCollected?: number;
}

/**
 * 1/N 더치페이 계산 결과를 텍스트로 공유.
 * TODO: 항목이 많아 200자를 초과할 경우 Kakao SDK가 오류를 반환합니다.
 *       필요하다면 text.slice(0, 200) 로 안전하게 잘라내세요.
 */
export function shareSplit(params: SplitShareParams): void {
  const sdk = getSDK();
  if (!sdk) return;

  const roundNote =
    params.roundUnit === 1
      ? "원단위"
      : `${params.roundUnit.toLocaleString()}원 단위 올림`;

  const lines: string[] = [
    "더치페이 계산 결과",
    `총 금액  ${won(params.total)}`,
    `인원     ${params.headcount}명`,
    `1인당    ${won(params.perPerson)}  (${roundNote})`,
  ];

  if (params.separateAlcohol && params.foodPerPerson && params.alcoholPerPerson) {
    lines.push(`  음식값  ${won(params.foodPerPerson)}`);
    lines.push(`  술값    ${won(params.alcoholPerPerson)}`);
  }

  if (params.totalCollected && params.totalCollected > params.total) {
    const excess = params.totalCollected - params.total;
    lines.push(`총 걷는 금액 ${won(params.totalCollected)} (${won(excess)} 남음)`);
  }

  const link = pageLink("/tools/split");
  sdk.Share.sendDefault({
    objectType: "text",
    text: lines.join("\n"),
    link,
    buttons: [{ title: "계산기 열기", link }],
  });
}

// ── 사다리타기 결과 공유 (텍스트 타입) ───────────────────────────────────────

export interface LadderResult {
  name: string;
  prize: string;
}

export interface LadderShareParams {
  results: LadderResult[];
}

/**
 * 사다리타기 결과를 텍스트로 공유.
 * TODO: 참가자 8명이면 텍스트가 200자를 초과할 수 있습니다.
 *       초과 시 Kakao SDK 오류 → 필요하면 results 수를 제한하거나 text.slice(0, 200) 적용.
 */
export function shareLadder(params: LadderShareParams): void {
  const sdk = getSDK();
  if (!sdk) return;

  const lines: string[] = ["사다리타기 결과"];
  for (const r of params.results) {
    lines.push(`${r.name}  →  ${r.prize}`);
  }

  const link = pageLink("/games/ladder");
  sdk.Share.sendDefault({
    objectType: "text",
    text: lines.join("\n"),
    link,
    buttons: [{ title: "사다리타기 하기", link }],
  });
}
