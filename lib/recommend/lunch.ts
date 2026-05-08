/**
 * 점심 추천 로직 (순수 함수, UI·API·localStorage 의존 없음)
 *
 * 점수 구성 (총 120점 만점):
 *   거리 적합도     0~40점  — 가까울수록 높음
 *   점심 카테고리   0~30점  — 점심에 어울리는 메뉴일수록 높음
 *   선호 카테고리   0~25점  — 사용자가 선택한 카테고리와 일치 여부
 *   예산 적합도     0~15점  — 예상 가격이 예산 이하인 경우 높음
 *   즐겨찾기 가중치 0~10점  — 즐겨찾기 식당과 같은 카테고리면 가산
 *
 * 사용 예시:
 *   const results = recommendLunch({ places, preferences, history, favorites });
 *   // results[0] 이 최우선 추천, 총 5개 반환
 */

import type { Place } from "@/lib/types/place";

// ────────────────────────────────────────────
// 공유 타입 (LunchClient, PartyClient 에서 import 가능)
// ────────────────────────────────────────────

export type FoodCategory =
  | "korean" | "chinese" | "japanese" | "western" | "snack" | "salad" | "any";

export type LunchBudget = "5000" | "8000" | "10000" | "15000" | "any";

export type WalkDistance = "300" | "500" | "1000" | "any";

export type DedupPeriod = "none" | "7d" | "14d";

/** localStorage 방문 이력 항목 */
export interface PlaceHistoryItem {
  placeId: string;
  placeName: string;
  type: "lunch" | "party";
  selectedAt: number; // timestamp ms
}

/** localStorage 즐겨찾기 항목 */
export interface FavoritePlace {
  placeId: string;
  placeName: string;
  category: string;
  kakaoMapUrl: string;
  savedAt: number; // timestamp ms
}

/** 점심 폼 입력값 */
export interface LunchPreferences {
  categories: FoodCategory[];
  budget: LunchBudget;
  walkDistance: WalkDistance;
  dedupPeriod: DedupPeriod;
}

/** 항목별 점수 내역 (디버깅·테스트용) */
export interface ScoreBreakdown {
  distance: number;         // 0~40
  lunchSuitability: number; // 0~30
  categoryMatch: number;    // 0~25
  budgetMatch: number;      // 0~15
  favoritesBoost: number;   // 0~10
  total: number;            // 0~120
}

/** 점수가 부여된 장소 (디버깅·테스트용) */
export interface ScoredPlace {
  place: Place;
  breakdown: ScoreBreakdown;
}

/** recommendLunch 입력 */
export interface LunchRecommendOptions {
  places: Place[];
  preferences: LunchPreferences;
  history?: PlaceHistoryItem[];
  favorites?: FavoritePlace[];
  count?: number; // 반환할 최대 개수 (기본 5)
}

// ────────────────────────────────────────────
// 상수
// ────────────────────────────────────────────

/**
 * 점심에 적합한 카테고리 키워드 → 가산 점수
 * place.category 는 "한식", "분식" 등 중분류 레이블
 */
const LUNCH_POSITIVE: [string, number][] = [
  ["한식",   30],
  ["국밥",   30],
  ["찌개",   28],
  ["분식",   25],
  ["도시락", 25],
  ["칼국수", 22],
  ["냉면",   22],
  ["덮밥",   22],
  ["비빔",   20],
  ["샐러드", 20],
  ["샌드위치", 20],
  ["일식",   18],
  ["중식",   18],
  ["양식",   15],
  ["고기",   15],
  ["카페",   8 ],
];

/**
 * 점심에 부적합한 키워드 → 차감 점수
 */
const LUNCH_NEGATIVE: [string, number][] = [
  ["이자카야", 20],
  ["술집",     20],
  ["포차",     15],
  ["호프",     15],
  ["노래",     10],
];

/** FoodCategory → 카테고리 매칭 키워드 */
const CATEGORY_KEYWORDS: Record<FoodCategory, string[]> = {
  korean:   ["한식", "국밥", "찌개", "칼국수", "냉면", "비빔"],
  chinese:  ["중식"],
  japanese: ["일식", "초밥", "라멘"],
  western:  ["양식", "샌드위치"],
  snack:    ["분식", "도시락"],
  salad:    ["샐러드", "건강식"],
  any:      [], // 빈 배열 = 모든 카테고리 매칭
};

/** Budget → 원화 상한 (null = 제한 없음) */
const BUDGET_CEILING: Record<LunchBudget, number | null> = {
  "5000":  5000,
  "8000":  8000,
  "10000": 10000,
  "15000": 15000,
  "any":   null,
};

/** WalkDistance → 미터 상한 (null = 제한 없음) */
const WALK_CEILING: Record<WalkDistance, number | null> = {
  "300":  300,
  "500":  500,
  "1000": 1000,
  "any":  null,
};

/** DedupPeriod → 밀리초 (null = 제한 없음) */
const DEDUP_MS: Record<DedupPeriod, number | null> = {
  none:  null,
  "7d":  7  * 24 * 60 * 60 * 1000,
  "14d": 14 * 24 * 60 * 60 * 1000,
};

// ────────────────────────────────────────────
// 점수 산정 함수 (각각 독립적)
// ────────────────────────────────────────────

/** 거리 점수: 0m → 40점, 1000m → 0점, 선형 감소 */
function scoreDistance(meters: number): number {
  return Math.max(0, Math.round(40 * (1 - meters / 1000)));
}

