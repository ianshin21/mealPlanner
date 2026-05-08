# LUNCH & PARTY 기능 설계 문서

> 프로젝트: meal-planner (mealplanner-19t.pages.dev)  
> 작성일: 2026-05-08  
> 범위: "오늘 점심 뭐 먹지?" / "오늘 회식 어디서 하지?" 코너 신규 추가

---

## 1. 기능 요구사항 정리

### 1-1. 핵심 사용자 시나리오

| 시나리오 | 사용자 | 핵심 가치 |
|---------|--------|----------|
| 점심 메뉴 못 정하겠다 | 직장인 (혼자/소규모) | 현재 위치 기반 주변 식당 즉시 추천 |
| 회식 장소 못 정하겠다 | 팀장/총무 | 회식 적합 식당 추천 + 카카오 공유 |
| 밥값/술값 누가 낼지 정해야 한다 | 회식 참여자 | 사다리타기로 결정 |
| 1/N 계산이 귀찮다 | 더치페이 상황 | 빠른 더치페이 계산 |

### 1-2. 기능 요구사항 목록

#### F1. 홈 화면 진입점
- [ ] '무료로 식단 만들기' 버튼 아래에 "오늘 점심 뭐 먹지?" / "오늘 회식 어디서 하지?" 카드 2개 배치
- [ ] 각 카드는 독립적인 페이지(`/lunch`, `/party`)로 이동

#### F2. 점심 추천 (`/lunch`)
- [ ] 현재 위치 기반 반경 500m~1km 내 식당 목록 조회
- [ ] 랜덤 추천 1개 강조 표시 (큰 카드)
- [ ] 추천 목록 최대 5개 표시
- [ ] "다시 추천" 버튼: 오늘 하루 내 이전과 다른 결과 반환
- [ ] 1주/2주 이내 방문한 식당 제외 (localStorage 히스토리 기반)
- [ ] 식당 카드: 이름, 카테고리, 거리, 카카오맵 링크
- [ ] 선호 메뉴 저장 (하트 버튼)
- [ ] 카카오톡 공유 (추천 결과 공유)

#### F3. 회식 추천 (`/party`)
- [ ] 점심과 동일한 위치 기반 구조
- [ ] 반경을 1~2km로 확대
- [ ] 회식 적합 필터: 단체석 가능, 술 판매 여부 (카테고리 기반 필터링)
- [ ] 식당 카드: 점심 카드 + 예상 인원 선택 (2명 / 5명 / 10명+)
- [ ] 예상 1인당 비용 표시 (카테고리 기반 대략값)
- [ ] 카카오톡 공유 (장소 공유)

#### F4. 중복 방지 (1주/2주)
- [ ] localStorage에 방문(선택) 히스토리 저장 (식당 ID + 날짜)
- [ ] 설정에서 중복 방지 기간 선택: 없음 / 1주 / 2주
- [ ] 히스토리 초기화 버튼 제공

#### F5. 선호 메뉴/식당 저장
- [ ] 하트 버튼으로 즐겨찾기 추가/제거
- [ ] 즐겨찾기 목록 페이지 또는 드로어 표시
- [ ] 즐겨찾기는 localStorage에 영구 저장 (만료 없음)

#### F6. 사다리타기 게임 (`/ladder`)
- [ ] 참여자 이름 입력 (2~10명)
- [ ] 결과 항목 입력: "밥값 계산", "다음에 또 쏘기" 등 자유 입력
- [ ] 사다리 애니메이션 시각화
- [ ] 결과 공개 연출 (순차적 reveal)
- [ ] 카카오톡 공유: 결과 이미지 또는 텍스트 공유

#### F7. 더치페이 계산기 (`/dutch`)
- [ ] 총 금액 입력
- [ ] 인원 수 입력 (1~20명)
- [ ] 1인당 금액 자동 계산 (원 단위 올림)
- [ ] 잔돈 처리 방식 선택: 랜덤 1명 / 첫 번째 사람 / 마지막 사람
- [ ] 품목별 입력 모드: 각 항목 금액 입력 → 합계 자동
- [ ] 카카오톡 공유: "오늘 밥값은 1인당 N원입니다" 텍스트 공유

