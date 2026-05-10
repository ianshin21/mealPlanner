"use client";

import Script from "next/script";
import { initKakaoSDK } from "@/lib/share/kakao";

/**
 * Kakao JS SDK를 비동기로 로드하고 초기화하는 클라이언트 컴포넌트.
 * app/layout.tsx <body> 안에 한 번만 렌더링한다.
 */
export default function KakaoSDKScript() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={initKakaoSDK}
    />
  );
}
