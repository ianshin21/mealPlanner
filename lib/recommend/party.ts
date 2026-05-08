/**
 * 회식 추천 로직 (순수 함수, UI·API·localStorage 의존 없음)
 *
 * 점수 구성 (최대 125점):
 *   회식 적합도       0~35점  — 단체 회식에 어울리는 카테고리일수록 높음
 *   주류 일치도       0~25점  — 술 포함/제외 선택과 업장 성격 일치 여부
 *   메뉴 스타일 일치  0~25점  — 고기·한식·해산물·이자카야·기타 선호 일치
 *   분위기 일치도     0~15점  — 시끌벅적·무난·조용함과 업장 특성 일치 여부
 *   예산 적합도       0~15점  — 1인 예상 금액이 예산 이하인 경우 높음
 *   단체 수용 적합도  0~10점  — 인원 규모에 맞는 업장 규모 추정
 *
 * 사용 예시:
 *   const results = recommendParty({ places, preferences, history });
 *   // results[0] 이 최우선 추천, 총 5개 반환
 */

import type { Place } from "@/lib/types/place";

// 공유 타입: lunch.ts 에서 재-export
export type { DedupPeriod, PlaceHistoryItem } from "./lunch";
import type { DedupPeriod, PlaceHistoryItem } from "./lunch";

// ────────────────────────────────────────────
// 회식 전용 타입
// ────────────────────────────────────────────

export type Headcount    = "2-3" | "4-6" | "7-10" | "10+";
export type PartyBudget  = "10000" | "20000" | "30000" | "any";
export type MenuStyle    = "meat" | "korean" | "seafood" | "izakaya" | "other";
export type Atmosphere   = "lively" | "normal" | "quiet";

/** 회식 폼 입력값 */
export interface PartyPreferences {
  headcount: Headcount;
  budget: PartyBudget;
  includeAlcohol: boolean;
  menuStyles: MenuStyle[];      // 빈 배열 = 무관
  atmosphere: Atmosphere;
  dedupPeriod: DedupPeriod;
}

/** 항목별 점수 내역 (디버깅·테스트용) */
export interface PartyScoreBreakdown {
  partySuitability: number;    // 0~35
  alcoholMatch: number;        // 0~25
  menuStyleMatch: number;      // 0~25
  atmosphereMatch: number;     // 0~15
  budgetMatch: number;         // 0~15
  headcountSuitability: number; // 0~10
  total: number;               // 0~125
}

/** 점수가 부여된 장소 (디버깅·테스트용) */
export interface ScoredPartyPlace {
  place: Place;
  breakdown: PartyScoreBreakdown;
}

/** recommendParty 입력 */
export interface PartyRecommendOptions {
  places: Place[];
  preferences: PartyPreferences;
  history?: PlaceHistoryItem[];
  count?: number; // 반환할 최대 개수 (기본 5)
}

// ────────────────────────────────────────────
// 상수
// ────────────────────────────────────────────

/**
 * 회식 적합 카테고리 → 가산 점수 (첫 번째 매칭만 적용)
 * 전골/구이/회처럼 단체 주문이 자연스러운 업종에 높은 점수
 */
const PARTY_POSITIVE: [string, number][] = [
  ["고기",     35],
  ["구이",     35],
  ["이자카야", 35],
  ["전골",     33],
  ["샤브",     33],
  ["회",       30],
  ["해산물",   30],
  ["포차",     28],
  ["조개",     28],
  ["육류",     26],
  ["한식",     20],
  ["중식",     18],
  ["양식",     15],
  ["일식",     15],
  ["치킨",     18],
  ["닭갈비",   22],
  ["양꼬치",   22],
];

/**
 * 회식에 부적합한 키워드 → 차감 점수
 * 단체 주문이 어렵거나 회식 분위기에 맞지 않는 업종
 */
const PARTY_NEGATIVE: [string, number][] = [
  ["카페",     20],
  ["도시락",   20],
  ["분식",     15],
  ["샐러드",   15],
  ["패스트푸드", 15],
  ["편의",     15],
];

/** 술 포함 시 가산 점수를 받는 업종 키워드 */
const ALCOHOL_FRIENDLY: string[] = [
  "이자카야", "술집", "포차", "호프", "맥주", "막걸리",
];
/** 술 제외 시 차감을 받는 업종 키워드 (주류 특화 업장) */
const ALCOHOL_HEAVY: string[] = [
  "이자카야", "술집", "포차", "호프",
];
/** 술과 자연스럽게 어울리는 음식 업종 */
const ALCOHOL_COMPATIBLE: string[] = [
  "고기", "구이", "회", "해산물", "전골", "치킨", "양꼬치",
];

