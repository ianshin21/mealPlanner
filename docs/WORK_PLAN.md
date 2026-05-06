# 자동 식단 생성기 — 작업 계획서 (WORK_PLAN)

> 본 문서는 "1단계 상태 확인" 및 "프로젝트 구조 진단"의 결과를 바탕으로,
> 이후 기능 개선 작업을 **안전하고 추적 가능한 단위**로 분리해서 진행하기 위한 가이드입니다.
> 모든 작업은 `genspark_ai_developer` 또는 아래에 정의된 **기능별 브랜치**에서 진행하며,
> 각 브랜치는 단일 책임을 갖고 한 개의 PR로 정리됩니다.

- 기준 브랜치(base): `main`
- 통합 작업 브랜치(선택): `genspark_ai_developer`
- 원격: `origin = https://github.com/ianshin21/mealPlanner.git`

---

## 0. 작업 원칙 (Ground Rules)

1. **1 브랜치 = 1 목적 = 1 PR** — 도메인 정합성 작업과 광고 작업을 한 PR에 섞지 않습니다.
2. **base는 항상 최신 main**: 브랜치 시작 전 `git fetch origin && git checkout main && git pull` 후 분기.
3. **순서 의존성 준수**: 아래 "Phase A → B → C → D → E" 순서를 권장합니다. 도메인 정합성(Phase A)을
   먼저 정리하지 않으면 OG/Sitemap 변경 작업이 의미를 잃습니다.
4. **수정 금지 영역**: 메뉴 시드(`data/menus.json`), 알고리즘(`lib/meal-generator.ts`)은
   기능 개선 PR에서 함께 건드리지 않습니다. 별도 PR로 분리합니다.
5. **검증 필수 항목** (모든 PR 공통):
   - `npm run build` 성공
   - `npm run lint` 무경고
   - `npm test` 통과
   - 로컬에서 `/`, `/generate`, `/generating`, `/result` 라우트 200 OK
6. **PR 본문 템플릿**(공통):
   - 변경 요약 / 변경 파일 / 수동 검증 체크리스트 / 스크린샷 / 영향 범위 / 롤백 방법

---

## 1. 기능별 권장 브랜치 이름

| # | 브랜치 이름                                  | 목적                                                     | Phase |
|---|----------------------------------------------|----------------------------------------------------------|-------|
| 1 | `chore/seo-domain-canonical-fix`             | metadataBase / canonical / OG url / robots / sitemap 도메인 통일 | A     |
| 2 | `feat/og-image-replacement`                  | `public/og-image.png`을 실제 1200×630 이미지로 교체 (또는 동적 OG 도입) | A     |
| 3 | `fix/adsense-push-and-script-loader`         | `AdBanner`에 `adsbygoogle.push({})` 추가, `next/script`로 스크립트 이전 | B     |
| 4 | `feat/ga4-analytics-install`                 | GA4(또는 GTM) 설치 — 기존 `gtag()` 호출 활성화           | B     |
| 5 | `feat/result-share-actions`                  | `/result`에 네이티브 공유 / 링크 복사 / 카카오 공유 버튼 추가 | C     |
| 6 | `feat/result-shareable-url`                  | `userInput`을 URL 파라미터로 직렬화하여 결과 재현 가능 URL 제공 | C     |
| 7 | `feat/result-page-metadata`                  | `/result`용 server segment(layout) 분리 + OG/메타 보강     | C     |
| 8 | `feat/generate-page-metadata`                | `/generate` 페이지별 metadata + URL 쿼리 → sessionStorage 이전 | D     |
| 9 | `chore/api-routes-cleanup`                   | 미사용 의심 API 라우트(`/api/generate`, `/api/replace-meal`) 사용 여부 결정/정리 | D     |
| 10| `refactor/shared-ui-components`              | `Button`, `Section`, `OptionButton` 등 공용 UI 분리        | E     |
| 11| `feat/header-nav-and-policy-links`           | Header에 정책/메뉴 동선 추가                              | E     |
| 12| `feat/dynamic-og-image`                      | `app/opengraph-image.tsx`로 페이지별 OG 동적 생성          | E     |

> 규칙: `feat/`(기능 추가), `fix/`(버그 수정), `chore/`(설정/리팩터/정리), `refactor/`(리팩터링).

---

## 2. 작업 순서 (Phase별)

### Phase A — 도메인·OG·SEO 정합성 (출혈 멈추기)

| 순서 | 브랜치 | 핵심 산출물 |
|------|--------|-------------|
| A-1  | `chore/seo-domain-canonical-fix` | 모든 도메인 참조를 단일 도메인으로 통일, 가능하면 `NEXT_PUBLIC_SITE_URL` env로 추출 |
| A-2  | `feat/og-image-replacement`      | 실제 1200×630 PNG 교체 또는 임시 정적 PNG 도입 |

