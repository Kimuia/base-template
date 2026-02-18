# Base Template

Next.js 기반 프로젝트 템플릿. 클론 후 바로 개발을 시작할 수 있는 보일러플레이트입니다.

## Quick Start

```bash
# 1. 클론
git clone <repo-url> my-project
cd my-project

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
cp .env.example .env.local

# 4. 개발 서버
pnpm dev
```

## Tech Stack

| 분류       | 기술                                                  |
| ---------- | ----------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack)                    |
| Language   | TypeScript (strict)                                   |
| Styling    | Tailwind CSS v4                                       |
| Validation | Zod                                                   |
| Test       | Jest + Testing Library, Storybook                     |
| Lint       | ESLint flat config (boundaries, import-x, check-file) |
| Code Gen   | Plop                                                  |

## Project Structure

```
src/
├── app/                  # 라우트 (페이지, 레이아웃, API)
│   ├── (public)/         #   공개 페이지
│   ├── (private)/        #   인증 필수 페이지
│   └── api/              #   API Routes
│
├── entity/               # 엔티티 데이터 (schema, service, constant)
├── module/               # 유스케이스 (loader, action, adapter, type, components)
├── section/              # 레이아웃 조합 (Header, Sidebar, Footer)
└── shared/               # 공통 유틸 (도메인 무관)
    ├── components/       #   Spinner, EmptyState, ErrorMessage
    ├── hooks/            #   useDebounce, usePagination, useIntersectionObserver
    ├── lib/              #   fetcher (API 클라이언트), SEO 헬퍼
    ├── model/            #   ActionResult, PaginatedResponse
    ├── provider/         #   ToastProvider
    ├── store/            #   전역 상태
    └── utils/            #   cn, formatDate, formatNumber
```

## Scripts

| Script            | 설명                       |
| ----------------- | -------------------------- |
| `pnpm dev`        | 개발 서버 (Turbopack)      |
| `pnpm build`      | 프로덕션 빌드              |
| `pnpm lint`       | ESLint 검사                |
| `pnpm type-check` | TypeScript 타입 검사       |
| `pnpm test`       | Jest 테스트                |
| `pnpm storybook`  | Storybook 실행 (포트 6006) |
| `pnpm generate`   | Plop 코드 생성             |

## Code Generation

Plop으로 레이어 규칙에 맞는 파일을 자동 생성합니다.

```bash
# entity 생성 (schema, service, constant, index)
pnpm generate entity

# module 생성 (loader, action, adapter, type, components, index)
pnpm generate module
```

## Import 규칙

단방향 import만 허용됩니다. ESLint `boundaries` 플러그인으로 강제합니다.

```
app → section → module → entity → shared
```