#### F8. 카카오톡 공유 연결
- [ ] 기존 `KakaoShare` 유틸리티 재사용
- [ ] 각 기능별 공유 템플릿 분리 정의
- [ ] 공유 내용: 식당명/결과 + 앱 링크

---

## 2. 화면 흐름도

```
홈 (/)
├── [오늘 점심 뭐 먹지? →] ──────────────► /lunch
│                                           ├── 위치 권한 요청 배너
│                                           ├── 추천 결과 (큰 카드 1 + 목록 4)
│                                           ├── [다시 추천] → 결과 재조회
│                                           ├── [즐겨찾기 ♥] → localStorage 저장
│                                           └── [카카오 공유] → 공유 팝업
│
├── [오늘 회식 어디서 하지? →] ──────────► /party
│                                           ├── 위치 권한 요청 배너
│                                           ├── 인원 수 선택 (2/5/10명+)
│                                           ├── 추천 결과 (큰 카드 1 + 목록 4)
│                                           ├── [다시 추천] → 결과 재조회
│                                           ├── [즐겨찾기 ♥] → localStorage 저장
│                                           └── [카카오 공유] → 공유 팝업
│
├── (추천 결과 페이지 하단)
│   ├── [사다리타기 하기 →] ─────────────► /ladder
│   │                                       ├── 참여자 입력 (이름 목록)
│   │                                       ├── 결과 항목 입력
│   │                                       ├── [사다리 시작!] → 애니메이션
│   │                                       ├── 결과 공개 (순차 reveal)
│   │                                       └── [카카오 공유] → 결과 공유
│   │
│   └── [더치페이 계산 →] ───────────────► /dutch
│                                           ├── 총 금액 입력
│                                           ├── 인원 수 입력
│                                           ├── 잔돈 처리 선택
│                                           ├── 1인당 금액 표시
│                                           └── [카카오 공유] → 결과 공유
│
└── (공통) 즐겨찾기 목록
    └── /favorites (또는 홈 내 드로어)
        ├── 저장된 식당 목록
        └── [삭제] / [카카오맵에서 열기]
```

---

## 3. 페이지 구조

```
app/
├── lunch/
│   └── page.tsx               # 점심 추천 메인 페이지 (Client Component)
│
├── party/
│   └── page.tsx               # 회식 추천 메인 페이지 (Client Component)
│
├── ladder/
│   └── page.tsx               # 사다리타기 게임 페이지 (Client Component)
│
├── dutch/
│   └── page.tsx               # 더치페이 계산기 페이지 (Client Component)
│
├── favorites/
│   └── page.tsx               # 즐겨찾기 목록 페이지 (Client Component)
│
└── api/
    └── places/
        ├── nearby/
        │   └── route.ts       # GET /api/places/nearby?lat=&lng=&type=lunch|party
        └── recommend/
            └── route.ts       # POST /api/places/recommend (히스토리 기반 필터링)
```

**메타데이터 (SEO)**

| 경로 | title | description |
|------|-------|-------------|
| `/lunch` | 오늘 점심 뭐 먹지? — 주변 식당 즉시 추천 | 현재 위치 기반으로 점심 메뉴를 추천해 드립니다 |
| `/party` | 오늘 회식 어디서 하지? — 회식 장소 추천 | 팀 회식에 적합한 주변 식당을 찾아 드립니다 |
| `/ladder` | 사다리타기 — 밥값/회식비 결정 게임 | 누가 낼지 사다리타기로 공정하게 결정하세요 |
| `/dutch` | 더치페이 계산기 — 1/N 빠른 계산 | 회식비·밥값을 빠르게 나눠 계산하세요 |

---

## 4. 컴포넌트 구조