### Phase B — 수익화/측정 라인 복구

| 순서 | 브랜치 | 핵심 산출물 |
|------|--------|-------------|
| B-1  | `fix/adsense-push-and-script-loader` | 광고 슬롯이 실제로 그려지는 상태로 복원 |
| B-2  | `feat/ga4-analytics-install`         | `generate_start` / `view_result` / `replace_meal` 이벤트가 GA4로 송신 |

### Phase C — 결과 공유 가능성 확보 (성장 레버)

| 순서 | 브랜치 | 핵심 산출물 |
|------|--------|-------------|
| C-1  | `feat/result-shareable-url`     | 결과를 URL로 재현 가능하도록 입력 직렬화 |
| C-2  | `feat/result-share-actions`     | 공유 UI 추가 (C-1 위에 의존) |
| C-3  | `feat/result-page-metadata`     | 결과 페이지 OG/메타 (C-1 완료 후 server segment 도입과 함께) |

### Phase D — 메타·UX 보강

| 순서 | 브랜치 | 핵심 산출물 |
|------|--------|-------------|
| D-1  | `feat/generate-page-metadata`   | `/generate` 메타 + URL 쿼리 폐기 → sessionStorage 전환 |
| D-2  | `chore/api-routes-cleanup`      | 데드코드 정리 또는 명시적 사용 전환 |

### Phase E — 정리 & 확장 (후순위)

| 순서 | 브랜치 | 핵심 산출물 |
|------|--------|-------------|
| E-1  | `refactor/shared-ui-components`     | 인라인 UI를 `components/ui/*`로 추출 |
| E-2  | `feat/header-nav-and-policy-links`  | 정책 페이지 진입 동선 |
| E-3  | `feat/dynamic-og-image`             | 동적 OG 카드 |

---

## 3. 각 브랜치에서 수정할 가능성이 큰 파일

> 같은 파일이 여러 브랜치에 등장하면 **머지 충돌 후보**입니다. 머지 순서(아래 5번)에서 이를 반영합니다.

### 1) `chore/seo-domain-canonical-fix`
- `app/layout.tsx` — `metadataBase`, `openGraph.url`, `alternates.canonical`
- `app/sitemap.ts` — `baseUrl`
- `public/robots.txt` — `Sitemap:` URL
- (선택) `.env.local.example` — `NEXT_PUBLIC_SITE_URL` 도입
- (선택) `README.md` — 도메인 표기 업데이트

### 2) `feat/og-image-replacement`
- `public/og-image.png` (바이너리 교체)
- (대안 도입 시) `app/opengraph-image.tsx`, `app/twitter-image.tsx` 신규
- `app/layout.tsx` — 이미지 경로/사이즈 보정

### 3) `fix/adsense-push-and-script-loader`
- `components/ads/AdBanner.tsx` — `useEffect` 내 `adsbygoogle.push({})` 추가, key 처리
- `app/layout.tsx` — `<script>` → `next/script` 마이그레이션, `strategy="afterInteractive"`
- (선택) `.env.local.example` — `NEXT_PUBLIC_ADSENSE_CLIENT/SLOT` 주석 보강

### 4) `feat/ga4-analytics-install`
- `app/layout.tsx` — GA4 스크립트(`next/script`) + dataLayer
- (신규) `components/analytics/GoogleAnalytics.tsx` — 클라이언트 컴포넌트로 분리 권장
- (선택) `lib/analytics.ts` — `track(event, params)` 헬퍼
- `app/generate/page.tsx`, `app/result/page.tsx`, `components/meal/MealCard.tsx` —
  기존 `gtag(...)` 호출을 헬퍼 경유로 정리(선택)
- `.env.local.example` — `NEXT_PUBLIC_GA_ID`

### 5) `feat/result-share-actions`
- `app/result/page.tsx` — 공유 버튼 영역 추가
- (신규) `components/share/ShareActions.tsx` — Web Share / Clipboard / 카카오 분기
- (선택) `components/layout/Footer.tsx` 또는 `Header.tsx` — 보조 진입점

### 6) `feat/result-shareable-url`
- `app/generate/page.tsx` — 입력 직렬화 정책 변경 (sessionStorage + 압축된 토큰)
- `app/generating/page.tsx` — URL 토큰 → input 복원 + 재생성
- `app/result/page.tsx` — URL에서 plan 복원 시도 → 없으면 sessionStorage fallback
- `lib/meal-generator.ts` — (가능하면 변경 없이) seed 결정성 확인만
- (신규) `lib/share-codec.ts` — encode / decode 유틸

