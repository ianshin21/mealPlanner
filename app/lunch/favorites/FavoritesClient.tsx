"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FavoriteButton from "@/components/lunch-party/FavoriteButton";
import {
  getPlaceFavorites,
  removePlaceFavorite,
  type PlaceFavorite,
  type PlaceType,
} from "@/lib/storage/favorites";
import { buildNaverMapUrl } from "@/lib/places";

type Tab = PlaceType;

const TAB_LABELS: Record<Tab, string> = {
  lunch: "점심",
  party: "회식",
};

const SCHEME = {
  lunch: { link: "text-sky-600",  border: "border-sky-500",  text: "text-sky-600" },
  party: { link: "text-amber-600", border: "border-amber-500", text: "text-amber-600" },
};

function FavoriteItem({
  fav,
  onRemove,
}: {
  fav: PlaceFavorite;
  onRemove: () => void;
}) {
  const s = SCHEME[fav.type];
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 truncate">{fav.placeName}</div>
        <div className="text-xs text-gray-400 mt-0.5">
          {fav.category}
          {fav.estimatedPricePerPerson && (
            <> · 약 {fav.estimatedPricePerPerson.toLocaleString()}원</>
          )}
        </div>
        {fav.address && (
          <div className="text-xs text-gray-400 truncate">{fav.address}</div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0 pt-0.5">
        <div className="flex gap-1">
          <a
            href={buildNaverMapUrl(fav.placeName)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold bg-[#03C75A] active:opacity-80 text-white px-2 py-1.5 rounded-lg"
          >
            네이버
          </a>
          <a
            href={fav.kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold bg-yellow-400 active:bg-yellow-500 text-gray-900 px-2 py-1.5 rounded-lg"
          >
            카카오
          </a>
        </div>
        <FavoriteButton
          isFavorited={true}
          onToggle={onRemove}
          colorScheme={fav.type === "lunch" ? "sky" : "amber"}
        />
      </div>
    </div>
  );
}

export default function FavoritesClient() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") === "party" ? "party" : "lunch") as Tab;
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [favorites, setFavorites] = useState<PlaceFavorite[]>([]);

  useEffect(() => {
    setFavorites(getPlaceFavorites());
  }, []);

  const handleRemove = (placeId: string, type: PlaceType) => {
    removePlaceFavorite(placeId, type);
    setFavorites((prev) =>
      prev.filter((f) => !(f.placeId === placeId && f.type === type)),
    );
  };

  const filtered = favorites.filter((f) => f.type === activeTab);

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 브레드크럼 */}
        <div className="mb-4">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <Link
            href={activeTab === "party" ? "/party" : "/lunch"}
            className="text-xs text-orange-500"
          >
            {activeTab === "party" ? "회식 추천" : "점심 추천"}
          </Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">즐겨찾기</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-4">즐겨찾기</h1>

        {/* 탭 */}
        <div className="flex gap-0 mb-5 border-b border-gray-100">
          {(["lunch", "party"] as Tab[]).map((tab) => {
            const s = SCHEME[tab];
            const isActive = activeTab === tab;
            const count = favorites.filter((f) => f.type === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  isActive
                    ? `${s.text} ${s.border}`
                    : "text-gray-400 border-transparent"
                }`}
              >
                {TAB_LABELS[tab]}
                {count > 0 && (
                  <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 목록 */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">♡</div>
            <p className="text-sm">즐겨찾기한 곳이 없어요.</p>
            <p className="text-xs mt-1 mb-5">추천 결과에서 하트를 누르면 저장돼요.</p>
            <Link
              href={activeTab === "lunch" ? "/lunch" : "/party"}
              className={`text-sm font-medium ${SCHEME[activeTab].link}`}
            >
              {activeTab === "lunch" ? "점심 추천받기 →" : "회식 추천받기 →"}
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((fav) => (
              <FavoriteItem
                key={`${fav.type}-${fav.placeId}`}
                fav={fav}
                onRemove={() => handleRemove(fav.placeId, fav.type)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
