"use client";

// AdSense 슬롯 컴포넌트 - publisher ID와 slot ID를 환경변수로 관리
// 실제 배포 시: NEXT_PUBLIC_ADSENSE_CLIENT, NEXT_PUBLIC_ADSENSE_SLOT 설정

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

export default function AdBanner({ format = "auto", className = "" }: AdBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!clientId) {
    // 개발 환경 플레이스홀더
    return (
      <div
        className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs ${
          format === "horizontal" ? "h-16 w-full" : "h-32 w-full"
        } ${className}`}
      >
        광고 영역
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
