"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LocationPermissionBanner from "@/components/lunch-party/LocationPermissionBanner";
import PlaceRecommendCard from "@/components/lunch-party/PlaceRecommendCard";
import {
  recommendLunch,
  type FoodCategory,
  type LunchBudget,
  type WalkDistance,
  type DedupPeriod,
  type LunchPreferences,
  type PlaceHistoryItem,
} from "@/lib/recommend/lunch";
import {
  getPlaceFavorites,
  togglePlaceFavorite,
} from "@/lib/storage/favorites";
import { sharePlace, isKakaoShareAvailable } from "@/lib/share/kakao";
import { trackEvent } from "@/lib/analytics";
import type { Place } from "@/lib/types/place";

// ────────────────────────────────────────────
// 타입
// ────────────────────────────────────────────
type Budget = LunchBudget;
type LocationState = "idle" | "requesting" | "granted" | "denied" | "unavailable";

interface LunchForm {
  categories: FoodCategory[];
  budget: Budget;
  walkDistance: WalkDistance;
  dedupPeriod: DedupPeriod;
}

// ────────────────────────────────────────────
// 레이블 맵
// ────────────────────────────────────────────
const CATEGORY_LABELS: Record<FoodCategory, string> = {
  korean:   "🍲 한식",
  chinese:  "🥢 중식",
  japanese: "🍱 일식",
  western:  "🍝 양식",
  snack:    "🍜 분식",
  salad:    "🥗 샐러드",
  any:      "상관없음",
};
const BUDGET_LABELS: Record<Budget, string> = {
  "5000":  "5천원 이하",
  "8000":  "8천원대",
  "10000": "1만원대",
  "15000": "1.5만원 이상",
  "any":   "상관없음",
};
const WALK_LABELS: Record<WalkDistance, string> = {
  "300":  "도보 3분 (300m)",
  "500":  "도보 5분 (500m)",
  "1000": "도보 10분 (1km)",
  "any":  "거리 무관",
};
const DEDUP_LABELS: Record<DedupPeriod, string> = {
  none:  "제한 없음",
  "7d":  "최근 1주",
  "14d": "최근 2주",
};

const DEFAULT_FORM: LunchForm = {
  categories: [],
  budget: "10000",
  walkDistance: "500",
  dedupPeriod: "7d",
};

// ────────────────────────────────────────────
// localStorage 헬퍼
// ────────────────────────────────────────────
const HISTORY_KEY = "meal_place_history";