```
components/
├── lunch-party/
│   ├── LunchPartyEntrySection.tsx   # 홈 화면 진입 카드 2개 (점심/회식)
│   ├── PlaceRecommendCard.tsx       # 식당 추천 카드 (큰 카드 / 작은 카드 variant)
│   ├── PlaceList.tsx                # 추천 결과 목록 (큰 카드 + 스크롤 목록)
│   ├── LocationPermissionBanner.tsx # 위치 권한 요청 UI
│   ├── HeadcountSelector.tsx        # 인원 수 선택 (회식용)
│   ├── HistorySettings.tsx          # 중복 방지 기간 설정 + 초기화
│   └── FavoritesList.tsx            # 즐겨찾기 목록
│
├── ladder/
│   ├── LadderGame.tsx               # 사다리 게임 전체 컨테이너
│   ├── LadderCanvas.tsx             # 사다리 SVG/Canvas 렌더링
│   ├── ParticipantInput.tsx         # 참여자 이름 입력 폼
│   └── LadderResult.tsx             # 결과 표시 (reveal 애니메이션)
│
└── dutch/
    ├── DutchPayCalculator.tsx       # 더치페이 계산기 전체
    ├── ItemInputList.tsx            # 품목별 금액 입력 목록
    └── DutchPayResult.tsx           # 계산 결과 표시
```

### 주요 컴포넌트 Props 설계

#### `PlaceRecommendCard`
```tsx
interface PlaceRecommendCardProps {
  place: Place;          // 식당 정보
  variant: "hero" | "list";  // 큰 카드 or 목록 카드
  isFavorite: boolean;
  onFavoriteToggle: (placeId: string) => void;
  onSelect: (place: Place) => void;  // 선택 시 히스토리 기록
}
```

#### `LadderGame`
```tsx
interface LadderGameProps {
  initialParticipants?: string[];  // 사전 입력 (공유 링크로 진입 시)
}
```

#### `DutchPayCalculator`
```tsx
// 내부 상태만 사용, props 없음 (독립형 도구)
```

---

## 5. API 구조

### 5-1. 외부 API 선택

| 후보 | 장점 | 단점 | 결론 |
|------|------|------|------|
| **카카오 로컬 API** | 한국 데이터 정확도 높음, 카카오맵 연동 자연스러움 | API 키 별도 발급 | **1순위** |
| Google Places API | 글로벌 데이터, 풍부한 정보 | 유료 (월 $200 무료 크레딧) | 2순위 (대안) |
| Naver 지역 검색 API | 네이버 지도 연동 | 카카오 공유와 혼재 | 미사용 |

> **권장**: 카카오 로컬 API 사용. 기존 `NEXT_PUBLIC_KAKAO_APP_KEY`와 다른 **REST API 키**가 별도 필요.  
> 환경 변수 추가: `KAKAO_REST_API_KEY` (서버 사이드 전용, `NEXT_PUBLIC_` 접두사 없음)

### 5-2. API Route 설계

#### `GET /api/places/nearby`

```
쿼리 파라미터:
  lat       number   현재 위치 위도 (필수)
  lng       number   현재 위치 경도 (필수)
  type      string   "lunch" | "party"
  radius    number   검색 반경 미터 (기본값: lunch=800, party=1500)
  page      number   페이지 번호 (기본값: 1)

응답:
  {
    places: Place[],   // 최대 15개
    total: number
  }
```

#### `POST /api/places/recommend`

```
요청 바디:
  {
    lat: number,
    lng: number,
    type: "lunch" | "party",
    excludeIds: string[],   // 히스토리에서 전달된 제외할 식당 ID 목록
    seed?: number           // 오늘 날짜 기반 시드 (같은 날 같은 결과)
  }

응답:
  {
    recommended: Place,    // 메인 추천 1개
    alternatives: Place[]  // 대안 4개
  }
```

### 5-3. Place 타입 정의

```ts
// lib/types/place.ts
export interface Place {
  id: string;
  name: string;
  category: string;        // "한식", "일식", "중식", "술집" 등
  address: string;
  distance: number;        // 미터
  phone?: string;
  kakaoMapUrl: string;     // https://place.map.kakao.com/{id}
  x: string;              // 경도 (카카오 API 형식)
  y: string;              // 위도 (카카오 API 형식)
  estimatedPricePerPerson?: number;  // 카테고리 기반 추정값
}
```

### 5-4. 카테고리별 예상 1인당 비용 (정적 매핑)

```ts
// lib/constants/priceEstimates.ts
export const PRICE_ESTIMATES: Record<string, number> = {
  "한식": 9000,
  "일식": 13000,
  "중식": 10000,
  "양식": 14000,
  "분식": 7000,
  "술집": 25000,
  "고기요리": 18000,
  "해산물": 20000,
};
```

---

## 6. localStorage 데이터 구조

### 키 목록