/** MenuStyle → 카테고리 매칭 키워드 */
const MENU_STYLE_KEYWORDS: Record<MenuStyle, string[]> = {
  meat:     ["고기", "구이", "육류", "삼겹", "갈비", "막창", "곱창", "닭갈비", "양꼬치"],
  korean:   ["한식", "전골", "찌개", "국밥", "샤브", "닭갈비"],
  seafood:  ["해산물", "회", "조개", "횟집", "낙지", "꼼장어"],
  izakaya:  ["이자카야", "술집", "포차", "호프"],
  other:    [], // 빈 배열 = 나머지 모두 매칭
};

/** 분위기별 가산 카테고리 키워드 */
const ATMOSPHERE_BOOST: Record<Atmosphere, string[]> = {
  lively:  ["이자카야", "포차", "고기", "구이", "호프", "치킨", "양꼬치"],
  normal:  [], // 모든 업종 중립
  quiet:   ["양식", "일식", "샤브", "전골"],
};
/** 분위기별 차감 카테고리 키워드 */
const ATMOSPHERE_PENALTY: Record<Atmosphere, string[]> = {
  lively:  ["양식", "일식"], // fine dining 스타일
  normal:  [],
  quiet:   ["이자카야", "포차", "호프", "치킨"],
};

/** PartyBudget → 원화 상한 */
const BUDGET_CEILING: Record<PartyBudget, number | null> = {
  "10000": 10000,
  "20000": 20000,
  "30000": 30000,
  "any":   null,
};

/** DedupPeriod → 밀리초 */
const DEDUP_MS: Record<DedupPeriod, number | null> = {
  none:  null,
  "7d":  7  * 24 * 60 * 60 * 1000,
  "14d": 14 * 24 * 60 * 60 * 1000,
};

/** 인원 규모에 따른 단체 친화 업종 (큰 인원일수록 더 중요) */
const GROUP_FRIENDLY: string[] = [
  "고기", "구이", "이자카야", "전골", "샤브", "포차", "해산물", "한식", "중식", "치킨",
];
const GROUP_UNFRIENDLY: string[] = [
  "카페", "패스트푸드", "도시락", "분식", "샐러드",
];

// ────────────────────────────────────────────
// 점수 산정 함수
// ────────────────────────────────────────────

/** 회식 적합도: 베이스 10점 + 회식 친화 키워드 가감 */
function scorePartySuitability(category: string): number {
  let score = 10;

  for (const [kw, pts] of PARTY_POSITIVE) {
    if (category.includes(kw)) { score += pts; break; }
  }
  for (const [kw, pts] of PARTY_NEGATIVE) {
    if (category.includes(kw)) { score -= pts; break; }
  }

  return Math.max(0, Math.min(35, score));
}

/**
 * 주류 일치도
 * - includeAlcohol=true: 주류 특화 업장 최고점, 음식+술 겸업 중간점
 * - includeAlcohol=false: 주류 특화 업장 감점, 일반 음식점 최고점
 */
function scoreAlcoholMatch(category: string, includeAlcohol: boolean): number {
  const isAlcoholHeavy    = ALCOHOL_HEAVY.some((kw) => category.includes(kw));
  const isAlcoholFriendly = ALCOHOL_FRIENDLY.some((kw) => category.includes(kw));
  const isCompatible      = ALCOHOL_COMPATIBLE.some((kw) => category.includes(kw));

  if (includeAlcohol) {
    if (isAlcoholHeavy)    return 25; // 이자카야·포차 등 주류 특화
    if (isCompatible)      return 15; // 고기집·회 등 술과 잘 어울림
    if (isAlcoholFriendly) return 18;
    return 5;                         // 일반 음식점 (술 주문은 가능)
  } else {
    if (isAlcoholHeavy)    return 0;  // 술 위주 업장 → 부적합
    return 25;                        // 일반 음식점 → 적합
  }
}

/**
 * 메뉴 스타일 일치도
 * - menuStyles 빈 배열: 무관 선택 → 전원 25점
 * - "other" 포함: 선택된 다른 스타일에 매칭 없는 경우도 허용 → 20점
 */
function scoreMenuStyleMatch(place: Place, menuStyles: MenuStyle[]): number {
  if (menuStyles.length === 0) return 25;

  for (const style of menuStyles) {
    if (style === "other") continue;
    const keywords = MENU_STYLE_KEYWORDS[style];
    if (keywords.some((kw) => place.category.includes(kw))) return 25;
  }

  // "other" 선택 포함 시: 위에서 매칭 안 된 경우도 20점
  if (menuStyles.includes("other")) return 20;

  return 0;
}

/**
 * 분위기 일치도
 * - lively/quiet: 해당 분위기 업종 가산, 상반된 분위기 차감
 * - normal: 모든 업종 8점 (중립)
 */
function scoreAtmosphereMatch(category: string, atmosphere: Atmosphere): number {
  if (atmosphere === "normal") return 8;

  const hasBoost   = ATMOSPHERE_BOOST[atmosphere].some((kw) => category.includes(kw));
  const hasPenalty = ATMOSPHERE_PENALTY[atmosphere].some((kw) => category.includes(kw));

  if (hasBoost)   return 15;
  if (hasPenalty) return 2;
  return 8; // 명시적 매칭 없으면 중립
}