function loadHistory(): PlaceHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as PlaceHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function addToHistory(place: Place): void {
  if (typeof window === "undefined") return;
  try {
    const history = loadHistory();
    const item: PlaceHistoryItem = {
      placeId: place.id,
      placeName: place.name,
      type: "lunch",
      selectedAt: Date.now(),
    };
    const updated = [item, ...history.filter((h) => h.placeId !== place.id)].slice(0, 100);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

// ────────────────────────────────────────────
// API 헬퍼 (서버 프록시 경유)
// ────────────────────────────────────────────
async function apiFetchByCoords(lat: number, lng: number): Promise<Place[]> {
  const params = new URLSearchParams({
    x: String(lng),
    y: String(lat),
    radius: "2000",
    category: "restaurant",
    sort: "distance",
    size: "45",
  });
  const res = await fetch(`/api/places/search?${params}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error ?? "검색 중 오류가 발생했어요.");
  return data.places as Place[];
}

async function apiFetchByKeyword(query: string): Promise<Place[]> {
  const params = new URLSearchParams({
    query: `${query} 맛집`,
    category: "restaurant",
    sort: "accuracy",
    size: "30",
  });
  const res = await fetch(`/api/places/search?${params}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error ?? "검색 중 오류가 발생했어요.");
  return data.places as Place[];
}

// ────────────────────────────────────────────
// 아이콘
// ────────────────────────────────────────────
function IconKakao({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.68 1.76 5.03 4.42 6.38l-.88 3.28 3.82-2.52A10.9 10.9 0 0 0 12 18c4.97 0 9-3.36 9-7.5S16.97 3 12 3z" />
    </svg>
  );
}

// ────────────────────────────────────────────
// 공통 버튼 스타일 헬퍼
// ────────────────────────────────────────────
function chip(active: boolean) {
  return active
    ? "px-3 py-1.5 rounded-xl text-sm font-medium bg-sky-500 text-white"
    : "px-3 py-1.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 active:bg-gray-50";
}

// ────────────────────────────────────────────
// 컴포넌트
// ────────────────────────────────────────────
export default function LunchClient() {
  const [form, setForm] = useState<LunchForm>(DEFAULT_FORM);
  const [view, setView] = useState<"form" | "result">("form");

  // 위치
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [locationMode, setLocationMode] = useState<"gps" | "manual">("gps");
  const [manualAddress, setManualAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // 결과
  const [places, setPlaces] = useState<Place[]>([]);
  const [allCandidates, setAllCandidates] = useState<Place[]>([]);
  const [shownPlaceIds, setShownPlaceIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 즐겨찾기
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    setFavoritedIds(new Set(getPlaceFavorites("lunch").map((f) => f.placeId)));
  }, []);

  // ── 위치 요청
  const requestGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState("unavailable");
      return;
    }
    setLocationState("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationState("granted");
      },
      () => setLocationState("denied"),
      { timeout: 8000 }
    );
  }, []);

  // ── 카테고리 다중 선택 토글
  const toggleCategory = (cat: FoodCategory) => {
    if (cat === "any") {
      setForm((f) => ({ ...f, categories: [] }));
      return;
    }
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories.filter((c) => c !== "any"), cat],
    }));
  };

  // ── 카카오맵 링크 클릭 시 이력 저장
  const handleSelectPlace = (place: Place) => {
    addToHistory(place);
  };

  // ── 카카오 공유 (SDK 미준비 시 Web Share API 폴백)
  const handleShare = (place: Place) => {
    trackEvent("kakao_share_click", { page: "lunch" });
    if (isKakaoShareAvailable()) {
      sharePlace({
        type: "lunch",
        placeName: place.name,
        category: place.category,
        address: place.address,
        distance: place.distance,
        estimatedPricePerPerson: place.estimatedPricePerPerson,
        kakaoMapUrl: place.kakaoMapUrl,
      });
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: `오늘 점심 후보 찾았어 — ${place.name}`,
        text: [place.category, place.address].filter(Boolean).join(" · "),
        url: place.kakaoMapUrl,
      }).catch(() => {});
    }
  };

  // ── 즐겨찾기 토글
  const handleFavoriteToggle = (place: Place) => {
    const added = togglePlaceFavorite({
      placeId: place.id,
      placeName: place.name,
      category: place.category,
      address: place.address,
      kakaoMapUrl: place.kakaoMapUrl,
      estimatedPricePerPerson: place.estimatedPricePerPerson,
      type: "lunch",
    });
    trackEvent("lunch_favorite", { action: added ? "add" : "remove" });
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (added) next.add(place.id);
      else next.delete(place.id);
      return next;
    });
  };

  // ── 공통 추천 실행 (candidates 풀을 받아 처리)
  const runRecommend = async (candidates: Place[], dedupPeriod: DedupPeriod) => {
    const prefs: LunchPreferences = {
      categories: form.categories,
      budget: form.budget,
      walkDistance: locationMode === "manual" ? "any" : form.walkDistance,
      dedupPeriod,
    };
    const history   = dedupPeriod === "none" ? [] : loadHistory();
    const favorites = getPlaceFavorites("lunch");
    const results   = recommendLunch({ places: candidates, preferences: prefs, history, favorites, count: 5 });

    setShownPlaceIds((prev) => {
      const next = new Set(prev);
      results.forEach((p) => next.add(p.id));
      return next;
    });
    setPlaces(results);
    return results;
  };

  // ── 첫 추천 실행 (폼 제출)
  const handleSubmit = async () => {
    // GPS 모드인데 좌표가 없으면 먼저 위치 요청
    if (locationMode === "gps" && !coords) {
      requestGPS();
      return;
    }

    trackEvent("lunch_recommend_start", { locationMode });
    setView("result");
    setLoading(true);
    setError(null);
    setPlaces([]);
    setAllCandidates([]);
    setShownPlaceIds(new Set());

    try {
      let candidates: Place[];
      if (locationMode === "gps" && coords) {
        candidates = await apiFetchByCoords(coords.lat, coords.lng);
      } else {
        const query = manualAddress.trim() || "맛집";
        candidates = await apiFetchByKeyword(query);
      }

      setAllCandidates(candidates);
      const results = await runRecommend(candidates, form.dedupPeriod);
      trackEvent("lunch_recommend_complete", { count: results.length });
    } catch (e) {
      setError(e instanceof Error ? e.message : "추천을 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  // ── 다시 추천받기 (pool 기반, API 재호출 없음)
  const handleRetry = async () => {
    trackEvent("lunch_retry");
    // API 호출 자체가 실패했으면 처음부터 재시도
    if (allCandidates.length === 0) {
      await handleSubmit();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let pool = allCandidates.filter((p) => !shownPlaceIds.has(p.id));
      if (pool.length < 3) {
        // 미노출 후보가 너무 적으면 전체 풀에서 재시작
        pool = allCandidates;
        setShownPlaceIds(new Set());
      }

      const prefs: LunchPreferences = {
        categories: form.categories,
        budget: form.budget,
        walkDistance: locationMode === "manual" ? "any" : form.walkDistance,
        dedupPeriod: "none", // 재추천 시 이력 필터 없음 (shownPlaceIds로 이미 다양성 확보)
      };

      const results = recommendLunch({ places: pool, preferences: prefs, count: 5 });

      setShownPlaceIds((prev) => {
        const next = new Set(prev);
        results.forEach((p) => next.add(p.id));
        return next;
      });
      setPlaces(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "다시 추천받기에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────
  // 결과 화면
  // ────────────────────────────────────────────
  if (view === "result") {
    const hero = places[0];
    const rest = places.slice(1);

    const summary = [
      form.categories.length > 0
        ? form.categories.map((c) => CATEGORY_LABELS[c].split(" ")[1]).join("·")
        : "카테고리 무관",
      BUDGET_LABELS[form.budget],
      WALK_LABELS[form.walkDistance].split(" ")[0] + " " + WALK_LABELS[form.walkDistance].split(" ")[1],
    ];

    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="mb-4">
            <Link href="/" className="text-xs text-orange-500">홈</Link>
            <span className="text-xs text-gray-300 mx-1">›</span>
            <button onClick={() => setView("form")} className="text-xs text-orange-500">
              점심 추천
            </button>
            <span className="text-xs text-gray-300 mx-1">›</span>
            <span className="text-xs text-gray-400">결과</span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-3">오늘 점심 뭐 먹지?</h1>

          {/* 조건 요약 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {summary.map((s) => (
              <span key={s} className="text-xs bg-sky-50 border border-sky-200 text-sky-700 px-2.5 py-0.5 rounded-full">
                {s}
              </span>
            ))}
            {locationState === "granted" && (
              <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-2.5 py-0.5 rounded-full">
                📍 현재 위치
              </span>
            )}
          </div>

          {/* 조건 수정 / 다시 추천 */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setView("form")}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium active:bg-gray-50"
            >
              ← 조건 수정
            </button>
            <button
              onClick={handleRetry}
              disabled={loading}
              className="flex-1 py-2 rounded-xl border-2 border-sky-200 text-sm text-sky-600 font-semibold active:bg-sky-50 disabled:opacity-40"
            >
              🔄 다시 추천
            </button>
          </div>

          {/* 로딩 스켈레톤 */}
          {loading && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 text-center animate-pulse">
                {allCandidates.length > 0 ? "새로운 추천을 계산하는 중..." : "주변 식당을 검색하는 중..."}
              </p>
              <div className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* 오류 */}
          {!loading && error && (
            <div className="text-center py-12">
              <div className="text-3xl mb-3">😔</div>
              <p className="text-sm text-gray-600 mb-1">추천을 불러오지 못했어요</p>
              <p className="text-xs text-gray-400 mb-4">{error}</p>
              <button onClick={handleRetry} className="text-sm text-sky-600 font-medium underline">
                다시 시도하기
              </button>
            </div>
          )}

          {/* 추천 결과 */}
          {!loading && !error && hero && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
                  오늘의 추천
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShare(hero)}
                    className="flex items-center gap-1 text-xs font-semibold bg-[#FEE500] text-gray-900 px-2.5 py-1 rounded-lg active:opacity-70"
                  >
                    <IconKakao className="w-3.5 h-3.5" />
                    공유
                  </button>
                  <Link href="/lunch/favorites" className="text-xs text-sky-600 font-medium">
                    ♥ 즐겨찾기
                  </Link>
                </div>
              </div>
              <PlaceRecommendCard
                place={hero}
                variant="hero"
                colorScheme="sky"
                isFavorited={favoritedIds.has(hero.id)}
                onSelect={handleSelectPlace}
                onFavoriteToggle={handleFavoriteToggle}
              />

              {rest.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-400 mb-2 mt-5 tracking-wide uppercase">
                    이런 곳은 어때요?
                  </p>
                  <div className="space-y-2">
                    {rest.map((place) => (
                      <PlaceRecommendCard
                        key={place.id}
                        place={place}
                        variant="list"
                        colorScheme="sky"
                        isFavorited={favoritedIds.has(place.id)}
                        onSelect={handleSelectPlace}
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {!loading && !error && places.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🍽️</div>
              <p className="text-sm">조건에 맞는 식당을 찾지 못했어요.</p>
              <p className="text-xs mt-1 mb-4">거리나 예산 조건을 완화해 보세요.</p>
              <button onClick={() => setView("form")} className="text-sm text-sky-600 font-medium underline">
                조건 다시 설정하기
              </button>
            </div>
          )}

          {/* 회식 크로스링크 */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-gray-900">오늘 회식 장소도 고민 중이에요</p>
              <p className="text-xs text-gray-500 mt-0.5">인원과 예산에 맞는 곳을 추천해 드려요</p>
            </div>
            <Link
              href="/party"
              className="flex-shrink-0 ml-4 text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1.5 rounded-xl"
            >
              회식 추천 →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ────────────────────────────────────────────
  // 폼 화면
  // ────────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">오늘 점심 뭐 먹지?</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">오늘 점심 뭐 먹지?</h1>
        <p className="text-sm text-gray-500 mb-6">조건을 고르면 지금 바로 갈 수 있는 곳을 추천해 드려요.</p>

        <div className="space-y-6">

          {/* ── 위치 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">어디서 찾을까요?</h2>
            <div className="flex gap-2 mb-3">
              <button onClick={() => setLocationMode("gps")} className={chip(locationMode === "gps")}>
                📍 현재 위치
              </button>
              <button onClick={() => setLocationMode("manual")} className={chip(locationMode === "manual")}>
                ✏️ 직접 입력
              </button>
            </div>

            {locationMode === "gps" && (
              <>
                {locationState === "idle" && (
                  <button
                    onClick={requestGPS}
                    className="w-full py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 active:bg-gray-50"
                  >
                    위치 권한 허용하기
                  </button>
                )}
                {locationState === "requesting" && (
                  <p className="text-xs text-gray-400 text-center py-2">위치를 가져오는 중...</p>
                )}
                {locationState === "granted" && (
                  <p className="text-xs text-green-600 font-medium py-1">✓ 현재 위치를 사용합니다</p>
                )}
                {(locationState === "denied" || locationState === "unavailable") && (
                  <LocationPermissionBanner status={locationState} onRetry={requestGPS} />
                )}
              </>
            )}

            {locationMode === "manual" && (
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="동네 이름이나 주소 입력 (예: 강남역, 역삼동)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-sky-400"
              />
            )}
          </section>

          {/* ── 음식 카테고리 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-1">어떤 음식이 먹고 싶어요?</h2>
            <p className="text-xs text-gray-400 mb-2">여러 개 선택 가능 · 비워두면 모두 포함</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_LABELS) as FoodCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={chip(
                    cat === "any"
                      ? form.categories.length === 0
                      : form.categories.includes(cat)
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </section>

          {/* ── 예산 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">점심 예산은?</h2>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(BUDGET_LABELS) as Budget[]).map((b) => (
                <button key={b} onClick={() => setForm((f) => ({ ...f, budget: b }))} className={chip(form.budget === b)}>
                  {BUDGET_LABELS[b]}
                </button>
              ))}
            </div>
          </section>

          {/* ── 도보 거리 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">얼마나 걸어갈 수 있어요?</h2>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(WALK_LABELS) as WalkDistance[]).map((d) => (
                <button key={d} onClick={() => setForm((f) => ({ ...f, walkDistance: d }))} className={chip(form.walkDistance === d)}>
                  {WALK_LABELS[d]}
                </button>
              ))}
            </div>
          </section>

          {/* ── 중복 제외 기간 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-1">최근 갔던 곳 제외</h2>
            <p className="text-xs text-gray-400 mb-2">이전에 추천받은 곳을 얼마나 제외할까요?</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DEDUP_LABELS) as DedupPeriod[]).map((d) => (
                <button key={d} onClick={() => setForm((f) => ({ ...f, dedupPeriod: d }))} className={chip(form.dedupPeriod === d)}>
                  {DEDUP_LABELS[d]}
                </button>
              ))}
            </div>
          </section>

          {/* ── 제출 */}
          <button
            onClick={handleSubmit}
            disabled={locationMode === "gps" && locationState === "requesting"}
            className="w-full py-4 bg-sky-500 text-white font-bold text-base rounded-2xl shadow active:bg-sky-600 transition-colors disabled:opacity-60"
          >
            {locationMode === "gps" && locationState === "requesting"
              ? "위치 가져오는 중..."
              : "점심 메뉴 추천받기 →"}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