| 키 | 타입 | 설명 | 만료 |
|----|------|------|------|
| `meal-planner:place-history` | `PlaceHistoryItem[]` | 방문(선택)한 식당 히스토리 | 항목별 14일 자동 만료 |
| `meal-planner:favorites` | `FavoritePlace[]` | 즐겨찾기 식당 | 영구 (수동 삭제) |
| `meal-planner:dedup-period` | `"none" \| "7d" \| "14d"` | 중복 방지 기간 설정 | 영구 |
| `meal-planner:last-location` | `{ lat, lng, savedAt }` | 마지막 위치 캐시 | 1시간 |
| `meal-planner:ladder-history` | `LadderResult[]` | 사다리타기 결과 이력 | 최근 10건 |

### 타입 정의

```ts
interface PlaceHistoryItem {
  placeId: string;
  placeName: string;
  type: "lunch" | "party";
  selectedAt: number;      // timestamp (ms)
}

interface FavoritePlace {
  placeId: string;
  placeName: string;
  category: string;
  kakaoMapUrl: string;
  savedAt: number;
}

interface LadderResult {
  participants: string[];
  results: Record<string, string>;  // { "이름": "당첨 항목" }
  createdAt: number;
}
```

### 히스토리 만료 처리

```ts
// 조회 시점에 14일 이전 항목을 자동으로 정리
function getActiveHistory(period: "7d" | "14d"): PlaceHistoryItem[] {
  const cutoff = Date.now() - (period === "7d" ? 7 : 14) * 24 * 60 * 60 * 1000;
  const raw = JSON.parse(localStorage.getItem("meal-planner:place-history") ?? "[]");
  return raw.filter((item: PlaceHistoryItem) => item.selectedAt > cutoff);
}
```

---

## 7. 단계별 구현 순서

전체를 **4단계**로 나눠 각 단계마다 독립적으로 동작하는 결과물이 나오도록 설계했습니다.

---

### Phase 1 — 홈 화면 진입점 + UI 뼈대 (2~3일)

> 목표: 외부 API 없이도 화면 구조 확인 가능한 상태

1. `components/lunch-party/LunchPartyEntrySection.tsx` 작성  
   - 홈 화면에 점심/회식 카드 2개 배치  
   - 각각 `/lunch`, `/party`로 링크
2. `app/lunch/page.tsx` 생성 — 목 데이터로 PlaceList 렌더링
3. `app/party/page.tsx` 생성 — 목 데이터 + 인원 선택 UI
4. `components/lunch-party/PlaceRecommendCard.tsx` 작성 (hero / list variant)
5. `components/lunch-party/LocationPermissionBanner.tsx` 작성
6. `app/page.tsx`에 `LunchPartyEntrySection` 삽입

**완료 기준**: 홈 → 점심/회식 페이지 이동, 목 데이터 카드 렌더링 확인

---

### Phase 2 — 위치 기반 API 연동 (2~3일)

> 목표: 실제 위치 기반 식당 추천 동작

1. 카카오 REST API 키 발급 및 `KAKAO_REST_API_KEY` 환경 변수 설정  
   (Cloudflare Pages → Environment Variables에도 추가)
2. `lib/types/place.ts` 타입 정의
3. `app/api/places/nearby/route.ts` 구현 (카카오 로컬 API 프록시)
4. `app/api/places/recommend/route.ts` 구현 (시드 기반 랜덤 추천 + 제외 목록 처리)
5. `/lunch`, `/party` 페이지에서 `navigator.geolocation` 연동
6. 로딩/에러 상태 처리 (위치 권한 거부, API 실패)
7. localStorage 히스토리 저장 로직 (`lib/storage/placeHistory.ts`)

**완료 기준**: 실제 위치 기반 식당 5개 추천, "다시 추천" 동작 확인

---

### Phase 3 — 즐겨찾기 + 중복 방지 + 카카오 공유 (1~2일)

> 목표: 사용성 핵심 기능 완성

1. `lib/storage/favorites.ts` — 즐겨찾기 CRUD
2. `PlaceRecommendCard`에 하트 버튼 연결
3. `app/favorites/page.tsx` 즐겨찾기 목록 페이지
4. `components/lunch-party/HistorySettings.tsx` — 중복 방지 기간 설정 UI
5. `/lunch`, `/party` 추천 API 호출 시 히스토리 기반 `excludeIds` 전달
6. 카카오톡 공유 연결 — 기존 `KakaoShare` 유틸 재사용, 새 템플릿 추가