/**
 * 예산 적합도 (party budget 기준)
 * - 이하: 15점 / 30% 초과까지: 8점 / 초과: 0점 / 가격 정보 없음: 10점
 */
function scoreBudgetMatch(place: Place, budget: PartyBudget): number {
  const ceiling = BUDGET_CEILING[budget];
  if (ceiling === null) return 15;
  const price = place.estimatedPricePerPerson;
  if (price === undefined) return 10;
  if (price <= ceiling) return 15;
  if (price <= ceiling * 1.3) return 8;
  return 0;
}

/**
 * 단체 수용 적합도
 * 인원이 많을수록 단체 친화 업종이 중요해짐.
 * 카카오 API는 단체석 여부를 직접 제공하지 않으므로 카테고리로 추정.
 */
function scoreHeadcountSuitability(category: string, headcount: Headcount): number {
  const isGroupFriendly   = GROUP_FRIENDLY.some((kw) => category.includes(kw));
  const isGroupUnfriendly = GROUP_UNFRIENDLY.some((kw) => category.includes(kw));

  switch (headcount) {
    case "10+":
      if (isGroupFriendly)   return 10;
      if (isGroupUnfriendly) return 0;
      return 5;
    case "7-10":
      if (isGroupFriendly)   return 8;
      if (isGroupUnfriendly) return 2;
      return 5;
    case "4-6":
      return 7; // 중간 인원 → 대부분 무난
    case "2-3":
      return isGroupUnfriendly ? 4 : 7; // 소수 인원 → 부적합한 업종도 어느 정도 가능
  }
}

// ────────────────────────────────────────────
// 공개 함수
// ────────────────────────────────────────────

/**
 * 전체 점수 계산 (결과 반환 없음, 디버깅·테스트용)
 *
 * @example
 * const scored = scorePlacesForParty({ places, preferences, history });
 * console.table(scored.map(s => ({ name: s.place.name, ...s.breakdown })));
 */
export function scorePlacesForParty({
  places,
  preferences,
  history = [],
}: Omit<PartyRecommendOptions, "count">): ScoredPartyPlace[] {
  return places.map((place) => {
    const partySuitability    = scorePartySuitability(place.category);
    const alcoholMatch        = scoreAlcoholMatch(place.category, preferences.includeAlcohol);
    const menuStyleMatch      = scoreMenuStyleMatch(place, preferences.menuStyles);
    const atmosphereMatch     = scoreAtmosphereMatch(place.category, preferences.atmosphere);
    const budgetMatch         = scoreBudgetMatch(place, preferences.budget);
    const headcountSuitability = scoreHeadcountSuitability(place.category, preferences.headcount);
    const total =
      partySuitability + alcoholMatch + menuStyleMatch +
      atmosphereMatch + budgetMatch + headcountSuitability;

    return {
      place,
      breakdown: {
        partySuitability,
        alcoholMatch,
        menuStyleMatch,
        atmosphereMatch,
        budgetMatch,
        headcountSuitability,
        total,
      },
    };
  });
}

/**
 * 회식 추천 메인 함수
 *
 * 처리 순서:
 *   1. 회식 이력 기반 중복 제거 (hard filter)
 *   2. 점수 계산 (6개 항목)
 *   3. 같은 카테고리 반복 억제 (diversity reranking, 패널티 8점)
 *   4. 점수 내림차순 정렬 → 상위 count개 반환
 *
 * @returns 추천 Place[] (최대 count개)
 */
export function recommendParty({
  places,
  preferences,
  history = [],
  count = 5,
}: PartyRecommendOptions): Place[] {
  const now = Date.now();

  // ── 1. 중복 이력 필터 (type === "party" 이력만 참조)
  const dedupWindow = DEDUP_MS[preferences.dedupPeriod];
  const excludedIds = new Set(
    dedupWindow === null
      ? []
      : history
          .filter((h) => h.type === "party" && now - h.selectedAt < dedupWindow)
          .map((h) => h.placeId)
  );

  const candidates = places.filter((p) => !excludedIds.has(p.id));
  if (candidates.length === 0) return [];

  // ── 2. 점수 계산
  const scored = scorePlacesForParty({ places: candidates, preferences, history });
  scored.sort((a, b) => b.breakdown.total - a.breakdown.total);

  // ── 3. 카테고리 다양성 보장
  //       회식은 점심보다 특정 메뉴 선호가 강하므로 패널티를 낮게(8점) 설정
  const categoryCount: Record<string, number> = {};
  const reranked = scored.map((item) => {
    const cat  = item.place.category;
    const seen = categoryCount[cat] ?? 0;
    categoryCount[cat] = seen + 1;
    return {
      ...item,
      breakdown: { ...item.breakdown, total: item.breakdown.total - seen * 8 },
    };
  });
  reranked.sort((a, b) => b.breakdown.total - a.breakdown.total);

  // ── 4. 상위 count개 반환
  return reranked.slice(0, count).map((s) => s.place);
}
