# 배포 최종 점검 문서

> 대상 환경: GitHub → Cloudflare Pages (`meal-planner` 프로젝트)  
> 도메인: `https://mealplanner-19t.pages.dev` (현재) → 커스텀 도메인 전환 예정  
> 최종 갱신: 2026-05-08

---

## 1. GitHub 브랜치에서 확인할 것

- [ ] 작업 브랜치가 `main`에서 최신 상태로 분기되었는지 확인 (`git log --oneline -5`)
- [ ] 민감 정보(API 키, 시크릿)가 코드에 하드코딩되어 있지 않은지 확인
  - Kakao App Key: `NEXT_PUBLIC_KAKAO_APP_KEY` 환경 변수로만 참조
  - Facebook App ID: `app/layout.tsx` `<head>` JSX에 하드코딩 — 보안 이슈 없음 (공개값)
- [ ] `.env.local`이 `.gitignore`에 포함되어 있는지 확인
- [ ] `package.json` `scripts.build`가 `@cloudflare/next-on-pages` 빌드 명령인지 확인
- [ ] TypeScript 오류 없음: `npx tsc --noEmit`
- [ ] ESLint 오류 없음: `npm run lint`

---

## 2. PR 생성 전 체크 항목

- [ ] 로컬 빌드 성공 확인: `npm run build`
- [ ] 변경된 페이지 로컬에서 직접 눈으로 확인 (텍스트, 레이아웃, 버튼 동작)
- [ ] 새로 추가된 블로그 페이지 URL이 `app/sitemap.ts`에 포함되어 있는지 확인
- [ ] `AdBanner` 컴포넌트가 새 페이지에 정상 배치되어 있는지 확인 (horizontal 상단, rectangle 중간)
- [ ] `metadata` export에 `title`, `description`, `openGraph.title`, `openGraph.description` 모두 작성되었는지 확인
- [ ] PR 제목에 변경 범위 명시 (예: `feat: SEO 블로그 페이지 5개 추가`)

---

## 3. Cloudflare Pages Preview에서 확인할 것

PR 생성 후 Cloudflare Pages가 자동으로 Preview URL을 생성합니다.

- [ ] Preview URL 접속 가능 여부 확인
- [ ] 랜딩 페이지(`/`) 정상 렌더링
- [ ] 식단 생성 플로우 전체 동작 확인: `/generate` → `/generating` → `/result`
- [ ] 결과 페이지 공유 버튼 동작 확인 (링크 복사, 카카오, 이미지 저장, 페이스북)
- [ ] 이전 설정 불러오기 배너 표시 여부 확인 (localStorage 재방문 시)
- [ ] 메뉴 교체 버튼 및 사유 선택 UI 동작 확인
- [ ] 새로 추가된 블로그 페이지 접속 확인
  - `/blog/1in-2week-meal-plan`
  - `/blog/2in-weeknight-dinner`
  - `/blog/beginner-home-cooking`
  - `/blog/diet-meal-variety`
  - `/blog/easy-grocery-meal-plan`
- [ ] 콘솔 에러 없음 (브라우저 DevTools → Console 탭)
- [ ] Cloudflare Pages 빌드 로그에 오류/경고 없음

---

## 4. 운영 배포 후 확인할 것

`main` 브랜치 머지 → Cloudflare Pages 자동 배포 완료 후:

- [ ] 운영 URL(`https://mealplanner-19t.pages.dev`) 접속 정상 여부
- [ ] Cloudflare Pages 대시보드 → Deployments 탭 → 최신 배포 Status가 `Success`인지 확인
- [ ] GA4(`NEXT_PUBLIC_GA_ID`) 실시간 보고서에서 `landing_view` 이벤트 수신 확인
- [ ] 식단 생성 완료 후 `generate_complete` 이벤트 GA4에서 확인
- [ ] `/sitemap.xml` 접속 및 새 블로그 URL 포함 여부 확인
- [ ] `/robots.txt` 접속 정상 여부 확인

