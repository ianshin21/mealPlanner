import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "자동 식단 생성기 서비스 소개 이미지";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG 이미지에 실제로 쓰이는 한글 문자만 서브셋으로 요청해 폰트 파일 크기 최소화
const CHARS =
  "자동식단생성기인가정용일이맞춤회원가입없이분만에무료설정만들기월화수닭가슴살샐러드현미밥두부덮밥된장국연어구이채소볶음균형빠른조리·";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(CHARS)}&display=block`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    ).then((r) => r.text());
    const url = css.match(/url\(([^)]+)\)/)?.[1];
    if (!url) return null;
    return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const fontData = await loadFont();
  const fonts = fontData
    ? [{ name: "NotoSansKR", data: fontData, style: "normal" as const, weight: 700 as const }]
    : [];
  const ff = fontData ? "NotoSansKR, sans-serif" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#FFF9F4",
          fontFamily: ff,
        }}
      >
        {/* ── 왼쪽: 텍스트 */}
        <div
          style={{
            width: "58%",
            padding: "64px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* 서비스 라벨 칩 */}
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 20px",
              borderRadius: "999px",
              background: "#FFF1E6",
              color: "#EA580C",
              fontSize: "22px",
              fontWeight: 700,
              marginBottom: "28px",
            }}
          >
            자동 식단 생성기
          </div>

          {/* 메인 타이틀 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "62px",
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "24px",
            }}
          >
            <span>1인·2인 맞춤 식단</span>
            <span>14·28일 자동 생성</span>
          </div>

          {/* 서브 문구 */}
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              color: "#6B7280",
              marginBottom: "32px",
            }}
          >
            회원가입 없이 1분 만에
          </div>

          {/* 메타 배지 */}
          <div style={{ display: "flex", gap: "10px" }}>
            {["무료", "1인/2인", "14/28일"].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  background: "#F3F4F6",
                  color: "#374151",
                  fontSize: "22px",
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* ── 오른쪽: 서비스 UI 목업 카드 */}
        <div
          style={{
            width: "42%",
            padding: "48px 48px 48px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "472px",
              borderRadius: "28px",
              background: "#FFFFFF",
              border: "1.5px solid #F3F4F6",
              boxShadow: "0 16px 40px rgba(17, 24, 39, 0.07)",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* 상단: 설정 영역 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                식단 설정
              </div>

              {/* 조건 칩들 */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["1인", "28일", "균형 식사", "빠른 조리"].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      padding: "7px 14px",
                      borderRadius: "999px",
                      background: "#FFF7ED",
                      color: "#C2410C",
                      fontSize: "18px",
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* 식단 목록 카드 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "월: 닭가슴살 샐러드 + 현미밥",
                  "화: 두부덮밥 + 된장국",
                  "수: 연어구이 + 채소볶음",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "18px",
                      color: "#374151",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* 하단: CTA 버튼 */}
            <div
              style={{
                display: "flex",
                width: "100%",
                borderRadius: "14px",
                background: "#F97316",
                color: "#FFFFFF",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              식단 만들기 →
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