**완료 기준**: 즐겨찾기 저장/조회, 2주 내 방문 식당 제외, 카카오 공유 동작 확인

---

### Phase 4 — 사다리타기 + 더치페이 (2~3일)

> 목표: 유틸리티 도구 2개 완성

1. `app/dutch/page.tsx` + `DutchPayCalculator.tsx`  
   - 총액/인원 입력 → 1인당 계산 → 잔돈 처리 옵션 → 카카오 공유
2. `app/ladder/page.tsx` + `LadderGame.tsx`  
   - 참여자/결과 항목 입력 → 사다리 SVG 렌더링 → 결과 reveal 애니메이션 → 카카오 공유
3. `/lunch`, `/party` 결과 페이지 하단에 사다리/더치페이 진입 링크 추가
4. 전체 흐름 통합 테스트

**완료 기준**: 사다리타기 전체 플로우, 더치페이 계산 + 공유 동작 확인

---

## 8. 기술 결정 사항 및 제약

### 카카오 로컬 API 사용 시 주의사항
- REST API 키는 서버에서만 호출 (`/api/places/*` Route Handler 경유)  
  → 클라이언트에서 직접 호출 시 도메인 허용 설정 필요, 키 노출 위험
- 카카오 로컬 API 무료 할당량: 일 30만 건 (초과 시 오류 발생)
- 카카오맵 링크 형식: `https://place.map.kakao.com/{kakao_place_id}`

### Cloudflare Pages 환경 변수 추가 필요
- `KAKAO_REST_API_KEY` — 카카오 로컬 API REST 키 (서버 전용)

### 사다리타기 구현 방식
- 순수 CSS/SVG 애니메이션 (Canvas 불필요)
- 알고리즘: 세로선 N개 + 가로선 랜덤 생성 후 경로 추적
- 라이브러리 불필요 (의존성 추가 없음)

### Geolocation 대안 처리
- 위치 권한 거부 시: 수동 주소 입력 폼으로 fallback
- HTTPS 환경에서만 `navigator.geolocation` 동작 (Cloudflare Pages는 HTTPS 기본)

---

## 9. 파일별 구현 체크리스트 (Phase 순서)

### Phase 1
- [ ] `components/lunch-party/LunchPartyEntrySection.tsx`
- [ ] `components/lunch-party/PlaceRecommendCard.tsx`
- [ ] `components/lunch-party/PlaceList.tsx`
- [ ] `components/lunch-party/LocationPermissionBanner.tsx`
- [ ] `components/lunch-party/HeadcountSelector.tsx`
- [ ] `app/lunch/page.tsx`
- [ ] `app/party/page.tsx`
- [ ] `app/page.tsx` — LunchPartyEntrySection 삽입

### Phase 2
- [ ] `lib/types/place.ts`
- [ ] `lib/constants/priceEstimates.ts`
- [ ] `lib/storage/placeHistory.ts`
- [ ] `app/api/places/nearby/route.ts`
- [ ] `app/api/places/recommend/route.ts`
- [ ] `/lunch`, `/party` Geolocation 연동

### Phase 3
- [ ] `lib/storage/favorites.ts`
- [ ] `components/lunch-party/HistorySettings.tsx`
- [ ] `components/lunch-party/FavoritesList.tsx`
- [ ] `app/favorites/page.tsx`
- [ ] 카카오 공유 템플릿 추가 (`lib/kakao.ts` 또는 `result/page.tsx` 참고)

### Phase 4
- [ ] `components/dutch/DutchPayCalculator.tsx`
- [ ] `components/dutch/ItemInputList.tsx`
- [ ] `components/dutch/DutchPayResult.tsx`
- [ ] `app/dutch/page.tsx`
- [ ] `components/ladder/LadderGame.tsx`
- [ ] `components/ladder/LadderCanvas.tsx`
- [ ] `components/ladder/ParticipantInput.tsx`
- [ ] `components/ladder/LadderResult.tsx`
- [ ] `app/ladder/page.tsx`
