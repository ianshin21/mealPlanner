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
type Headcount = "2-3" | "4-6" | "7-10" | "10+";
type Budget = "10000" | "20000" | "30000" | "any";
type MenuStyle = "meat" | "korean" | "seafood" | "izakaya" | "other";
type Atmosphere = "lively" | "normal" | "quiet";
type DedupPeriod = "none" | "7d" | "14d";
type LocationState = "idle" | "requesting" | "granted" | "denied" | "unavailable";

interface PartyForm {
  headcount: Headcount;
  budget: Budget;
  includeAlcohol: boolean;
  menuStyles: MenuStyle[];
  atmosphere: Atmosphere;
  dedupPeriod: DedupPeriod;
}

// ────────────────────────────────────────────
// 레이블 맵
// ────────────────────────────────────────────
const HEADCOUNT_LABELS: Record<Headcount, string> = {
  "2-3": "2~3명",
  "4-6": "4~6명",
  "7-10": "7~10명",
  "10+": "10명+",
};
const BUDGET_LABELS: Record<Budget, string> = {
  "10000": "1만원대",
  "20000": "2만원대",
  "30000": "3만원대",
  "any": "상관없음",
};
const MENU_STYLE_LABELS: Record<MenuStyle, string> = {
  meat: "🥩 고기",
  korean: "🍲 한식",
  seafood: "🦐 해산물",
  izakaya: "🍺 이자카야",
  other: "🍽️ 기타",
};
const ATMOSPHERE_LABELS: Record<Atmosphere, string> = {
  lively: "🎉 시끌벅적",
  normal: "😊 무난",
  quiet: "🤫 조용함",
};
const DEDUP_LABELS: Record<DedupPeriod, string> = {
  none: "제한 없음",
  "7d": "최근 1주",
  "14d": "최근 2주",
};

const DEFAULT_FORM: PartyForm = {
  headcount: "4-6",
  budget: "20000",
  includeAlcohol: true,
  menuStyles: [],
  atmosphere: "normal",
  dedupPeriod: "7d",
};

// ────────────────────────────────────────────
// 공통 버튼 스타일 헬퍼
// ────────────────────────────────────────────
function chip(active: boolean) {
  return active
    ? "px-3 py-1.5 rounded-xl text-sm font-medium bg-orange-500 text-white"
    : "px-3 py-1.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 active:bg-gray-50";
}

