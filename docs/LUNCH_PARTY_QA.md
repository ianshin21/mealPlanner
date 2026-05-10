# 점심 · 회식 · 계산기 · 게임 기능 QA 및 배포 체크리스트

> 대상 기능: 프롬프트 14–23에서 추가된 신규 코너  
> 최종 갱신: 2026-05-10  
> 기존 배포 체크리스트: `docs/DEPLOY_CHECKLIST.md` (식단 생성기 전용, 별도 유지)

---

## 1. 주요 기능 목록

| 기능 | 설명 | 상태 |
|------|------|------|
| 점심 추천 | GPS 또는 수동 주소 기반 주변 맛집 추천 (필터: 카테고리, 예산, 도보 거리, 중복 제외) | 완성 |
| 회식 추천 | GPS 또는 수동 주소 기반 회식 장소 추천 (필터: 인원, 예산, 술 포함, 메뉴 스타일, 분위기) | 완성 |
| 즐겨찾기 | 점심·회식 추천 결과를 localStorage에 저장/해제 | 완성 |
| 1/N 더치페이 계산기 | 총액·인원·단위 올림·음식/술값 분리 계산, 텍스트 복사 | 완성 |
| 사다리타기 | 참가자·항목 입력 → SVG 사다리 생성 → 개별/전체 공개 → 결과 복사 | 완성 |
| 카카오 공유 | 점심·회식 추천 결과, 더치페이 계산 결과, 사다리 결과를 카카오톡으로 공유 | 완성 |
| 이벤트 추적 | GA4 연동 익명 이벤트 추적 (진입·추천·재시도·즐겨찾기·공유 등) | 완성 |

---

## 2. 라우트 목록

| 경로 | 파일 | 유형 |
|------|------|------|
| `/lunch` | `app/lunch/page.tsx` + `LunchClient.tsx` | 클라이언트 기능 |
| `/lunch/favorites` | `app/lunch/favorites/page.tsx` | 즐겨찾기 목록 |
| `/party` | `app/party/page.tsx` + `PartyClient.tsx` | 클라이언트 기능 |
| `/tools/split` | `app/tools/split/page.tsx` + `SplitClient.tsx` | 클라이언트 기능 |
| `/games/ladder` | `app/games/ladder/page.tsx` + `LadderClient.tsx` | 클라이언트 기능 |
| `/api/places/search` | `app/api/places/search/route.ts` | Kakao Local API 프록시 |

---

## 3. 환경변수 목록

### 3-1. 서버 전용 (Cloudflare Pages 환경 변수 → `NEXT_PUBLIC_` 접두사 없음)

| 변수명 | 용도 | 미설정 시 동작 |
|--------|------|--------------|
| `KAKAO_REST_API_KEY` | Kakao Local API 장소 검색 (`/api/places/search`) | 런타임 오류 — 점심·회식 추천 전체 불가 |

### 3-2. 클라이언트 공개 (`NEXT_PUBLIC_` 접두사, 번들에 포함됨)

| 변수명 | 용도 | 미설정 시 동작 |
|--------|------|--------------|
| `NEXT_PUBLIC_KAKAO_APP_KEY` | Kakao Share JS SDK 초기화 | 카카오 공유 버튼 비활성화 (Web Share API 폴백) |
| `NEXT_PUBLIC_SERVICE_URL` | Kakao 공유 링크 base URL | `http://localhost:3000` 폴백 — 운영 시 반드시 설정 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 이벤트 수집 | 이벤트 미수집 (기능 동작에는 영향 없음) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense | 광고 미표시 |
| `NEXT_PUBLIC_ADSENSE_SLOT` | Google AdSense | 광고 미표시 |

> **주의**: `KAKAO_REST_API_KEY`는 서버 전용입니다. 절대 `NEXT_PUBLIC_` 접두사를 붙이지 마세요.

---

## 4. Kakao Share SDK 설정 체크 항목

카카오톡 공유 기능(`lib/share/kakao.ts`)에 필요한 설정입니다.

### 4-1. 앱 등록 및 키 발급

