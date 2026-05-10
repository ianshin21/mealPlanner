"use client";

interface LocationPermissionBannerProps {
  status: "denied" | "unavailable";
  onRetry?: () => void;
}

export default function LocationPermissionBanner({ status, onRetry }: LocationPermissionBannerProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3 mb-2">
      <span className="text-xl flex-shrink-0">📍</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800">
          {status === "denied" ? "위치 권한이 거부되었어요" : "위치를 사용할 수 없어요"}
        </p>
        <p className="text-xs text-amber-600 mt-0.5">
          아래에 동네 이름이나 주소를 입력해 주세요.
        </p>
        {status === "denied" && onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-amber-700 font-medium underline underline-offset-2"
          >
            위치 다시 시도하기
          </button>
        )}
      </div>
    </div>
  );
}
