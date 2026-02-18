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

## Layered Slice Architecture

[FSD(Feature-Sliced Design)](https://feature-sliced.design/)에서 영감을 받은 레이어 구조입니다. 단방향 import만 허용하며, 각 레이어는 명확한 책임을 가집니다.

```
app (pages)  →  section  →  module  →  entity  →  shared
라우트 조합      모듈 조합     유스케이스(기능) 엔티티 데이터   순수 유틸
─────────────────────────────────────────────────────────→
                    참조 방향 (역방향 금지)
```

### shared — 순수 유틸

도메인과 무관한 범용 코드. **2개 이상 module에서 사용되는 것만** 이 레이어에 둡니다.

| 폴더          | 역할                       | 예시                            |
| ------------- | -------------------------- | ------------------------------- |
| `components/` | 순수 UI (props만으로 동작) | Spinner, EmptyState, Skeleton   |
| `hooks/`      | 범용 훅                    | useDebounce, usePagination      |
| `lib/`        | 라이브러리 설정/래퍼       | fetcher, SEO 헬퍼               |
| `model/`      | 공통 타입                  | ActionResult, PaginatedResponse |
| `store/`      | 순수 UI 전역 상태          | modal, toast, theme             |
| `provider/`   | 전역 컨테이너              | ToastProvider                   |
| `utils/`      | 유틸리티 함수              | cn, formatDate, sanitize        |

**금지:** entity/module import, Server Action 직접 호출

### entity — 엔티티 데이터

엔티티별 데이터 접근 계층. **UI 없음, React 의존 없음.**

```
entity/<name>/
├── <name>.schema.ts      # Zod 스키마 + API 타입 추론
├── <name>.service.ts     # fetch 래퍼
├── <name>.constant.ts    # 캐시 태그 + 상수/열거값
├── <name>.util.ts        # 엔티티 고유 순수 함수 (선택)
├── <name>.store.ts       # 클라이언트 상태 (선택)
└── index.ts
```

**언제 entity에 둘까?**

```
React에 의존하는가?         → Yes → module (hooks, components)
특정 유스케이스에 종속되는가?  → Yes → module (action, adapter, type)
특정 엔티티에 귀속되는가?     → Yes → entity (schema, constant, util)
위 모두 아님                → shared (utils)
```

**금지:** UI 컴포넌트, React hooks, adapter, revalidateTag 호출

### module — 유스케이스

화면/기능 단위의 자기완결적 모듈. 여러 entity 서비스를 오케스트레이션합니다.

```
module/<entity>/<use-case>/
├── <use-case>.loader.ts     # 서버 데이터 로딩 (읽기)
├── <use-case>.action.ts     # Server Action (쓰기 mutation)
├── <use-case>.adapter.ts    # API ↔ UI 타입 변환
├── <use-case>.type.ts       # 화면 특화 타입 (ViewModel)
├── components/              # UI 컴포넌트
└── index.ts
```

**읽기/쓰기 분리:**

| 유형 | 파일        | 네이밍                | `'use server'` | revalidate |
| ---- | ----------- | --------------------- | -------------- | ---------- |
| 읽기 | `loader.ts` | `getXxx`, `searchXxx` | 없음           | 없음       |
| 쓰기 | `action.ts` | `xxxAction`           | 필수           | 필수       |

- Loader는 Server Component에서 직접 `await` 호출 (Next.js 캐싱/Streaming 활용)
- Action은 Client Component에서 `useTransition`으로 호출
- Adapter는 순수 함수 — API 스펙 변경의 영향을 여기서 흡수

**확장 트리거:**

| 조건               | 액션                    |
| ------------------ | ----------------------- |
| hooks 2개 이상     | `hooks/` 폴더 생성      |
| component 3개 이상 | 각 컴포넌트 하위 폴더화 |
| 멀티스텝 플로우    | `store/` 추가           |

**금지:** entity 스키마 재정의, 직접 fetch, 다른 module 역방향 import

### section — 모듈 조합 (권장)

여러 module을 조합하는 레이아웃 컴포넌트. **필수가 아닌 권장** 패턴입니다.

| 이럴 때 section 생성                 | 이럴 때 불필요            |
| ------------------------------------ | ------------------------- |
| 동일 조합이 2개+ 페이지에서 반복     | module 1~3개 단순 배치    |
| module 4개+ 조합                     | layout에서 직접 조합 가능 |
| 조합에 글루 로직 필요 (상태 공유 등) |                           |

**금지:** entity 직접 참조 (module 통해서), 자체 action/adapter 보유

### pages (app/) — 라우트

module/section을 조합하고 metadata를 정의하는 라우트 계층입니다.

| 포함                         | 미포함                   |
| ---------------------------- | ------------------------ |
| section/module 조합          | 비즈니스 로직            |
| metadata 정의                | 직접 fetch               |
| Suspense 경계 (Streaming)    | entity service 직접 호출 |
| Error Boundary (`error.tsx`) | 타입 변환                |

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
