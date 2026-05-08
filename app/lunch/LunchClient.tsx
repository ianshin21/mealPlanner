"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LocationPermissionBanner from "@/components/lunch-party/LocationPermissionBanner";
import PlaceRecommendCard from "@/components/lunch-party/PlaceRecommendCard";
import { getRecommendations } from "@/lib/places";
import type { Place } from "@/lib/types/place";

type LocationState = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export default function LunchClient() {
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [seed, setSeed] = useState(0);

  const loadPlaces = useCallback(
    async (lat?: number, lng?: number, currentSeed = 0) => {
      setLoading(true);
      const results = await getRecommendations(lat, lng, "lunch", currentSeed);
      setPlaces(results);
      setLoading(false);
    },
    []
  );

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState("unavailable");
      loadPlaces(undefined, undefined, 0);
      return;
    }
    setLocationState("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocationState("granted");
        loadPlaces(latitude, longitude, 0);
      },
      () => {
        setLocationState("denied");
        loadPlaces(undefined, undefined, 0);
      },
      { timeout: 8000 }
    );
  }, [loadPlaces]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handleRetry = () => {
    const next = seed + 1;
    setSeed(next);
    loadPlaces(coords?.lat, coords?.lng, next);
  };

  const hero = places[0];
  const rest = places.slice(1);

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 브레드크럼 */}
        <div className="mb-4">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">오늘 점심 뭐 먹지?</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">오늘 점심 뭐 먹지?</h1>
        <p className="text-sm text-gray-500 mb-5">
          {locationState === "granted"
            ? "📍 현재 위치 기반 추천"
            : "주변 식당을 추천해 드립니다"}
        </p>

        {/* 위치 권한 배너 */}
        {(locationState === "denied" || locationState === "unavailable") && (
          <LocationPermissionBanner
            status={locationState}
            onRetry={locationState === "denied" ? requestLocation : undefined}
          />
        )}

        {/* 로딩 */}
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

            {/* 다시 추천 */}
            <button
              onClick={handleRetry}
              className="w-full mt-6 py-3 rounded-2xl border-2 border-sky-200 text-sky-600 font-semibold text-sm active:bg-sky-50 transition-colors"
            >
              🔄 다시 추천받기
            </button>
          </>
        )}

        {/* 결과 없음 (예외 처리) */}
        {!loading && places.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-sm">추천 결과를 가져오지 못했어요.</p>
            <button onClick={handleRetry} className="mt-4 text-sm text-sky-600 font-medium underline">
              다시 시도하기
            </button>
          </div>
        )}

        {/* 회식 추천 크로스링크 */}
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
