/**
 * Kakao Local API 응답을 앱 내부 Place 타입으로 변환
 *
 * lib/places.ts 에서 목 데이터 대신 실제 API를 사용할 때
 * kakaoResultToPlaces(result) 한 번으로 Place[] 를 얻을 수 있습니다.
 */

import type { KakaoPlace, KakaoSearchResult } from "./local";
import type { Place } from "@/lib/types/place";

/**
 * category_name 기반 예상 1인 비용 (카카오 API는 가격 정보를 제공하지 않음)
 * 키: category_name 에 포함된 부분 문자열
 */
const PRICE_ESTIMATES: Array<{ keyword: string; price: number }> = [
  { keyword: "고기",       price: 18000 },
  { keyword: "육류",       price: 18000 },
  { keyword: "일식",       price: 13000 },
  { keyword: "초밥",       price: 20000 },
  { keyword: "회",         price: 25000 },
  { keyword: "해산물",     price: 22000 },
  { keyword: "이자카야",   price: 28000 },
  { keyword: "양식",       price: 14000 },
  { keyword: "중식",       price: 11000 },
  { keyword: "분식",       price: 7000  },
  { keyword: "패스트푸드", price: 8000  },
  { keyword: "도시락",     price: 7000  },
  { keyword: "샐러드",     price: 11000 },
  { keyword: "한식",       price: 9000  },
];

function estimatePrice(categoryName: string): number | undefined {
  for (const { keyword, price } of PRICE_ESTIMATES) {
    if (categoryName.includes(keyword)) return price;
  }
  return undefined;
}

/**
 * category_name 에서 사람이 읽기 쉬운 카테고리 레이블 추출
 * "음식점 > 한식 > 육류,고기요리" → "한식"
 */
function extractCategory(categoryName: string): string {
  const parts = categoryName.split(" > ");
  // 두 번째 계층(중분류)이 가장 유용한 레이블
  return parts[1] ?? parts[0] ?? categoryName;
}

/** KakaoPlace → Place 변환 */
export function kakaoPlaceToPlace(kp: KakaoPlace): Place {
  return {
    id: kp.id,
    name: kp.place_name,
    category: extractCategory(kp.category_name),
    address: kp.road_address_name || kp.address_name,
    distance: parseInt(kp.distance, 10) || 0,
    phone: kp.phone || undefined,
    kakaoMapUrl: kp.place_url,
    estimatedPricePerPerson: estimatePrice(kp.category_name),
  };
}

/** KakaoSearchResult → Place[] 변환 */
export function kakaoResultToPlaces(result: KakaoSearchResult): Place[] {
  return result.documents.map(kakaoPlaceToPlace);
}
