# SubStats — 나의 구독 분석 대시보드

구독 중인 YouTube 채널들의 통계를 한눈에 확인하고, 지표별 TOP 3 채널을 포디움에서 즐겨보세요.

## 주요 기능

- **4대 지표 카드** — 구독 기간, 시청한 영상 수, 좋아한 영상 수, 시청 시간
- **포디움** — 지표별 TOP 3 채널을 금/은/동 포디움 애니메이션으로 표시
- **레이더 차트** — TOP 5 채널 종합 점수 비교
- **전체 채널 테이블** — 지표별 정렬 및 채널 검색
- **Google Takeout 가져오기** — `watch-history.json`으로 시청 영상 수 / 시청 시간 보완
- **데모 모드** — API 키 없이도 샘플 데이터로 UI 확인 가능

## 기술 스택

- [Next.js 14](https://nextjs.org/) (App Router)
- [Firebase](https://firebase.google.com/) — Auth (Google OAuth), Firestore
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)

## 시작하기

### 1. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local`에 아래 값을 채워주세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_YOUTUBE_API_KEY=
```

### 2. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. **Authentication > 로그인 제공업체**에서 Google 활성화
3. **Authentication > 설정 > 승인된 도메인**에 배포 도메인 추가

### 3. Google Cloud 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 **YouTube Data API v3** 활성화
2. OAuth 동의 화면에 `https://www.googleapis.com/auth/youtube.readonly` 스코프 추가

### 4. 로컬 실행

```bash
npm install
npm run dev
```

## Vercel 배포

1. Vercel에 레포지토리 연결
2. **Environment Variables**에 `.env.local`의 값 동일하게 입력
3. 배포 후 Firebase에 Vercel 도메인을 승인된 도메인으로 추가

## 시청 데이터 가져오기 (선택)

YouTube API는 시청 기록을 제공하지 않습니다. [Google Takeout](https://takeout.google.com)에서 YouTube 데이터를 내보내면 `Takeout/YouTube and YouTube Music/history/watch-history.json` 파일을 받을 수 있습니다. 대시보드의 **시청 기록 가져오기** 버튼으로 업로드하면 시청 영상 수와 시청 시간이 채워집니다.
