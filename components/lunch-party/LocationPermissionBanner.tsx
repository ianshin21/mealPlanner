"use client";

interface LocationPermissionBannerProps {
  status: "denied" | "unavailable";
  onRetry?: () => void;
}

export default function LocationPermissionBanner({ status, onRetry }: LocationPermissionBannerProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3 mb-4">
      <span className="text-xl flex-shrink-0">📍</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800">
          {status === "denied" ? "위치 권한이 거부되었어요" : "위치를 사용할 수 없어요"}
        </p>
        <p className="text-xs text-amber-600 mt-0.5">
          {status === "denied"
            ? "브라우저 설정에서 위치를 허용하면 더 정확한 추천을 드릴 수 있어요. 지금은 일반 추천을 보여드립니다."
            : "현재 환경에서는 위치를 가져올 수 없어요. 일반 추천을 보여드립니다."}
        </p>
        {status === "denied" && onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-amber-700 font-medium underline underline-offset-2"
          >
            다시 시도하기
          </button>
        )}
      </div>
    </div>
  );
}