### 7) `feat/result-page-metadata`
- (신규) `app/result/layout.tsx` — server component, `generateMetadata`
- `app/result/page.tsx` — client 부분 유지, layout이 메타 담당
- `app/layout.tsx` — 중복 메타 정리

### 8) `feat/generate-page-metadata`
- (신규) `app/generate/layout.tsx` — `metadata` export
- `app/generate/page.tsx` — URL 쿼리 직렬화 제거, sessionStorage 사용
- `app/generating/page.tsx` — sessionStorage에서 input 로드

### 9) `chore/api-routes-cleanup`
- `app/api/generate/route.ts` — 제거 또는 클라이언트 흐름을 API 경유로 전환
- `app/api/replace-meal/route.ts` — 동일
- `wrangler.toml` / `next.config.js` — Edge runtime 영향 점검

### 10) `refactor/shared-ui-components`
- (신규) `components/ui/Button.tsx`, `components/ui/Section.tsx`, `components/ui/OptionButton.tsx`, `components/ui/ToggleChip.tsx`
- `app/page.tsx`, `app/generate/page.tsx`, `app/result/page.tsx`, `components/meal/*` — 사용처 치환

### 11) `feat/header-nav-and-policy-links`
- `components/layout/Header.tsx` — 정책/블로그 진입점 추가
- (선택) `components/layout/MobileNav.tsx` 신규

### 12) `feat/dynamic-og-image`
- `app/opengraph-image.tsx`, `app/twitter-image.tsx` 신규
- `app/result/opengraph-image.tsx` (조건부)
- `app/layout.tsx` — 정적 OG 제거 또는 fallback

---

## 4. PR 제목 예시

> 컨벤션: `type(scope): 한국어 요약` — 본문은 변경 요약/검증/스크린샷 포함.

| # | 브랜치 | PR 제목 예시 |
|---|--------|--------------|
| 1 | `chore/seo-domain-canonical-fix`     | `chore(seo): 도메인 표기 통일 — metadataBase / canonical / sitemap / robots 정합화` |
| 2 | `feat/og-image-replacement`          | `feat(seo): og-image.png 실제 1200×630 이미지로 교체` |
| 3 | `fix/adsense-push-and-script-loader` | `fix(ads): AdBanner에 adsbygoogle.push 추가 및 next/script로 로더 이전` |
| 4 | `feat/ga4-analytics-install`         | `feat(analytics): GA4 설치 및 generate_start / view_result / replace_meal 이벤트 연결` |
| 5 | `feat/result-share-actions`          | `feat(result): 공유 버튼 추가 — Web Share / 링크 복사 / 카카오 공유` |
| 6 | `feat/result-shareable-url`          | `feat(result): 결과 재현 가능한 공유 URL 도입 (입력 직렬화)` |
| 7 | `feat/result-page-metadata`          | `feat(result): /result용 server segment 분리 및 OG 메타 보강` |
| 8 | `feat/generate-page-metadata`        | `feat(generate): 페이지별 metadata 추가 및 URL 쿼리 → sessionStorage 전환` |
| 9 | `chore/api-routes-cleanup`           | `chore(api): 미사용 API 라우트 정리 (/api/generate, /api/replace-meal)` |
|10 | `refactor/shared-ui-components`      | `refactor(ui): 인라인 UI를 components/ui/*로 추출` |
|11 | `feat/header-nav-and-policy-links`   | `feat(layout): Header에 정책 페이지 진입 동선 추가` |
|12 | `feat/dynamic-og-image`              | `feat(seo): app/opengraph-image.tsx로 동적 OG 카드 생성` |

---

## 5. Merge 순서 제안

> 충돌을 최소화하기 위해 **공통 파일을 건드리는 PR은 직렬로**, 그 외는 병렬로 처리합니다.
> 특히 `app/layout.tsx`는 PR #1, #2, #3, #4, #7, #12에서 모두 수정될 수 있어 의도적으로 직렬화합니다.

### 5.1 권장 머지 순서 (Linear)

```
[1] chore/seo-domain-canonical-fix
        │
        ▼
[2] feat/og-image-replacement
        │
        ▼
[3] fix/adsense-push-and-script-loader
        │
        ▼
[4] feat/ga4-analytics-install
        │
        ▼
[6] feat/result-shareable-url           ← 결과 재현이 먼저
        │
        ▼
[5] feat/result-share-actions           ← 그 위에 공유 UI
        │
        ▼
[7] feat/result-page-metadata           ← server segment 도입과 함께 메타 정리
        │
        ▼
[8] feat/generate-page-metadata
        │
        ▼
[9] chore/api-routes-cleanup
        │
        ▼
[10] refactor/shared-ui-components
        │
        ▼
[11] feat/header-nav-and-policy-links
        │
        ▼
[12] feat/dynamic-og-image
```

