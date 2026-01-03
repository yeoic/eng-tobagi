# 재료 다:씀 레시피

냉장고에 남은 재료를 선택하면 재료를 최대한 활용할 수 있는 레시피를 추천해주는 웹 애플리케이션입니다.

## 기능

### 공개 페이지
- **홈 (`/`)**: 재료 선택 (다중 선택 칩 + 검색)
- **레시피 목록 (`/recipes`)**: 선택한 재료 활용도 순으로 정렬된 레시피 목록
- **레시피 상세 (`/recipes/[id]`)**: 조리법 + 재료 정보 + 남은 재료 활용 팁

### 관리자 페이지
- **대시보드 (`/admin`)**: 통계 및 최근 레시피
- **재료 관리 (`/admin/ingredients`)**: 재료 CRUD
- **레시피 관리 (`/admin/recipes`)**: 레시피 CRUD

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS + shadcn/ui
- **데이터베이스**: Neon Postgres
- **ORM**: Prisma
- **배포**: Vercel

## 로컬 개발 환경 설정

### 1. 패키지 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

`.env` 파일을 편집하여 Neon Postgres 연결 문자열을 입력합니다:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
ADMIN_KEY="your-secret-admin-key"  # 선택사항 - 설정하면 관리자 페이지 보호
```

### 3. Prisma 설정

```bash
# Prisma 클라이언트 생성
pnpm prisma generate

# 데이터베이스 마이그레이션
pnpm prisma migrate dev

# 시드 데이터 입력
pnpm db:seed
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## Vercel 배포

### 1. Vercel 프로젝트 연결

GitHub 저장소를 Vercel에 연결합니다.

### 2. 환경 변수 설정

Vercel 프로젝트 설정에서 다음 환경 변수를 추가합니다:

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `DATABASE_URL` | Neon Postgres 연결 문자열 | O |
| `ADMIN_KEY` | 관리자 접근 키 | X |

### 3. 배포

`main` 브랜치에 푸시하면 자동으로 배포됩니다.

배포 후 Prisma 마이그레이션을 실행해야 할 수 있습니다:

```bash
npx prisma migrate deploy
```

## 활용도 점수 계산

```
score = (선택한 재료 중 레시피에 사용된 재료 수) / (선택한 재료 총 수)
```

예시:
- 선택한 재료: 대파, 계란, 마늘 (3개)
- 파전 레시피: 대파, 계란 사용 (2개 일치)
- 활용도 점수: 2/3 = 66.7%

레시피는 활용도 점수 내림차순, 조리 시간 오름차순으로 정렬됩니다.

## 관리자 접근

`ADMIN_KEY` 환경 변수가 설정된 경우:
- `/admin/login`에서 키를 입력하여 로그인
- 쿠키 또는 `X-Admin-Key` 헤더로 인증

`ADMIN_KEY`가 설정되지 않은 경우:
- 모든 관리자 페이지에 자유롭게 접근 가능 (개발 모드)

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 실행 |
| `pnpm db:migrate` | Prisma 마이그레이션 |
| `pnpm db:seed` | 시드 데이터 입력 |
| `pnpm db:studio` | Prisma Studio 실행 |

## 프로젝트 구조

```
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈페이지
│   ├── recipes/
│   │   ├── page.tsx        # 레시피 목록
│   │   └── [id]/page.tsx   # 레시피 상세
│   ├── admin/
│   │   ├── layout.tsx      # 관리자 레이아웃
│   │   ├── page.tsx        # 대시보드
│   │   ├── ingredients/    # 재료 관리
│   │   └── recipes/        # 레시피 관리
│   └── api/
│       ├── ingredients/    # 공개 API
│       ├── recipes/        # 공개 API
│       └── admin/          # 관리자 API
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   └── ...                 # 커스텀 컴포넌트
├── lib/
│   ├── db.ts              # Prisma 클라이언트
│   ├── utils.ts           # 유틸리티 함수
│   ├── ranking.ts         # 활용도 점수 계산
│   └── validations.ts     # Zod 스키마
└── prisma/
    ├── schema.prisma      # 데이터베이스 스키마
    └── seed.ts            # 시드 스크립트
```

## 라이선스

MIT