/**
 * 점심 적합도 점수: 베이스 15점에서 키워드 가감
 * 점심에 어울리는 카테고리면 가산, 저녁/회식 특화 카테고리면 차감
 */
function scoreLunchSuitability(category: string): number {
  let score = 15; // 중립 베이스

  for (const [kw, pts] of LUNCH_POSITIVE) {
    if (category.includes(kw)) {
      score += pts;
      break; // 첫 번째 매칭만 적용 (중복 가산 방지)
    }
  }
  for (const [kw, pts] of LUNCH_NEGATIVE) {
    if (category.includes(kw)) {
      score -= pts;
      break;
    }
  }

  return Math.max(0, Math.min(30, score));
}

/**
 * 선호 카테고리 점수: 사용자가 선택한 카테고리와 일치하면 25점
 * 선호 없음(categories 빈 배열)이면 모두 25점 (중립)
 */
function scoreCategoryMatch(place: Place, categories: FoodCategory[]): number {
  if (categories.length === 0) return 25;

  for (const cat of categories) {
    const keywords = CATEGORY_KEYWORDS[cat];
    // "any" 또는 키워드 목록이 빈 경우 전부 매칭
    if (keywords.length === 0) return 25;
    if (keywords.some((kw) => place.category.includes(kw))) return 25;
  }
  return 0;
}

/**
 * 예산 적합도 점수
 * - 예산 이하: 15점
 * - 예산 30% 초과까지: 8점 (약간 비쌈)
 * - 초과: 0점
 * - 가격 정보 없음: 10점 (중립)
 */
function scoreBudgetMatch(place: Place, budget: LunchBudget): number {
  const ceiling = BUDGET_CEILING[budget];
  if (ceiling === null) return 15; // 상관없음 선택
  const price = place.estimatedPricePerPerson;
  if (price === undefined) return 10;
  if (price <= ceiling) return 15;
  if (price <= ceiling * 1.3) return 8;
  return 0;
}

/**
 * 즐겨찾기 카테고리 가중치
 * 즐겨찾기 식당과 같은 카테고리면 +10점
 */
function scoreFavoritesBoost(place: Place, favorites: FavoritePlace[]): number {
  return favorites.some((fav) => fav.category === place.category) ? 10 : 0;
}

// ────────────────────────────────────────────
// 공개 함수
// ────────────────────────────────────────────

/**
 * 전체 점수 계산 (결과 반환 없음, 디버깅·테스트용)
 *
 * @example
 * const scored = scorePlaces({ places, preferences, history, favorites });
 * console.log(scored.map(s => `${s.place.name}: ${s.breakdown.total}`));
 */
export function scorePlaces({
  places,
  preferences,
  history = [],
  favorites = [],
}: Omit<LunchRecommendOptions, "count">): ScoredPlace[] {
  return places.map((place) => {
    const distance         = scoreDistance(place.distance);
    const lunchSuitability = scoreLunchSuitability(place.category);
    const categoryMatch    = scoreCategoryMatch(place, preferences.categories);
    const budgetMatch      = scoreBudgetMatch(place, preferences.budget);
    const favoritesBoost   = scoreFavoritesBoost(place, favorites);
    const total            = distance + lunchSuitability + categoryMatch + budgetMatch + favoritesBoost;

    return {
      place,
      breakdown: { distance, lunchSuitability, categoryMatch, budgetMatch, favoritesBoost, total },
    };
  });
}

/**
 * 점심 추천 메인 함수
 *
 * 처리 순서:
 *   1. 이력 기반 중복 제거 (hard filter)
 *   2. 도보 거리 필터 (hard filter)
 *   3. 항목별 점수 계산
 *   4. 같은 카테고리 반복 억제 (diversity reranking)
 *   5. 점수 내림차순 정렬 → 상위 count개 반환
 *
 * @returns 추천 Place[] (최대 count개, 부족하면 그 이하)
 */
export function recommendLunch({
  places,
  preferences,
  history = [],
  favorites = [],
  count = 5,
}: LunchRecommendOptions): Place[] {
  const now = Date.now();

  // ── 1. 중복 이력 필터
  const dedupWindow = DEDUP_MS[preferences.dedupPeriod];
  const excludedIds = new Set(
    dedupWindow === null
      ? []
      : history
          .filter((h) => h.type === "lunch" && now - h.selectedAt < dedupWindow)
          .map((h) => h.placeId)
  );

  // ── 2. 도보 거리 필터
  const maxWalk = WALK_CEILING[preferences.walkDistance];

  const candidates = places.filter((p) => {
    if (excludedIds.has(p.id)) return false;
    if (maxWalk !== null && p.distance > maxWalk) return false;
    return true;
  });

  if (candidates.length === 0) return [];

  // ── 3. 점수 계산
  const scored = scorePlaces({ places: candidates, preferences, history, favorites });
  scored.sort((a, b) => b.breakdown.total - a.breakdown.total);

  // ── 4. 카테고리 다양성 보장
  //       같은 카테고리가 이미 선택됐으면 1개당 12점 패널티 적용 후 재정렬
  const categoryCount: Record<string, number> = {};
  const reranked = scored.map((item) => {
    const cat = item.place.category;
    const seen = categoryCount[cat] ?? 0;
    categoryCount[cat] = seen + 1;
    return {
      ...item,
      breakdown: {
        ...item.breakdown,
        total: item.breakdown.total - seen * 12,
      },
    };
  });
  reranked.sort((a, b) => b.breakdown.total - a.breakdown.total);

  // ── 5. 상위 count개 반환
  return reranked.slice(0, count).map((s) => s.place);
}
