# 🚗 SimCar - 중고차 쇼핑몰

## 프로젝트 소개
SimCar는 신뢰할 수 있는 중고차 거래 플랫폼입니다. 사용자들에게 투명한 중고차 정보를 제공하고, 안전한 거래 환경을 조성하는 것을 목표로 합니다.

## 기술 스택

### Frontend
* React 18
* TypeScript
* Tailwind CSS
* Redux Toolkit (상태 관리)
* React Router (라우팅)
* Axios (API 통신)

### 개발 환경
* Vite
* ESLint
* Prettier

## 프로젝트 구조
src/
├── assets/      # 이미지, 폰트 등 정적 파일
├── components/  # 재사용 가능한 컴포넌트
├── pages/       # 페이지 컴포넌트
├── hooks/       # 커스텀 훅
├── api/         # API 관련 로직
├── store/       # 상태 관리 (Redux)
├── styles/      # 글로벌 스타일, 테마
├── types/       # TypeScript 타입 정의
└── utils/       # 유틸리티 함수
Copy
## 주요 기능
* 중고차 검색 및 필터링
* 차량 상세 정보 조회
* 관심 차량 저장
* 실시간 가격 비교
* 차량 구매 예약
* 사용자 인증 및 프로필 관리

## 시작하기

### 설치
```bash
# 저장소 클론
git clone https://github.com/Oz-Capstone/Simcar-Front-Web.git
cd Simcar-Front-Web

# 의존성 설치
npm install
개발 서버 실행
bashCopynpm run dev
빌드
bashCopynpm run build
브랜치 전략

main: 최종 배포용 브랜치
develop: 개발 완료 후 테스트 브랜치
yjw: 실제 개발 작업 브랜치

커밋 컨벤션
Copyfeat: 기능 개발
design: 디자인 변경, UI 작업
fix: 버그 수정
refactor: 코드 리팩토링
docs: 문서 작업
test: 테스트 케이스 작성
config: 환경 설정 관련