- [ ] [카카오 개발자 콘솔](https://developers.kakao.com) → 내 애플리케이션 → 앱 추가
- [ ] 앱 설정 → 앱 키 → **JavaScript 키** 복사
- [ ] `NEXT_PUBLIC_KAKAO_APP_KEY` 환경 변수에 JavaScript 키 설정 (로컬: `.env.local`, 운영: Cloudflare Pages)

### 4-2. 플랫폼 도메인 등록

- [ ] 앱 설정 → 플랫폼 → Web → 사이트 도메인에 서비스 도메인 등록
  - 로컬: `http://localhost:3000`
  - 운영: `https://mealplanner-19t.pages.dev` (커스텀 도메인 전환 시 해당 도메인으로 교체)
- [ ] **미등록 시 증상**: SDK `init` 단계에서 차단 → 공유 버튼 클릭 시 무반응

### 4-3. 카카오 공유 메시지 확인 항목

| 공유 유형 | objectType | 파라미터 소스 |
|-----------|-----------|-------------|
| 점심 추천 | `feed` | `sharePlace({ type: "lunch", ... })` |
| 회식 추천 | `feed` | `sharePlace({ type: "party", ... })` |
| 더치페이 | `text` | `shareSplit({ total, headcount, ... })` |
| 사다리타기 | `text` | `shareLadder({ results })` |

> **200자 제한**: `text` 타입(더치페이, 사다리)은 Kakao 정책상 200자 초과 시 오류. 참가자 8명 이상이거나 항목이 많으면 초과 가능 — `lib/share/kakao.ts` 주석 확인.

### 4-4. 공유 동작 확인

- [ ] 점심 결과 카드의 "공유" 버튼 → 카카오톡 공유 팝업 정상 노출
- [ ] 회식 결과 카드의 "공유" 버튼 → 카카오톡 공유 팝업 정상 노출
- [ ] 더치페이 "카카오 공유" 버튼 정상 동작
- [ ] 사다리타기 "카카오 공유" 버튼 (전체 공개 후에만 노출) 정상 동작
- [ ] SDK 미설정 시 Web Share API 폴백 동작 확인 (Android Chrome에서 확인)

---

## 5. Kakao Local API 설정 체크 항목

장소 검색(`/api/places/search` 프록시)에 필요한 설정입니다.

### 5-1. REST API 키 발급

- [ ] [카카오 개발자 콘솔](https://developers.kakao.com) → 앱 키 → **REST API 키** 복사
  - JavaScript 키와 다른 별개의 키입니다
- [ ] `KAKAO_REST_API_KEY` 환경 변수에 REST API 키 설정
  - 로컬: `.env.local`
  - 운영: Cloudflare Pages → Settings → Environment variables → Production + Preview 모두 추가

### 5-2. API 요청 제한 확인

- [ ] 카카오 개발자 콘솔 → 앱 정보 → 할당량 → 로컬 API 일일 할당량 확인
  - 기본: 30만 건/일 (초과 시 429 오류)
  - Route Handler에 `next: { revalidate: 60 }` 캐시 설정으로 중복 요청 억제
- [ ] `/api/places/search` 응답 구조: `{ ok: true, places: Place[] }` 또는 `{ ok: false, error: string }`

### 5-3. 동작 확인

- [ ] GPS 모드: 현재 위치 허용 → 추천 결과 카드 표시 (주변 2km 이내 음식점 최대 45개 후보)
- [ ] 수동 모드: 주소 입력 (예: "강남역") → 키워드 기반 검색 결과 표시
- [ ] API 키 미설정 시 추천 버튼 클릭 → 오류 메시지 "주변 식당을 검색하지 못했어요" 표시 확인

---

## 6. OG 이미지 작업 현황

현재 신규 페이지들은 공통 `/og-image.png`를 임시로 사용합니다. 페이지별 전용 이미지를 제작한 뒤 아래 위치를 교체하세요.

| 페이지 | 제작할 파일 | 교체 위치 | 권장 콘텐츠 |
|--------|-----------|---------|-----------|
| `/lunch` | `public/og-lunch.png` | `app/lunch/page.tsx` images[0].url | 음식 이모지 + "오늘 점심 뭐 먹지?" 텍스트, 하늘색 배경 |
| `/party` | `public/og-party.png` | `app/party/page.tsx` images[0].url | 회식 이모지 + "오늘 회식 어디서 하지?" 텍스트, 주황색 배경 |
| `/tools/split` | `public/og-split.png` | `app/tools/split/page.tsx` images[0].url | 계산기 이모지 + "1/N 더치페이 계산기", 회색 배경 |
| `/games/ladder` | `public/og-ladder.png` | `app/games/ladder/page.tsx` images[0].url | 사다리 일러스트 + "사다리타기", 흰 배경 |

**스펙**: 1200 × 630px, PNG, 불투명 배경, 주요 텍스트 중앙 배치  
**교체 방법**: 파일을 `public/` 에 넣고 해당 `page.tsx`의 `images[0].url`을 `"/og-lunch.png"` 등으로 변경

---

## 7. 수동 테스트 시나리오

### 시나리오 A — 점심 추천 (GPS 모드)

1. `/lunch` 진입
2. 위치 탭: "📍 현재 위치" 선택 → "위치 권한 허용하기" 클릭
3. 브라우저 위치 권한 허용 → "✓ 현재 위치를 사용합니다" 표시 확인
4. 카테고리: "🍲 한식" 선택 / 예산: "1만원대" / 거리: "도보 5분" 선택
5. "점심 메뉴 추천받기 →" 클릭
6. **기대 결과**: 결과 화면 전환, 로딩 후 영웅 카드 1개 + 목록 카드 최대 4개 표시
7. 영웅 카드의 카카오맵 버튼 탭 → 카카오맵 앱 또는 웹으로 이동 확인
8. "🔄 다시 추천" 클릭 → 다른 결과로 교체 확인
9. 영웅 카드 ♥ 아이콘 탭 → 즐겨찾기 추가 확인
10. "공유" 버튼 탭 → 카카오 공유 팝업 확인 (SDK 설정된 경우)

### 시나리오 B — 점심 추천 (수동 주소 모드)

1. `/lunch` 진입 → "✏️ 직접 입력" 선택
2. 입력란에 "홍대입구" 입력
3. "점심 메뉴 추천받기 →" 클릭 → 결과 표시 확인
4. **체크**: GPS 없이도 추천 동작, 거리 필터는 "거리 무관" 자동 적용

### 시나리오 C — 회식 추천

1. `/party` 진입
2. 인원: "4~6명" / 예산: "2만원대" / 술: "🍺 포함" / 메뉴: "🥩 고기" / 분위기: "😊 무난"
3. "회식 장소 추천받기 →" 클릭 → 결과 확인
4. 결과 화면 하단 크로스링크 "사다리타기", "더치페이 계산" 탭 → 해당 페이지 이동 확인

### 시나리오 D — 1/N 계산기

1. `/tools/split` 진입
2. 총 금액: "52,000" 입력 → 인원: "4명"
3. **기대 결과**: "1인당 13,000원" 표시
4. 단위 올림: "1,000원" 선택 → 금액 변경 확인
5. "음식/술값 분리" 토글 활성화 → 술값 입력란 노출 확인
6. 술값 입력 → 음식값·술값 분리 계산 결과 확인
7. "카카오톡 전달용 텍스트" 복사 버튼 → 클립보드 복사 확인
8. "카카오 공유" 버튼 → 공유 팝업 확인
9. "링크 복사" 버튼 → "복사됨 ✓" 피드백 확인

### 시나리오 E — 사다리타기

1. `/games/ladder` 진입
2. 참가자: "홍길동", "김철수", "이영희" / 항목: "당첨", "꽝", "꽝"
3. "사다리 생성" 클릭 → SVG 사다리 화면 전환
4. 참가자 이름 탭 → 경로 애니메이션(0.8초) 후 결과 공개 확인
5. "전체 공개" 클릭 → 모든 결과 동시 공개 확인
6. "결과 요약" 섹션 표시 확인
7. "결과 복사" → 클립보드 복사 확인
8. "카카오 공유" 버튼 노출 및 동작 확인
9. "다시 생성" → 같은 참가자로 새 사다리 생성 확인
10. "처음부터" → 참가자 입력 화면으로 복귀 확인

### 시나리오 F — 홈 화면 진입 흐름

1. `/` 진입
2. 히어로 섹션: "무료로 식단 만들기" CTA 확인 (식단 생성기 연결)
3. 구분선 "오늘 외식 고민이라면" 아래 점심·회식 카드 확인
4. 점심 카드 탭 → `/lunch` 이동 (이벤트: `lunch_entry_click` 발화)
5. 뒤로가기 → 회식 카드 탭 → `/party` 이동 (이벤트: `party_entry_click` 발화)
6. 1/N 계산기 링크 → `/tools/split` 이동
7. 사다리타기 링크 → `/games/ladder` 이동

---

## 8. 모바일 테스트 항목

실제 기기(iOS Safari / Android Chrome) 또는 DevTools 모바일 에뮬레이션으로 확인합니다.

### 레이아웃

- [ ] `/lunch` 폼: 칩 버튼 여러 줄 시 overflow 없이 wrap 확인
- [ ] `/party` 폼: 스크롤 없이 모든 입력 항목 접근 가능
- [ ] `/tools/split`: 인원 수 ─ / + 버튼 탭 영역 충분한 크기 (최소 44px)
- [ ] `/games/ladder`: SVG 사다리 가로 스크롤 확인 (참가자 6명 이상일 때 특히)
- [ ] 참가자 이름 탭 영역: 확대 탭 영역(60×44px) 으로 작은 화면에서도 탭 가능 확인

### 위치 권한

- [ ] iOS Safari: 위치 권한 팝업 → 허용 → GPS 좌표 수신 확인
- [ ] Android Chrome: 위치 권한 팝업 → 허용 → GPS 좌표 수신 확인
- [ ] 거부 시: `LocationPermissionBanner` 노출 및 "설정에서 허용" 안내 메시지 확인

### 공유

- [ ] 카카오 SDK 미설정 환경(로컬 등)에서 Web Share API 폴백 동작 (Android)
- [ ] iOS Safari: Web Share API 지원 여부 확인 (iOS 15+: 지원)
- [ ] 카카오톡 앱 설치 기기: 카카오 공유 버튼 → 카카오톡으로 바로 연결 확인

### 성능

- [ ] 추천 결과 로딩 중 스켈레톤 UI 표시 확인 (3G 스로틀링 상태)
- [ ] 사다리타기 SVG 렌더링 속도 (참가자 8명 최대 시)

---

## 9. Cloudflare Pages 배포 전 체크리스트

### 코드 검증

- [ ] `npx tsc --noEmit` — TypeScript 오류 없음
- [ ] `npm run lint` — ESLint 오류 없음
- [ ] `npm run build` — 빌드 성공

### 환경변수 (Cloudflare Pages → Settings → Environment variables)

| 변수명 | 환경 | 필수 |
|--------|------|------|
| `KAKAO_REST_API_KEY` | Production + Preview | **필수** (장소 검색 불가) |
| `NEXT_PUBLIC_KAKAO_APP_KEY` | Production + Preview | 권장 (없으면 공유 폴백) |
| `NEXT_PUBLIC_SERVICE_URL` | Production | 권장 (`https://mealplanner-19t.pages.dev`) |
| `NEXT_PUBLIC_GA_ID` | Production | 권장 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Production | 선택 |
| `NEXT_PUBLIC_ADSENSE_SLOT` | Production | 선택 |

### 카카오 콘솔 사전 확인

- [ ] Kakao 개발자 콘솔 → 플랫폼 → Web → 사이트 도메인에 운영 도메인 등록되어 있는지 확인
- [ ] Kakao Local API 일일 할당량 소진 여부 확인 (할당량 초과 시 배포 직후 추천 불가)

### 메타데이터 및 SEO

- [ ] 신규 라우트 4개가 `app/sitemap.ts`에 포함되어 있는지 확인
  - `/lunch`, `/party`, `/tools/split`, `/games/ladder`
- [ ] 각 `page.tsx`의 `metadata.alternates.canonical` URL이 운영 도메인과 일치하는지 확인
- [ ] OG 이미지 경로(`/og-image.png` 임시) 접근 가능 여부 확인

---

## 10. 배포 후 실제 서비스 점검 항목

### 기능 동작 (운영 URL에서 직접 확인)

- [ ] `/lunch` — GPS 위치 기반 추천 결과 표시 (네트워크 탭에서 `/api/places/search` 200 OK 확인)
- [ ] `/party` — 추천 결과 표시 및 크로스링크 동작
- [ ] `/tools/split` — 계산 결과 정상, 텍스트 복사 동작
- [ ] `/games/ladder` — 사다리 생성, 결과 공개, 복사 동작

### 카카오 공유 운영 검증

- [ ] `/lunch` 결과 공유 버튼 → 카카오톡 "나에게 보내기" 테스트 → 수신 메시지에서 장소명·카테고리·거리 확인
- [ ] `/tools/split` 공유 버튼 → 수신 메시지에서 금액·인원·1인당 금액 확인
- [ ] `/games/ladder` 공유 버튼 → 수신 메시지에서 결과 목록 확인
- [ ] 공유 메시지의 "지금 추천받기" / "계산기 열기" 버튼 탭 → 운영 URL로 정상 이동

### Analytics 이벤트 수집 확인 (GA4 실시간 보고서)

| 이벤트 | 발화 조건 | 확인 방법 |
|--------|---------|---------|
| `lunch_entry_click` | 홈 → 점심 카드 탭 | GA4 실시간 → 이벤트 목록 |
| `party_entry_click` | 홈 → 회식 카드 탭 | GA4 실시간 → 이벤트 목록 |
| `lunch_recommend_start` | 점심 "추천받기" 버튼 클릭 | GA4 실시간 |
| `lunch_recommend_complete` | 추천 결과 로드 완료 | GA4 실시간 |
| `lunch_retry` | "🔄 다시 추천" 클릭 | GA4 실시간 |
| `lunch_favorite` | ♥ 즐겨찾기 버튼 탭 | GA4 실시간 |
| `party_recommend_start` | 회식 "추천받기" 버튼 클릭 | GA4 실시간 |
| `party_recommend_complete` | 추천 결과 로드 완료 | GA4 실시간 |
| `split_calculate` | 총액 첫 입력 후 자동 (세션 1회) | GA4 실시간 |
| `ladder_start` | "사다리 생성" 버튼 클릭 | GA4 실시간 |
| `kakao_share_click` | 카카오 공유 버튼 탭 (page 파라미터 포함) | GA4 실시간 → 이벤트 파라미터 |

> 개발 환경에서는 브라우저 콘솔에서 `[analytics] { event: "...", ... }` 로그로 확인 가능

### 오류 모니터링

- [ ] 브라우저 콘솔 오류 없음 (특히 Kakao SDK 초기화 관련)
- [ ] 네트워크 탭에서 `/api/places/search` 응답 상태 200 확인
- [ ] Cloudflare Pages 대시보드 → Functions → 에러율 확인

---

## 11. 알려진 제한 사항 및 향후 작업

| 항목 | 내용 |
|------|------|
| OG 이미지 | 신규 페이지 4개 모두 공통 `/og-image.png` 임시 사용 중. 전용 이미지 제작 후 각 `page.tsx` 교체 필요 (`docs/LUNCH_PARTY_QA.md` 6번 항목 참고) |
| 텍스트 공유 200자 제한 | 사다리타기 참가자 8명, 더치페이 술값 분리 시 초과 가능. `lib/share/kakao.ts` 내 TODO 주석 참고 |
| 수동 주소 모드 | 좌표 없이 키워드로만 검색 → 거리 순 정렬 불가, 정확도 순 결과만 제공 |
| 즐겨찾기 지속성 | localStorage 저장 — 브라우저 데이터 삭제 시 소실. 서버 동기화 미지원 |
| Kakao 할당량 | REST API 30만 건/일. 트래픽 급증 시 모니터링 필요 |
