import type { Place } from "@/lib/types/place";
import { formatDistance } from "@/lib/places";

interface PlaceRecommendCardProps {
  place: Place;
  variant: "hero" | "list";
  onSelect?: (place: Place) => void;
}

export default function PlaceRecommendCard({ place, variant, onSelect }: PlaceRecommendCardProps) {
  if (variant === "hero") {
    return (
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-5 border border-sky-100 mb-3">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-medium text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
            {place.category}
          </span>
          <span className="text-xs text-gray-400">{formatDistance(place.distance)}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{place.name}</h2>
        <p className="text-sm text-gray-500 mb-1">{place.address}</p>
        {place.estimatedPricePerPerson && (
          <p className="text-sm text-gray-500 mb-4">
            예상 1인 비용{" "}
            <span className="font-semibold text-gray-900">
              {place.estimatedPricePerPerson.toLocaleString()}원
            </span>
          </p>
        )}
        <a
          href={place.kakaoMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onSelect?.(place)}
          className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 font-semibold text-sm px-4 py-2 rounded-xl active:bg-yellow-500 transition-colors"
        >
          카카오맵에서 보기 →
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 truncate">{place.name}</div>
        <div className="text-xs text-gray-400 mt-0.5">
          {place.category} · {formatDistance(place.distance)}
          {place.estimatedPricePerPerson && (
            <> · 약 {place.estimatedPricePerPerson.toLocaleString()}원</>
          )}
        </div>
      </div>
      <a
        href={place.kakaoMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onSelect?.(place)}
        className="flex-shrink-0 text-xs text-sky-600 font-medium"
      >
        지도 →
      </a>
    </div>
  );
}