---

## 5. OG / 썸네일 수동 확인 항목

배포 후 SNS 공유 미리보기가 정상 표시되는지 각 플랫폼 디버거로 확인합니다.

### 카카오
- URL: https://developers.kakao.com/tool/clear/og
- [ ] 사이트 URL 입력 후 캐시 초기화
- [ ] `og:title`, `og:description`, `og:image` 정상 표시 확인
- [ ] 이미지 크기 1200×630 확인

### 페이스북
- URL: https://developers.facebook.com/tools/debug/
- [ ] `https://mealplanner-19t.pages.dev` 입력 후 "다시 스크랩" 클릭
- [ ] `og:image` 정상 표시 확인
- [ ] `fb:app_id` 필드에 `1475424594316558` 표시 확인
- [ ] 경고 항목 검토 (App ID "없음" 타입 경고는 무시 가능)

### 카카오톡 실제 전송 테스트
- [ ] 결과 페이지에서 카카오 공유 → 나에게 보내기 → 수신한 메시지에서 썸네일 표시 확인
- [ ] 공유 링크 탭 시 `/generate` 페이지로 정상 이동 확인

### 페이스북 실제 공유 테스트
- [ ] 결과 페이지 페이스북 버튼 → 팝업 열림 → 공유 시 썸네일 표시 확인

---

## 6. 카카오 / Meta 캐시 초기화 수동 체크 항목

OG 이미지나 텍스트를 변경한 경우 반드시 캐시를 수동으로 초기화해야 합니다.

### 카카오
- [ ] https://developers.kakao.com/tool/clear/og 에서 URL 입력 후 "캐시 초기화" 실행
- [ ] `og:image` URL에 캐시 버스터 파라미터 버전 업 (예: `?v=2` → `?v=3`)
  - 현재: `app/layout.tsx:34` — `https://mealplanner-19t.pages.dev/og-image.png?v=1`
  - Kakao `sendDefault` imageUrl: `app/result/page.tsx:238` — `?v=3`

### 페이스북 / Meta
- [ ] https://developers.facebook.com/tools/debug/ 에서 URL 입력 후 "다시 스크랩" 클릭
- [ ] OG 이미지 변경 시 URL 내 버전 파라미터도 함께 업 (Facebook은 URL이 바뀌어야 캐시 무효화)
- [ ] CDN 전파 시간: 최대 24~48시간 소요 — 즉시 반영되지 않을 수 있음

---

## 7. 커스텀 도메인 전환 시 수정 포인트

현재 `mealplanner-19t.pages.dev`가 하드코딩된 위치를 모두 교체해야 합니다.

### 소스코드 수정 파일 목록

| 파일 | 위치 | 내용 |
|------|------|------|
| `app/layout.tsx` | 5번째 줄 | `metadataBase: new URL("https://mealplanner-19t.pages.dev")` |
| `app/layout.tsx` | 27번째 줄 | `openGraph.url: "https://mealplanner-19t.pages.dev"` |
| `app/layout.tsx` | 34번째 줄 | `og:image URL: "https://mealplanner-19t.pages.dev/og-image.png?v=1"` |
| `app/layout.tsx` | 58번째 줄 | `alternates.canonical: "https://mealplanner-19t.pages.dev"` |
| `app/sitemap.ts` | 4번째 줄 | `const baseUrl = "https://mealplanner-19t.pages.dev"` |
| `app/result/page.tsx` | 238번째 줄 | `const SITE = "https://mealplanner-19t.pages.dev"` (카카오 공유) |
| `app/result/page.tsx` | 265번째 줄 | `const SITE = "https://mealplanner-19t.pages.dev"` (페이스북 공유) |

### Cloudflare Pages 설정
- [ ] Cloudflare Pages → Custom Domains 탭 → 커스텀 도메인 등록
- [ ] DNS CNAME 레코드 설정 (`mealplanner-19t.pages.dev` 방향)
- [ ] HTTPS 자동 발급 대기 (수 분 이내)