### 5.2 충돌 위험이 높은 파일 매트릭스

| 파일 | 영향 받는 PR |
|------|--------------|
| `app/layout.tsx`        | #1, #2, #3, #4, #7, #12 |
| `app/sitemap.ts`        | #1 |
| `app/result/page.tsx`   | #5, #6, #7, #10 |
| `app/generate/page.tsx` | #6, #8, #10 |
| `app/generating/page.tsx` | #6, #8 |
| `components/ads/AdBanner.tsx` | #3 |
| `components/layout/Header.tsx` | #10, #11 |

→ 같은 파일을 건드리는 PR은 위 순서대로 직렬 머지. 다른 파일을 건드리는 PR은 병렬 머지 가능.

### 5.3 병렬 머지가 가능한 묶음

- **세트 1 (메타/리소스)**: #1 → #2 직렬, 그러나 #3·#4와는 병렬 가능 (단 layout.tsx 충돌은 rebase로 해결).
- **세트 2 (수익화/측정)**: #3 → #4. 내부 직렬, 외부 병렬 가능.
- **세트 3 (공유)**: #6 → #5 → #7. 반드시 직렬.
- **세트 4 (정리/리팩터)**: #8 → #9 → #10 → #11 → #12. 직렬 권장.

### 5.4 각 PR Merge 전 체크리스트

- [ ] base 최신화: `git fetch origin && git rebase origin/main`
- [ ] 충돌 발생 시 **원격(main) 우선**으로 해결, 핵심 변경만 보존
- [ ] 로컬 빌드/린트/테스트 통과
- [ ] `/`, `/generate`, `/generating`, `/result`, `/blog/*`, `/privacy`, `/terms`, `/disclaimer` 200 OK
- [ ] AdBanner 영역이 placeholder 또는 실제 광고로 정상 표시되는지 확인
- [ ] OG 미리보기 (예: `https://www.opengraph.xyz/`)에서 카드 정상 노출
- [ ] `git log --oneline` 상 PR이 깔끔한 단일 커밋(squashed)로 정리되어 있는지

---

## 6. 일정/완료 정의 (DoD)

### Phase A 완료 정의
- 모든 도메인 참조가 단일 값으로 통일되어 있다 (grep 결과 1종만).
- OG 카드가 검색엔진 미리보기 도구에서 정상 렌더된다.
- `sitemap.xml`이 200으로 응답하며 단일 도메인을 기준으로 한다.

### Phase B 완료 정의
- 광고 영역에 실제 광고가 1회 이상 노출되거나, AdSense 콘솔에서 impression 카운트가 잡힌다.
- GA4 실시간 보고서에서 `generate_start`, `view_result`, `replace_meal` 이벤트가 확인된다.

### Phase C 완료 정의
- 결과 페이지에서 "공유" 버튼으로 링크 복사가 가능하다.
- 복사한 링크를 새 탭/시크릿 모드에서 열었을 때 동일한 식단(또는 동일 입력 기반의 식단)이 재현된다.
- 공유 링크의 OG 카드가 정상 노출된다.

### Phase D 완료 정의
- `/generate`, `/result` 모두 페이지별 적절한 `<title>`을 가진다.
- URL에 사용자 입력 평문이 포함되지 않는다.
- 사용하지 않는 API 라우트가 제거되었거나, 사용처가 명시적으로 연결되었다.

### Phase E 완료 정의
- 공통 UI가 `components/ui/*`에서 단일 소스로 관리된다.
- Header에서 정책 페이지 진입이 가능하다.
- 동적 OG가 적용된 페이지에서 페이지별 카드가 자동으로 생성된다.

---

## 7. 참고 — 현재 진단 시점 핵심 이슈 요약

(자세한 내용은 진단 보고 참고)

1. 도메인 불일치 3종 충돌 (`mealplanner-19t.pages.dev` ↔ `meal-planner.pages.dev`)
2. `public/og-image.png`가 52바이트 ASCII 텍스트(placeholder) — OG 카드 깨짐
3. `AdBanner`에 `adsbygoogle.push({})` 호출 누락 — 실광고 미노출 가능
4. GA 미설치 상태에서 `gtag()` 호출 — 이벤트 데이터 손실
5. `/result`에 공유 기능 부재 + sessionStorage 의존 → URL 공유 불가 구조
6. `/result`, `/generate`에 페이지별 metadata 없음
7. `/api/generate`, `/api/replace-meal`이 클라이언트 흐름에서 미사용 의심
8. 사용자 입력이 URL 쿼리스트링으로 노출 (`/generating?input=...`)

---

문서 작성일 기준: 2026-05-06
작성: 자동 식단 생성기 작업 계획 (1단계 진단 → 2단계 작업 계획)
