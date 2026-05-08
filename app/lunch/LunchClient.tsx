"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LocationPermissionBanner from "@/components/lunch-party/LocationPermissionBanner";
import PlaceRecommendCard from "@/components/lunch-party/PlaceRecommendCard";
import { getRecommendations } from "@/lib/places";
import type { Place } from "@/lib/types/place";

// ────────────────────────────────────────────
// 타입
// ────────────────────────────────────────────
type FoodCategory = "korean" | "chinese" | "japanese" | "western" | "snack" | "salad" | "any";
type Budget = "5000" | "8000" | "10000" | "15000" | "any";
type WalkDistance = "300" | "500" | "1000" | "any";
type DedupPeriod = "none" | "7d" | "14d";
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
  "300": "도보 3분 (300m)",
  "500": "도보 5분 (500m)",
  "1000": "도보 10분 (1km)",
  "any": "거리 무관",
};
const DEDUP_LABELS: Record<DedupPeriod, string> = {
  none: "제한 없음",
  "7d": "최근 1주",
  "14d": "최근 2주",
};

const DEFAULT_FORM: LunchForm = {
  categories: [],
  budget: "10000",
  walkDistance: "500",
  dedupPeriod: "7d",
};

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
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState(0);

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

  // ── 추천 실행
  const fetchPlaces = useCallback(
    async (currentSeed: number) => {
      setLoading(true);
      // TODO: 실제 API 연동 시 form + coords 파라미터를 전달
      // TODO: dedupPeriod 기반으로 localStorage 히스토리에서 excludeIds 추출 후 전달
      const results = await getRecommendations(coords?.lat, coords?.lng, "lunch", currentSeed);
      setPlaces(results);
      setLoading(false);
    },
    [coords]
  );

  const handleSubmit = async () => {
    setView("result");
    await fetchPlaces(seed);
  };

  const handleRetry = async () => {
    const next = seed + 1;
    setSeed(next);
    await fetchPlaces(next);
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
              <div className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* 추천 결과 */}
          {!loading && hero && (
            <>
              <p className="text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase">
                오늘의 추천
              </p>
              <PlaceRecommendCard place={hero} variant="hero" />

              {rest.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-400 mb-2 mt-5 tracking-wide uppercase">
                    이런 곳은 어때요?
                  </p>
                  <div className="space-y-2">
                    {rest.map((place) => (
                      <PlaceRecommendCard key={place.id} place={place} variant="list" />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {!loading && places.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🍽️</div>
              <p className="text-sm">추천 결과를 가져오지 못했어요.</p>
              <button onClick={handleRetry} className="mt-4 text-sm text-sky-600 font-medium underline">
                다시 시도하기
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
            className="w-full py-4 bg-sky-500 text-white font-bold text-base rounded-2xl shadow active:bg-sky-600 transition-colors"
          >
            점심 메뉴 추천받기 →
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