// ────────────────────────────────────────────
// 컴포넌트
// ────────────────────────────────────────────
export default function PartyClient() {
  const [form, setForm] = useState<PartyForm>(DEFAULT_FORM);
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

  // ── 메뉴 스타일 토글 (다중 선택)
  const toggleMenuStyle = (style: MenuStyle) => {
    setForm((prev) => ({
      ...prev,
      menuStyles: prev.menuStyles.includes(style)
        ? prev.menuStyles.filter((s) => s !== style)
        : [...prev.menuStyles, style],
    }));
  };

  // ── 추천 실행
  const fetchPlaces = useCallback(
    async (currentSeed: number) => {
      setLoading(true);
      // TODO: 실제 API 연동 시 form + coords 파라미터를 전달
      // TODO: dedupPeriod 기반으로 localStorage 히스토리에서 excludeIds 추출 후 전달
      const results = await getRecommendations(coords?.lat, coords?.lng, "party", currentSeed);
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

    // 조건 요약 칩
    const summary = [
      HEADCOUNT_LABELS[form.headcount],
      BUDGET_LABELS[form.budget],
      form.includeAlcohol ? "술 포함" : "술 제외",
      form.menuStyles.length > 0
        ? form.menuStyles.map((s) => MENU_STYLE_LABELS[s].split(" ")[1]).join("·")
        : "메뉴 무관",
      ATMOSPHERE_LABELS[form.atmosphere].split(" ")[1],
    ];

    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="mb-4">
            <Link href="/" className="text-xs text-orange-500">홈</Link>
            <span className="text-xs text-gray-300 mx-1">›</span>
            <Link href="/party" className="text-xs text-orange-500" onClick={() => setView("form")}>
              회식 추천
            </Link>
            <span className="text-xs text-gray-300 mx-1">›</span>
            <span className="text-xs text-gray-400">결과</span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-3">오늘 회식 어디서 하지?</h1>

          {/* 조건 요약 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {summary.map((s) => (
              <span key={s} className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded-full">
                {s}
              </span>
            ))}
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
              className="flex-1 py-2 rounded-xl border-2 border-amber-300 text-sm text-amber-700 font-semibold active:bg-amber-50 disabled:opacity-40"
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
              {/* 회식 카드는 amber 계열 배경으로 override */}
              <div className="[&>div]:from-amber-50 [&>div]:to-orange-50 [&>div]:border-amber-100 [&_span]:bg-amber-100 [&_span]:text-amber-700">
                <PlaceRecommendCard place={hero} variant="hero" />
              </div>

              {rest.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-400 mb-2 mt-5 tracking-wide uppercase">
                    다른 후보지
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
              <div className="text-4xl mb-3">🍻</div>
              <p className="text-sm">추천 결과를 가져오지 못했어요.</p>
              <button onClick={handleRetry} className="mt-4 text-sm text-amber-600 font-medium underline">
                다시 시도하기
              </button>
            </div>
          )}

          {/* 유틸 크로스링크 */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link
              href="/ladder"
              className="block p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center"
            >
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs font-semibold text-gray-700">사다리타기</div>
              <div className="text-xs text-gray-400 mt-0.5">누가 낼지 결정</div>
            </Link>
            <Link
              href="/dutch"
              className="block p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center"
            >
              <div className="text-2xl mb-1">🧮</div>
              <div className="text-xs font-semibold text-gray-700">더치페이 계산</div>
              <div className="text-xs text-gray-400 mt-0.5">1/N 빠른 계산</div>
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
          <span className="text-xs text-gray-400">오늘 회식 어디서 하지?</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">오늘 회식 어디서 하지?</h1>
        <p className="text-sm text-gray-500 mb-6">조건을 선택하면 딱 맞는 장소를 추천해 드려요.</p>

        <div className="space-y-6">

          {/* ── 위치 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">어디서 찾을까요?</h2>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setLocationMode("gps")}
                className={chip(locationMode === "gps")}
              >
                📍 현재 위치
              </button>
              <button
                onClick={() => setLocationMode("manual")}
                className={chip(locationMode === "manual")}
              >
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
                placeholder="회사 주소나 동네 이름 입력 (예: 강남역, 역삼동)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-400"
              />
            )}
          </section>

          {/* ── 인원 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">몇 명이 함께하나요?</h2>
            <div className="flex flex-wrap gap-2">
              {(["2-3", "4-6", "7-10", "10+"] as Headcount[]).map((h) => (
                <button key={h} onClick={() => setForm((f) => ({ ...f, headcount: h }))} className={chip(form.headcount === h)}>
                  {HEADCOUNT_LABELS[h]}
                </button>
              ))}
            </div>
          </section>

          {/* ── 예산 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">1인 예산은?</h2>
            <div className="flex flex-wrap gap-2">
              {(["10000", "20000", "30000", "any"] as Budget[]).map((b) => (
                <button key={b} onClick={() => setForm((f) => ({ ...f, budget: b }))} className={chip(form.budget === b)}>
                  {BUDGET_LABELS[b]}
                </button>
              ))}
            </div>
          </section>

          {/* ── 술 포함 여부 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">술 포함 여부</h2>
            <div className="flex gap-2">
              <button onClick={() => setForm((f) => ({ ...f, includeAlcohol: true }))} className={chip(form.includeAlcohol)}>
                🍺 포함
              </button>
              <button onClick={() => setForm((f) => ({ ...f, includeAlcohol: false }))} className={chip(!form.includeAlcohol)}>
                🥤 제외
              </button>
            </div>
          </section>

          {/* ── 메뉴 스타일 (다중 선택) */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-1">어떤 메뉴가 좋을까요?</h2>
            <p className="text-xs text-gray-400 mb-2">여러 개 선택 가능 · 비워두면 모두 포함</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(MENU_STYLE_LABELS) as MenuStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => toggleMenuStyle(style)}
                  className={chip(form.menuStyles.includes(style))}
                >
                  {MENU_STYLE_LABELS[style]}
                </button>
              ))}
            </div>
          </section>

          {/* ── 분위기 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">분위기는?</h2>
            <div className="flex flex-wrap gap-2">
              {(["lively", "normal", "quiet"] as Atmosphere[]).map((a) => (
                <button key={a} onClick={() => setForm((f) => ({ ...f, atmosphere: a }))} className={chip(form.atmosphere === a)}>
                  {ATMOSPHERE_LABELS[a]}
                </button>
              ))}
            </div>
          </section>

          {/* ── 중복 제외 기간 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-1">최근 갔던 곳 제외</h2>
            <p className="text-xs text-gray-400 mb-2">이전에 추천받은 곳을 얼마나 제외할까요?</p>
            <div className="flex flex-wrap gap-2">
              {(["none", "7d", "14d"] as DedupPeriod[]).map((d) => (
                <button key={d} onClick={() => setForm((f) => ({ ...f, dedupPeriod: d }))} className={chip(form.dedupPeriod === d)}>
                  {DEDUP_LABELS[d]}
                </button>
              ))}
            </div>
          </section>

          {/* ── 제출 */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-orange-500 text-white font-bold text-base rounded-2xl shadow active:bg-orange-600 transition-colors"
          >
            회식 장소 추천받기 →
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