### 환경 변수 (Cloudflare Pages → Settings → Environment Variables)
| 변수명 | 설명 | 현재 값 |
|--------|------|---------|
| `NEXT_PUBLIC_KAKAO_APP_KEY` | 카카오 JavaScript SDK 앱 키 | `3449f8fdebe88594de6bc7a8fe00b169` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 측정 ID | GA4 대시보드에서 확인 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense 게시자 ID | AdSense 계정에서 확인 |
| `NEXT_PUBLIC_ADSENSE_SLOT` | AdSense 광고 슬롯 ID | AdSense 계정에서 확인 |

### SNS 앱 설정 업데이트
- [ ] 카카오 개발자 콘솔 → 앱 → 플랫폼 → 사이트 도메인에 커스텀 도메인 추가
- [ ] 페이스북 앱 설정 → 기본 설정 → 앱 도메인에 커스텀 도메인 추가
- [ ] 카카오/페이스북 캐시 초기화 재실행 (위 6번 항목 참조)

---

## 8. AdSense 운영 시 점검 포인트

- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT` 환경 변수가 Cloudflare Pages에 설정되어 있는지 확인
- [ ] `NEXT_PUBLIC_ADSENSE_SLOT` 환경 변수가 Cloudflare Pages에 설정되어 있는지 확인
- [ ] `AdBanner` 컴포넌트가 각 블로그 페이지에 최소 1개 이상 배치되어 있는지 확인
- [ ] AdSense 관리 화면에서 광고 승인 상태 확인 (신규 도메인의 경우 심사에 수 일 소요)
- [ ] 광고 미표시 시 `ads.txt` 파일이 루트에 있는지 확인 (`public/ads.txt`)
- [ ] 운영 환경에서 AdBanner 렌더링 확인 (로컬 개발 환경에서는 광고 미표시 정상)
- [ ] Core Web Vitals (LCP, CLS, FID) 광고 삽입 후 회귀 여부 확인
  - Google Search Console → Core Web Vitals 보고서
  - PageSpeed Insights: https://pagespeed.web.dev/

---

## 9. 장애 발생 시 우선 확인 목록

### 사이트 접속 불가
- [ ] Cloudflare Pages 대시보드 → Deployments → 최신 배포 상태 확인
- [ ] Cloudflare Status 페이지 확인: https://www.cloudflarestatus.com/
- [ ] 빌드 로그에서 오류 메시지 확인

### 식단 생성 실패 (`/generating` 에서 무한 로딩)
- [ ] 브라우저 콘솔 오류 메시지 확인
- [ ] AI API 키 환경 변수 설정 여부 확인 (Cloudflare Pages → Environment Variables)
- [ ] 로컬에서 `npm run build && npm run start`로 재현 여부 확인

### 카카오 공유 실패
- [ ] `NEXT_PUBLIC_KAKAO_APP_KEY` 환경 변수 설정 여부 확인
- [ ] 카카오 개발자 콘솔에서 사이트 도메인 등록 여부 확인
- [ ] 브라우저 콘솔에서 Kakao SDK 초기화 오류 메시지 확인

### OG 이미지 미표시
- [ ] `public/og-image.png` 파일 존재 여부 확인
- [ ] `app/layout.tsx` og:image URL이 절대 경로인지 확인
- [ ] 해당 SNS 디버거에서 캐시 초기화 후 재확인 (6번 항목 참조)

### 광고 미표시
- [ ] AdSense 계정 승인 상태 확인
- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT` 환경 변수 확인
- [ ] 광고 차단 확장 프로그램 비활성화 후 재확인

### Analytics 이벤트 미수집
- [ ] `NEXT_PUBLIC_GA_ID` 환경 변수 설정 여부 확인
- [ ] GA4 실시간 보고서에서 이벤트 수신 대기 (최대 수 분 지연)
- [ ] 브라우저 콘솔에서 `[analytics]` 로그 확인 (개발 환경에서만 출력)
