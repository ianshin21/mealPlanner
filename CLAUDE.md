# CLAUDE.md — 자동 식단 생성기 프로젝트

## 프로젝트 개요

- **서비스명:** 자동 식단 생성기
- **URL:** https://mealplanner-19t.pages.dev
- **목적:** 1인·2인 가정을 위한 14일/28일 맞춤 식단 자동 생성 (회원가입 없이 무료 사용)
- **수익화:** Google AdSense (ca-pub-5247269257735944) — 현재 승인 대기 중

---

## 기술 스택

- **호스팅:** Cloudflare Pages (`@opennextjs/cloudflare` v1.19.8)
- **백엔드:** Cloudflare Pages Functions
- **프레임워크:** Next.js 14 App Router
- **AI:** Anthropic Claude API (점심 추천, 회식 장소 추천 기능에서 장소 검색 보조)
- **식단 생성:** AI 없음 → 자체 rule-based 알고리즘 (중요: 사용자에게 "AI가 아닌 검증된 알고리즘"으로 명시)
- **버전 관리:** GitHub (ianshin21)
- **개발 환경:** VS Code + Claude Code

> ⚠️ **Firebase 사용 금지** — 이전에 시도했다가 포기. Firebase 관련 코드 절대 제안하지 말 것.

> ⚠️ **`runtime = "edge"` 사용 금지** — `@opennextjs/cloudflare` v1.19.8이 edge runtime 분리 번들링을 지원하지 않아 빌드 실패. `app/opengraph-image.tsx` 이 이유로 삭제된 전례 있음.

---

## 페이지 구조

| 경로 | 기능 |
|---|---|
| `/` | 메인 랜딩 페이지 |
| `/generate` | 식단 생성 (핵심 기능) |
| `/generating` | 식단 생성 중 로딩 |
| `/result` | 생성된 식단 결과 |
| `/lunch` | 점심 맛집 추천 (위치 기반 카카오 API) |
| `/party` | 회식 장소 찾기 (인원·예산 기반) |
| `/lunch/favorites` | 즐겨찾기 (점심/회식 공용) |
| `/tools/split` | 1/N 더치페이 계산기 |
| `/games/ladder` | 사다리타기 |
| `/blog/*` | SEO 블로그 포스트 11개 |
| `/about`, `/contact` | 서비스 소개·문의 |
| `/privacy`, `/terms`, `/disclaimer` | 법적 문서 |

---

## 식단 생성 옵션 구조

사용자가 `/generate`에서 선택하는 조건:

- **기간:** 14일 / 28일
- **인원:** 1인 / 2인
- **건강 목표:** 가볍게 감량 / 균형 건강관리 / 단백질 채우기
- **식사 스타일:** 한식 위주 / 한식+간편식 / 이가든 위주
- **요리 수준:** 완전 이보 / 이보 가능
- **조리 시간:** 10분 / 20분 / 30분
- **알레르기:** 고등어, 갑각류, 밀, 대두, 콩, 생선류, 조개류, 돼지고기, 닭고기, 아몬드
- **싫어하는 재료:** 두부, 고수, 내장, 해산물, 버섯, 고등어, 오징어, 마늘, 파, 된장

---

## 위치(GPS) 처리 패턴

`/lunch`, `/party` 공통. `requestGPS`가 `Promise<{lat,lng}|null>` 반환.  
`handleSubmit`에서 `await requestGPS()` — 첫 클릭에서 GPS 대기 후 자동으로 결과 진행.  
GPS 거부 시 수동 입력 모드로 자동 전환 후 `return`. 카카오/페이스북 인앱브라우저 호환.

---

## 법적·윤리적 포지셔닝 원칙

- 식단 정보는 **"일반 건강 참고용"** 으로만 제공 → 의료·영양 조언이 아님을 항상 명시
- `/lunch`, `/party` 등 AI 기반 추천 기능도 "AI"를 전면에 내세우지 않는다
- 면책 고지, 개인정보처리방침, 이용약관 페이지 유지 필수
- 신 기능 추가 시 법적 문구 확인 여부 항상 검토할 것

---

## SEO 원칙

- 모든 페이지 `canonical`, `og:image`, `twitter:card` 메타 태그 필수
- `og:image` 크기: 1200×630 (정적 PNG: `public/og-image.png`)
- `metadataBase`: `NEXT_PUBLIC_SITE_URL` 환경변수 또는 `https://mealplanner-19t.pages.dev`
- 한국어 locale: `ko_KR`
- robots: `index, follow`
- 블로그 포스트는 SEO 트래픽 유입 목적 → 키워드 밀도 유지

---

## 코딩 원칙

- 모든 주석은 **한국어**로 작성
- 모바일 우선(mobile-first) 설계
- 회원가입·로그인 기능 추가 금지 (서비스 핵심 가치: 가입 없이 즉시 사용)
- 신 기능은 기존 페이지 구조(`/기능명`) 패턴 유지
- Cloudflare Pages Functions로 백엔드 처리 → 별도 서버 구축 금지

---

## 광고 관련

- AdSense Publisher ID: `ca-pub-5247269257735944`
- 광고 컴포넌트: `components/ads/AdBanner.tsx`
- 환경변수 미설정 시 "광고 영역" 플레이스홀더 표시
- **승인 후 할 일:** Cloudflare Pages에 `NEXT_PUBLIC_ADSENSE_CLIENT` + `NEXT_PUBLIC_ADSENSE_SLOT` 추가 후 재배포
- 광고 영역은 UX를 해치지 않는 위치에만 배치 / 광고 관련 코드 임의 수정 금지

---

## 기능 문서

신규 기능 설계 시 `docs/` 폴더에 `FEATURE_이름.md` 형식으로 작성.  
예: `docs/FEATURE_LUNCH.md`, `docs/FEATURE_PARTY.md`
