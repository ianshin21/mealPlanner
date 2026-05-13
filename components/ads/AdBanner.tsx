"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({ format = "auto", className = "" }: AdBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!clientId || !slotId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle 스크립트 미로드 시 무시
    }
  }, [clientId, slotId]);

  if (!clientId || !slotId) {
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
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
