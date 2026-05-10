import type { Place, PlaceType } from "@/lib/types/place";

// 나중에 이 함수만 실제 API 호출로 교체하면 됩니다.
// TODO: replace mock with GET /api/places/recommend?lat=&lng=&type=
export async function getRecommendations(
  _lat: number | undefined,
  _lng: number | undefined,
  type: PlaceType,
  seed: number = 0
): Promise<Place[]> {
  const pool = type === "lunch" ? MOCK_LUNCH_PLACES : MOCK_PARTY_PLACES;
  const shuffled = seededShuffle(pool, seed + new Date().toDateString().length);
  return shuffled.slice(0, 5);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * 네이버지도 이름 검색 URL.
 * 실제 place ID가 없으므로 이름 검색으로 이동.
 * 모바일에서 네이버지도 앱이 설치되어 있으면 universal link로 앱 오픈.
 */
export function buildNaverMapUrl(name: string): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
}

const MOCK_LUNCH_PLACES: Place[] = [
  {
    id: "l1", name: "한솥도시락", category: "도시락·분식",
    address: "근처 상가 1층", distance: 120,
    kakaoMapUrl: "https://map.kakao.com/link/search/한솥도시락",
    estimatedPricePerPerson: 7000,
  },
  {
    id: "l2", name: "국밥집 원조", category: "한식",
    address: "근처 골목 안", distance: 230,
    kakaoMapUrl: "https://map.kakao.com/link/search/국밥",
    estimatedPricePerPerson: 9000,
  },
  {
    id: "l3", name: "김밥천국", category: "분식",
    address: "사거리 코너", distance: 180,
    kakaoMapUrl: "https://map.kakao.com/link/search/김밥천국",
    estimatedPricePerPerson: 6000,
  },
  {
    id: "l4", name: "순대국 전문점", category: "한식",
    address: "시장 입구", distance: 350,
    kakaoMapUrl: "https://map.kakao.com/link/search/순대국",
    estimatedPricePerPerson: 9000,
  },
  {
    id: "l5", name: "샐러드팩토리", category: "샐러드·건강식",
    address: "오피스 건물 1층", distance: 210,
    kakaoMapUrl: "https://map.kakao.com/link/search/샐러드팩토리",
    estimatedPricePerPerson: 11000,
  },
  {
    id: "l6", name: "칼국수 & 만두", category: "한식",
    address: "이면도로", distance: 400,
    kakaoMapUrl: "https://map.kakao.com/link/search/칼국수만두",
    estimatedPricePerPerson: 10000,
  },
  {
    id: "l7", name: "일본라멘 하카타", category: "일식",
    address: "메인 거리", distance: 480,
    kakaoMapUrl: "https://map.kakao.com/link/search/라멘",
    estimatedPricePerPerson: 12000,
  },
  {
    id: "l8", name: "제육볶음 전문", category: "한식",
    address: "골목 안쪽", distance: 160,
    kakaoMapUrl: "https://map.kakao.com/link/search/제육볶음",
    estimatedPricePerPerson: 9000,
  },
  {
    id: "l9", name: "쌀국수 포쉐프", category: "아시안",
    address: "상가 2층", distance: 290,
    kakaoMapUrl: "https://map.kakao.com/link/search/쌀국수",
    estimatedPricePerPerson: 10000,
  },
  {
    id: "l10", name: "된장찌개 마을", category: "한식",
    address: "주택가 초입", distance: 370,
    kakaoMapUrl: "https://map.kakao.com/link/search/된장찌개",
    estimatedPricePerPerson: 8000,
  },
];

const MOCK_PARTY_PLACES: Place[] = [
  {
    id: "p1", name: "고기리 막창", category: "고기·구이",
    address: "근처 상가 지하", distance: 350,
    kakaoMapUrl: "https://map.kakao.com/link/search/막창",
    estimatedPricePerPerson: 20000,
  },
  {
    id: "p2", name: "삼겹살 마당", category: "고기·구이",
    address: "메인 거리", distance: 420,
    kakaoMapUrl: "https://map.kakao.com/link/search/삼겹살",
    estimatedPricePerPerson: 18000,
  },
  {
    id: "p3", name: "이자카야 도쿄", category: "일식·이자카야",
    address: "골목 안쪽", distance: 500,
    kakaoMapUrl: "https://map.kakao.com/link/search/이자카야",
    estimatedPricePerPerson: 30000,
  },
  {
    id: "p4", name: "치킨 & 호프 OK", category: "치킨·호프",
    address: "사거리 코너", distance: 280,
    kakaoMapUrl: "https://map.kakao.com/link/search/치킨호프",
    estimatedPricePerPerson: 22000,
  },
  {
    id: "p5", name: "해산물 포차", category: "해산물·포차",
    address: "시장 입구", distance: 600,
    kakaoMapUrl: "https://map.kakao.com/link/search/해산물포차",
    estimatedPricePerPerson: 28000,
  },
  {
    id: "p6", name: "닭갈비 명가", category: "한식",
    address: "오피스 건물 인근", distance: 380,
    kakaoMapUrl: "https://map.kakao.com/link/search/닭갈비",
    estimatedPricePerPerson: 16000,
  },
  {
    id: "p7", name: "스시 오마카세 BAR", category: "일식·스시",
    address: "메인 거리 2층", distance: 450,
    kakaoMapUrl: "https://map.kakao.com/link/search/스시바",
    estimatedPricePerPerson: 45000,
  },
  {
    id: "p8", name: "양꼬치 & 칭따오", category: "중식·양꼬치",
    address: "이면도로", distance: 310,
    kakaoMapUrl: "https://map.kakao.com/link/search/양꼬치",
    estimatedPricePerPerson: 20000,
  },
];
