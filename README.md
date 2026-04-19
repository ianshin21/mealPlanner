# 자동 식단 생성기 MVP

1인·2인 가정을 위한 14·28일 자동 식단 생성 웹앱

## 시작 전 필수 설치

### 1. Node.js 설치 (필수)
1. https://nodejs.org → LTS 버전 다운로드 (v20 이상 권장)
2. 설치 후 터미널(명령 프롬프트)에서 확인:
   ```
   node -v
   npm -v
   ```

### 2. 의존성 설치
프로젝트 폴더에서:
```bash
npm install
```

## 로컬 실행

```bash
npm run dev
```
브라우저에서 http://localhost:3000 접속

## 배포: Cloudflare Pages

### 사전 준비
1. Cloudflare 계정 생성: https://cloudflare.com
2. Wrangler CLI 로그인:
   ```bash
   npx wrangler login
   ```

### 배포 방법 A: CLI로 직접 배포
```bash
# 1. Cloudflare Pages 빌드
npm run pages:build

# 2. 배포
npm run deploy
```

### 배포 방법 B: GitHub 연동 (권장)
1. GitHub에 저장소 생성 후 코드 푸시
2. Cloudflare Pages 대시보드 → "Create a project" → GitHub 연동
3. 빌드 설정:
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
4. 환경 변수 설정 (선택):
   - `NEXT_PUBLIC_ADSENSE_CLIENT`: Google AdSense Publisher ID
   - `NEXT_PUBLIC_ADSENSE_SLOT`: AdSense Slot ID

## Google AdSense 설정

1. `.env.local` 파일 생성 (`.env.local.example` 참고):
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_SLOT=XXXXXXXXXX
   ```
2. `app/layout.tsx`에서 AdSense 스크립트 주석 해제

## 폴더 구조

```
meal-planner/
├── app/
│   ├── page.tsx               # 랜딩 페이지
│   ├── generate/page.tsx      # 식단 생성 입력
│   ├── result/page.tsx        # 결과 페이지
│   ├── privacy/page.tsx       # 개인정보처리방침
│   ├── terms/page.tsx         # 이용약관
│   ├── disclaimer/page.tsx    # 면책 고지
│   ├── blog/                  # SEO 콘텐츠 페이지
│   │   ├── 1in-diet-guide/
│   │   ├── easy-korean-cooking/
│   │   └── healthy-meal-tips/
│   ├── api/
│   │   ├── generate/route.ts       # 식단 생성 API
│   │   └── replace-meal/route.ts   # 끼니 교체 API
│   ├── layout.tsx             # 루트 레이아웃 (SEO 메타태그)
│   └── sitemap.ts             # 자동 사이트맵
├── components/
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   ├── meal/MealCard.tsx      # 끼니 카드 (교체 기능 포함)
│   ├── meal/DayPlanCard.tsx   # 하루 식단 카드
│   └── ads/AdBanner.tsx       # AdSense 슬롯 컴포넌트
├── lib/
│   ├── types.ts               # TypeScript 타입 정의
│   └── meal-generator.ts      # 식단 생성 알고리즘
├── data/
│   └── menus.json             # 메뉴 시드 데이터 (100개)
└── public/
    └── robots.txt
```

## 주요 설계 결정사항

- **세션 저장**: 생성된 식단은 브라우저 `sessionStorage`에만 저장, 24시간 후 자동 만료
- **서버 상태 없음**: 서버에 개인 데이터 미저장 (개인정보 최소 수집)
- **Edge Runtime**: API 라우트는 Cloudflare Workers와 호환되는 Edge Runtime 사용
- **AdSense 슬롯**: 랜딩/결과/블로그 페이지에 배치, `AdBanner` 컴포넌트로 관리
- **SEO**: 메타태그, OG 태그, 사이트맵, robots.txt 포함

## 2단계 확장 계획

- 메뉴 DB를 Cloudflare D1 (SQLite) 또는 KV로 이전
- 사용자 즐겨찾기 (로컬스토리지 기반)
- 장보기 목록 자동 생성
- 영양 정보 상세 표시
- 주간 식단 캘린더 뷰
