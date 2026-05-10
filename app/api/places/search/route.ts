/**
 * GET /api/places/search
 *
 * Kakao Local API 프록시 — REST API 키를 서버에서만 사용하고
 * 클라이언트에는 정제된 Place[] 만 반환합니다.
 *
 * 쿼리 파라미터:
 *   query     string   키워드 (선택, category 검색 시 생략 가능)
 *   x         string   경도 longitude (선택, query 없을 때 필수)
 *   y         string   위도 latitude  (선택, query 없을 때 필수)
 *   radius    number   반경 미터 1~20000 (기본 800)
 *   category  string   "restaurant"(기본) | "cafe"
 *   sort      string   "distance"(기본) | "accuracy"
 *   page      number   1~45 (기본 1)
 *   size      number   1~45 (기본 15)
 *
 * 성공 응답:
 *   { ok: true, places: Place[], meta: { totalCount, isEnd, page } }
 *
 * 실패 응답:
 *   { ok: false, error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import {
  searchByKeyword,
  searchByCategory,
  KAKAO_CATEGORY,
  type KakaoCategoryCode,
} from "@/lib/kakao/local";
import { kakaoResultToPlaces } from "@/lib/kakao/convert";
import type { Place } from "@/lib/types/place";

// ────────────────────────────────────────────
// 응답 타입
// ────────────────────────────────────────────
interface SearchSuccess {
  ok: true;
  places: Place[];
  meta: { totalCount: number; isEnd: boolean; page: number };
}
interface SearchError {
  ok: false;
  error: string;
}

function err(message: string, status: number) {
  return NextResponse.json<SearchError>({ ok: false, error: message }, { status });
}

// ────────────────────────────────────────────
// 카테고리 코드 매핑
// ────────────────────────────────────────────
const CATEGORY_MAP: Record<string, KakaoCategoryCode> = {
  restaurant: KAKAO_CATEGORY.RESTAURANT, // FD6
  cafe:       KAKAO_CATEGORY.CAFE,       // CE7
};

// ────────────────────────────────────────────
// 파라미터 파싱 유틸
// ────────────────────────────────────────────
function parseIntParam(
  value: string | null,
  defaultValue: number,
  min: number,
  max: number,
  name: string
): { value: number } | { error: string } {
  if (value === null) return { value: defaultValue };
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < min || parsed > max) {
    return { error: `${name}는 ${min}~${max} 사이의 정수여야 합니다.` };
  }
  return { value: parsed };
}

function parseFloatParam(
  value: string | null,
  min: number,
  max: number,
  name: string
): { value: number | null } | { error: string } {
  if (value === null) return { value: null };
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < min || parsed > max) {
    return { error: `${name}는 ${min}~${max} 사이의 숫자여야 합니다.` };
  }
  return { value: parsed };
}

// ────────────────────────────────────────────
// Route Handler
// ────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;

  const query    = sp.get("query")?.trim() || undefined;
  const xRaw     = sp.get("x");
  const yRaw     = sp.get("y");
  const category = sp.get("category") ?? "restaurant";
  const sortRaw  = sp.get("sort");

  // ── 1. query / 좌표 중 하나는 반드시 필요
  const hasCoords = xRaw !== null && yRaw !== null;
  if (!query && !hasCoords) {
    return err("query 또는 x·y 좌표 중 하나는 필수입니다.", 400);
  }

  // ── 2. sort 검증
  const sort = sortRaw ?? (hasCoords ? "distance" : "accuracy");
  if (sort !== "distance" && sort !== "accuracy") {
    return err("sort는 'distance' 또는 'accuracy'여야 합니다.", 400);
  }

  // ── 3. 숫자 파라미터 검증
  const radiusResult = parseIntParam(sp.get("radius"), 800,  1,     20000, "radius");
  const pageResult   = parseIntParam(sp.get("page"),   1,    1,     45,    "page");
  const sizeResult   = parseIntParam(sp.get("size"),   15,   1,     45,    "size");

  if ("error" in radiusResult) return err(radiusResult.error, 400);
  if ("error" in pageResult)   return err(pageResult.error,   400);
  if ("error" in sizeResult)   return err(sizeResult.error,   400);

  const { value: radius } = radiusResult;
  const { value: page }   = pageResult;
  const { value: size }   = sizeResult;

  // ── 4. 좌표 범위 검증
  const xResult = parseFloatParam(xRaw, -180, 180, "x(경도)");
  const yResult = parseFloatParam(yRaw, -90,  90,  "y(위도)");

  if ("error" in xResult) return err(xResult.error, 400);
  if ("error" in yResult) return err(yResult.error, 400);

  // ── 5. 카테고리 코드 매핑 (알 수 없는 값은 FD6 으로 fallback)
  const categoryGroupCode = CATEGORY_MAP[category] ?? KAKAO_CATEGORY.RESTAURANT;

  // ── 6. Kakao API 호출
  try {
    const kakaoResult = query
      ? await searchByKeyword({
          query,
          ...(hasCoords && { x: xRaw!, y: yRaw!, radius }),
          sort: sort as "distance" | "accuracy",
          page,
          size,
          category_group_code: categoryGroupCode,
        })
      : await searchByCategory({
          category_group_code: categoryGroupCode,
          x: xRaw!,
          y: yRaw!,
          radius,
          sort: sort as "distance" | "accuracy",
          page,
          size: Math.min(size, 15), // Kakao category 검색 size 최대 15
        });

    const places = kakaoResultToPlaces(kakaoResult);

    return NextResponse.json<SearchSuccess>({
      ok: true,
      places,
      meta: {
        totalCount: kakaoResult.meta.total_count,
        isEnd:      kakaoResult.meta.is_end,
        page,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "알 수 없는 오류";

    // 환경 변수 누락은 서버 설정 오류 (500)
    if (message.includes("KAKAO_REST_API_KEY")) {
      return err("서버 설정 오류: API 키가 구성되지 않았습니다.", 500);
    }

    // Kakao API 자체 오류는 외부 의존성 오류 (502)
    return err(`외부 API 오류: ${message}`, 502);
  }
}
