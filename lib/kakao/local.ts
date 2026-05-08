/**
 * Kakao Local API 서버 유틸리티 (서버 전용 — 클라이언트에서 import 금지)
 *
 * 필요 환경 변수:
 *   KAKAO_REST_API_KEY=<카카오 REST API 키>
 *
 * 발급 경로:
 *   https://developers.kakao.com → 내 애플리케이션 → 앱 키 → REST API 키
 *   ※ JavaScript SDK 키(NEXT_PUBLIC_KAKAO_APP_KEY)와 다른 별개의 키입니다.
 *
 * Cloudflare Pages 설정:
 *   대시보드 → meal-planner 프로젝트 → Settings → Environment variables
 *   → KAKAO_REST_API_KEY 추가 (Production + Preview 모두)
 *
 * 로컬 개발:
 *   .env.local 에 KAKAO_REST_API_KEY=<키> 추가 (.gitignore 에 포함되어 있음)
 */

const KAKAO_API_BASE = "https://dapi.kakao.com/v2/local/search";

// ────────────────────────────────────────────
// 카테고리 코드
// ────────────────────────────────────────────

/** 카카오 로컬 API 카테고리 코드 */
export const KAKAO_CATEGORY = {
  RESTAURANT: "FD6", // 음식점
  CAFE:       "CE7", // 카페
  SUBWAY:     "SW8", // 지하철역
  MART:       "MT1", // 대형마트
  CONV:       "CS2", // 편의점
} as const;

export type KakaoCategoryCode = (typeof KAKAO_CATEGORY)[keyof typeof KAKAO_CATEGORY];

// ────────────────────────────────────────────
// 파라미터 타입
// ────────────────────────────────────────────

/** 키워드 검색 파라미터 */
export interface KeywordSearchOptions {
  query: string;
  x?: string;                          // 경도 (longitude) — 기준 좌표
  y?: string;                          // 위도 (latitude)  — 기준 좌표
  radius?: number;                     // 반경 미터 (1~20000), x·y 없으면 무시됨
  page?: number;                       // 페이지 번호 (1~45, 기본 1)
  size?: number;                       // 페이지당 결과 수 (1~45, 기본 15)
  sort?: "distance" | "accuracy";      // 정렬 기준 (기본 "accuracy")
  category_group_code?: KakaoCategoryCode; // 카테고리 필터
}

/** 카테고리 검색 파라미터 */
export interface CategorySearchOptions {
  category_group_code: KakaoCategoryCode;
  x: string;                           // 경도 (필수)
  y: string;                           // 위도 (필수)
  radius?: number;                     // 반경 미터 (기본 1000, 최대 20000)
  page?: number;
  size?: number;
  sort?: "distance" | "accuracy";
}

/** 주변 음식점 검색 편의 파라미터 */
export interface NearbyRestaurantOptions {
  radius?: number;  // 기본 800m
  size?: number;    // 기본 15
  page?: number;    // 기본 1
}

// ────────────────────────────────────────────
// 응답 타입
// ────────────────────────────────────────────

/** 카카오 로컬 API 단일 장소 */
export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;        // "음식점 > 한식 > 육류,고기요리" 형태의 전체 계층
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;         // 지번 주소
  road_address_name: string;    // 도로명 주소 (없으면 빈 문자열)
  x: string;                   // 경도 (longitude)
  y: string;                   // 위도 (latitude)
  place_url: string;            // https://place.map.kakao.com/{id}
  distance: string;             // 기준 좌표로부터 거리 (미터, 문자열)
}

/** 카카오 로컬 API 검색 결과 */
export interface KakaoSearchResult {
  meta: {
    total_count: number;       // 전체 결과 수
    pageable_count: number;    // 조회 가능한 최대 수 (최대 45)
    is_end: boolean;           // 마지막 페이지 여부
  };
  documents: KakaoPlace[];
}

// ────────────────────────────────────────────
// 내부 유틸
// ────────────────────────────────────────────

function getRestApiKey(): string {
  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) {
    throw new Error(
      "[kakao/local] KAKAO_REST_API_KEY 환경 변수가 설정되지 않았습니다. " +
      ".env.local 또는 Cloudflare Pages 환경 변수를 확인하세요."
    );
  }
  return key;
}

async function kakaoFetch(
  endpoint: "keyword" | "category",
  params: Record<string, string>
): Promise<KakaoSearchResult> {
  const url = new URL(`${KAKAO_API_BASE}/${endpoint}.json`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${getRestApiKey()}` },
    // Route Handler 내에서 60초 캐시 (Next.js fetch 확장)
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `[kakao/local] API 오류 ${res.status}: ${res.statusText} (endpoint: ${endpoint})`
    );
  }

  return res.json() as Promise<KakaoSearchResult>;
}

// ────────────────────────────────────────────
// 공개 함수
// ────────────────────────────────────────────

/**
 * 키워드로 장소 검색
 *
 * @example
 * // 강남역 근처 삼겹살 검색
 * const result = await searchByKeyword({
 *   query: "삼겹살",
 *   x: "127.0276",
 *   y: "37.4979",
 *   radius: 500,
 *   sort: "distance",
 *   category_group_code: KAKAO_CATEGORY.RESTAURANT,
 * });
 */
export async function searchByKeyword(
  options: KeywordSearchOptions
): Promise<KakaoSearchResult> {
  const params: Record<string, string> = { query: options.query };
  if (options.x)                    params.x = options.x;
  if (options.y)                    params.y = options.y;
  if (options.radius != null)       params.radius = String(options.radius);
  if (options.page != null)         params.page = String(options.page);
  if (options.size != null)         params.size = String(options.size);
  if (options.sort)                 params.sort = options.sort;
  if (options.category_group_code)  params.category_group_code = options.category_group_code;
  return kakaoFetch("keyword", params);
}

/**
 * 카테고리로 장소 검색
 *
 * @example
 * // 현재 위치 800m 내 음식점 검색
 * const result = await searchByCategory({
 *   category_group_code: KAKAO_CATEGORY.RESTAURANT,
 *   x: "127.0276",
 *   y: "37.4979",
 *   radius: 800,
 *   sort: "distance",
 * });
 */
export async function searchByCategory(
  options: CategorySearchOptions
): Promise<KakaoSearchResult> {
  const params: Record<string, string> = {
    category_group_code: options.category_group_code,
    x: options.x,
    y: options.y,
    radius: String(options.radius ?? 1000),
    sort: options.sort ?? "distance",
  };
  if (options.page != null) params.page = String(options.page);
  if (options.size != null) params.size = String(options.size);
  return kakaoFetch("category", params);
}

/**
 * 좌표 기반 주변 음식점 검색 (FD6 고정)
 *
 * lib/places.ts 의 getRecommendations() 연동 시 이 함수로 교체합니다.
 *
 * @example
 * const result = await searchNearbyRestaurants(37.4979, 127.0276, { radius: 500 });
 * const places = result.documents.map(kakaoPlaceToPlace); // lib/kakao/convert.ts 참조
 */
export async function searchNearbyRestaurants(
  lat: number,
  lng: number,
  options: NearbyRestaurantOptions = {}
): Promise<KakaoSearchResult> {
  return searchByCategory({
    category_group_code: KAKAO_CATEGORY.RESTAURANT,
    x: String(lng),
    y: String(lat),
    radius: options.radius ?? 800,
    size: options.size ?? 15,
    page: options.page ?? 1,
    sort: "distance",
  });
}
