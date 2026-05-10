import type { Place } from "@/lib/types/place";
import { formatDistance, buildNaverMapUrl } from "@/lib/places";
import FavoriteButton from "@/components/lunch-party/FavoriteButton";

type ColorScheme = "sky" | "amber";

interface PlaceRecommendCardProps {
  place: Place;
  variant: "hero" | "list";
  colorScheme?: ColorScheme;
  isFavorited?: boolean;
  onSelect?: (place: Place) => void;
  onFavoriteToggle?: (place: Place) => void;
}

// "서울 강남구 역삼1동 123-4" → "강남구 역삼1동"
// "서울특별시 강남구 테헤란로 123" → "강남구 테헤란로"
function shortAddress(address: string): string {
  const parts = address.split(" ");
  const guIdx = parts.findIndex((p) => p.endsWith("구") || p.endsWith("군"));
  if (guIdx !== -1 && guIdx + 1 < parts.length) {
    return parts.slice(guIdx, guIdx + 2).join(" ");
  }
  return parts.length > 1 ? parts.slice(1, 3).join(" ") : address;
}

const SCHEME = {
  sky: {
    heroBg:      "from-sky-50 to-blue-50",
    heroBorder:  "border-sky-100",
    badgeBg:     "bg-sky-100",
    badgeText:   "text-sky-700",
    distBg:      "bg-white/70",
    distText:    "text-sky-600",
    listMapBtn:  "text-sky-600 border-sky-200 bg-sky-50 active:bg-sky-100",
  },
  amber: {
    heroBg:      "from-amber-50 to-orange-50",
    heroBorder:  "border-amber-100",
    badgeBg:     "bg-amber-100",
    badgeText:   "text-amber-700",
    distBg:      "bg-white/70",
    distText:    "text-amber-600",
    listMapBtn:  "text-amber-600 border-amber-200 bg-amber-50 active:bg-amber-100",
  },
} satisfies Record<ColorScheme, object>;

// ── 아이콘 (SVG inline — 이모지 없음)
function IconArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
    </svg>
  );
}

function IconLocation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
  );
}

function IconWon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10.75 10.818v2.614A8.265 8.265 0 0112.5 13H14v-2h-1.5a6.284 6.284 0 01-1.75-.182zM9.25 10.636A6.284 6.284 0 017.5 11H6v2h1.5c.585 0 1.15.06 1.695.172l.055.01v-2.546zM14 9V7h-1.5a8.265 8.265 0 00-1.75.182V9.818A6.284 6.284 0 0012.5 10H14V9zm-4.75-.818V7h-1.5a6.284 6.284 0 00-1.695.172L6 7.228V9h1.5c.585 0 1.15-.06 1.695-.172l.055-.01v-1.636zM5 6.5V6a1 1 0 011-1h8a1 1 0 011 1v.5h.75a.75.75 0 010 1.5H15v2h.75a.75.75 0 010 1.5H15V12a1 1 0 01-1 1H6a1 1 0 01-1-1v-.5h-.75a.75.75 0 010-1.5H5V8h-.75a.75.75 0 010-1.5H5z" />
    </svg>
  );
}

export default function PlaceRecommendCard({
  place,
  variant,
  colorScheme = "sky",
  isFavorited = false,
  onSelect,
  onFavoriteToggle,
}: PlaceRecommendCardProps) {
  const s = SCHEME[colorScheme];

  // ────────────────────────────────────────────
  // Hero 카드 — 첫 번째 추천 (대형)
  // ────────────────────────────────────────────
  if (variant === "hero") {
    return (
      <div className={`bg-gradient-to-br ${s.heroBg} rounded-2xl p-5 border ${s.heroBorder} mb-3`}>

        {/* 상단: 카테고리 뱃지 + 거리 + 하트 */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-semibold ${s.badgeText} ${s.badgeBg} px-2.5 py-1 rounded-full`}>
            {place.category}
          </span>
          <div className="flex items-center gap-1">
            <span className={`text-xs font-medium ${s.distText} ${s.distBg} px-2 py-0.5 rounded-full border border-white/50`}>
              {formatDistance(place.distance)}
            </span>
            {onFavoriteToggle && (
              <FavoriteButton
                isFavorited={isFavorited}
                onToggle={() => onFavoriteToggle(place)}
                colorScheme={colorScheme}
              />
            )}
          </div>
        </div>

        {/* 식당명 */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
          {place.name}
        </h2>

        {/* 정보 행 */}
        <div className="space-y-2 mb-5">
          <div className="flex items-start gap-2">
            <IconLocation className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-600 line-clamp-1">{place.address}</span>
          </div>

          {place.phone && (
            <div className="flex items-center gap-2">
              <IconPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <a
                href={`tel:${place.phone}`}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {place.phone}
              </a>
            </div>
          )}

          {place.estimatedPricePerPerson && (
            <div className="flex items-center gap-2">
              <IconWon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                1인 약{" "}
                <strong className="font-semibold text-gray-900">
                  {place.estimatedPricePerPerson.toLocaleString()}원
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* 지도 버튼 — 네이버 / 카카오 (다시추천 외곽선 버튼과 시각 차별화) */}
        <div className="flex gap-2">
          <a
            href={buildNaverMapUrl(place.name)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSelect?.(place)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#03C75A] active:opacity-80 text-white font-semibold text-sm py-3 rounded-xl"
          >
            네이버지도
            <IconArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href={place.kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSelect?.(place)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-400 active:bg-yellow-500 text-gray-900 font-semibold text-sm py-3 rounded-xl"
          >
            카카오맵
            <IconArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────
  // List 카드 — 2~5번째 추천 (소형)
  // ────────────────────────────────────────────
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-100">

      {/* 왼쪽: 텍스트 정보 */}
      <div className="flex-1 min-w-0">

        {/* 이름 + 카테고리 뱃지 */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-semibold text-sm text-gray-900 truncate">{place.name}</span>
          <span className={`text-xs font-medium ${s.badgeText} ${s.badgeBg} px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap`}>
            {place.category}
          </span>
        </div>

        {/* 거리 · 주소 축약 · 가격 */}
        <div className="text-xs text-gray-400 truncate">
          {formatDistance(place.distance)}
          <span className="mx-1 text-gray-200">·</span>
          {shortAddress(place.address)}
          {place.estimatedPricePerPerson && (
            <>
              <span className="mx-1 text-gray-200">·</span>
              약 {place.estimatedPricePerPerson.toLocaleString()}원
            </>
          )}
        </div>

        {/* 전화번호 (있으면) */}
        {place.phone && (
          <a
            href={`tel:${place.phone}`}
            className="flex items-center gap-1 mt-1 text-xs text-gray-400 hover:text-gray-600 w-fit"
          >
            <IconPhone className="w-3 h-3 flex-shrink-0" />
            {place.phone}
          </a>
        )}
      </div>

      {/* 오른쪽: 지도 버튼 2개 + 하트 */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0 pt-0.5">
        <div className="flex gap-1">
          <a
            href={buildNaverMapUrl(place.name)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSelect?.(place)}
            className="flex items-center gap-0.5 text-xs font-semibold bg-[#03C75A] active:opacity-80 text-white px-2 py-1.5 rounded-lg"
          >
            네이버
            <IconArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href={place.kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSelect?.(place)}
            className="flex items-center gap-0.5 text-xs font-semibold bg-yellow-400 active:bg-yellow-500 text-gray-900 px-2 py-1.5 rounded-lg"
          >
            카카오
            <IconArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        {onFavoriteToggle && (
          <FavoriteButton
            isFavorited={isFavorited}
            onToggle={() => onFavoriteToggle(place)}
            colorScheme={colorScheme}
          />
        )}
      </div>
    </div>
  );
}
