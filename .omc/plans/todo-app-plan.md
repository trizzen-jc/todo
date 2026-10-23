# 할일+목표 관리 앱(todo) — P0 구현 플랜

## Context

링크나무(linknamu) 프로젝트를 끝낸 직후, 같은 사용자가 책의 다음 챕터로 "할일 + 계획 관리 앱"을 새로 시작한다. `C:\ClaudeCode\todo` 폴더에는 현재 `docs/PRD.md`만 있고 코드는 전혀 없는 빈 프로젝트다. PRD는 단순 할일 앱을 넘어, **할 일 → 주간 계획 → 1년 목표**를 하나의 구조로 연결하는 것이 핵심 목적이다.

사용자와 이미 확정한 전제:
- 기술 스택: **Next.js 14 (App Router) + TypeScript + Tailwind CSS** (linknamu와 동일)
- 데이터 저장: **MongoDB Atlas** (linknamu와 같은 클러스터, 새 데이터베이스 `todo` 사용)
- 로그인/계정 없음 (PRD에 언급 없음, 단일 사용자 개인 앱으로 가정)
- P1(우선순위, 마감일, 진행률 자동계산 등)은 이번 단계에서 제외, P0만 구현

이 플랜은 링크나무에서 이미 검증된 패턴(`src/lib/mongodb.ts`의 MongoClient 싱글턴, API 라우트의 `clientPromise` → `db.collection()` 구조, 클라이언트 컴포넌트의 `useEffect` fetch-on-mount + 낙관적 업데이트)을 그대로 재사용한다.

---

## 1. 데이터 모델 (MongoDB, 데이터베이스명 `todo`)

### `yearlyGoals`
```ts
{
  _id: ObjectId,
  title: string,
  description: string,
  year: number,
  createdAt: Date,
  updatedAt: Date,
}
```

### `weeklyPlans`
```ts
{
  _id: ObjectId,
  weekId: string,          // 예: "2026-W04" (ISO 주차), unique index
  yearlyGoalIds: string[], // 연결된 yearlyGoals._id (문자열)
  weekGoals: [{ id: string, text: string, done: boolean }], // 최대 3~5개
  memo: string,
  createdAt: Date,
  updatedAt: Date,
}
```
`weekId`에 unique index 생성 → "이번 주 계획"은 `findOneAndUpdate(..., { upsert: true })` 한 번으로 처리 (linknamu의 `clicks/[id]/route.ts` 패턴과 동일).

### `todos`
```ts
{
  _id: ObjectId,
  title: string,
  status: "todo" | "doing" | "done",
  weekId: string | null,    // weeklyPlans.weekId 참조, null = 미배치
  dayOfWeek: number | null, // 0~6
  order: number,            // 드래그앤드랍 정렬용
  createdAt: Date,
  updatedAt: Date,
}
```

**연결 구조**: `todos.weekId` → `weeklyPlans.weekId` → `weeklyPlans.yearlyGoalIds[]` → `yearlyGoals._id`. Mongo `$lookup` 없이, 클라이언트에서 세 컬렉션을 각각 fetch해서 id로 매칭 (linknamu의 `LinkList.tsx`가 `counts[link.id]`로 매칭하던 방식과 동일).

---

## 2. 프로젝트 스캐폴딩

```powershell
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
(`docs/`만 있는 폴더라 충돌 없이 바로 진행 가능 — linknamu 때처럼 임시 폴더 우회 불필요)

생성할 구조:
```
src/
  lib/
    mongodb.ts              # linknamu 패턴 그대로
    types.ts                # Todo, WeeklyPlan, YearlyGoal 타입
    weekUtils.ts             # getCurrentWeekId() 등 ISO 주차 헬퍼
  app/
    page.tsx                 # 대시보드
    layout.tsx / globals.css
    board/page.tsx            # 할일 보드 (드래그앤드랍)
    week/page.tsx              # 주간 계획
    goals/page.tsx              # 1년 목표 목록
    api/
      todos/route.ts                      # GET(목록), POST(생성)
      todos/[id]/route.ts                  # PATCH(수정/상태변경), DELETE
      weekly-plans/route.ts                 # GET(?weekId=), POST
      weekly-plans/[weekId]/route.ts         # PATCH (upsert)
      yearly-goals/route.ts                  # GET, POST
      yearly-goals/[id]/route.ts              # PATCH, DELETE
  components/
    TodoBoard.tsx / TodoCard.tsx / TodoCreateForm.tsx
    WeeklyPlanView.tsx / WeeklyGoalList.tsx
    YearlyGoalList.tsx / YearlyGoalForm.tsx
    NavBar.tsx
```
`.env.local`에 `MONGODB_URI` 추가 (linknamu와 같은 Atlas 클러스터, db만 `todo`로 분리) — 커밋 금지, `.gitignore` 확인.

---

## 3. API 라우트

| Method | Path | 역할 |
|---|---|---|
| GET | `/api/todos` | 목록 (`?weekId=`, `?status=` 필터 옵션) |
| POST | `/api/todos` | 생성 |
| PATCH | `/api/todos/[id]` | 제목/상태/order/weekId 수정 (드래그앤드랍 반영) |
| DELETE | `/api/todos/[id]` | 삭제 |
| GET | `/api/weekly-plans?weekId=` | 특정 주 계획 조회 |
| POST | `/api/weekly-plans` | 새 주 계획 생성 |
| PATCH | `/api/weekly-plans/[weekId]` | weekGoals/memo/yearlyGoalIds 수정 (upsert) |
| GET | `/api/yearly-goals` | 목록 |
| POST | `/api/yearly-goals` | 생성 |
| PATCH / DELETE | `/api/yearly-goals/[id]` | 수정 / 삭제 |

모든 핸들러는 linknamu와 동일하게 `const client = await clientPromise; const db = client.db("todo");` 후 `db.collection<T>(...)` 사용.

---

## 4. 프론트엔드 컴포넌트 & 드래그앤드랍 라이브러리

**선택: `@dnd-kit/core` + `@dnd-kit/sortable`**
이유: React 18 + App Router와 호환성 좋음(`react-beautiful-dnd`는 유지보수 중단 + StrictMode 이슈), todo/doing/done 3열 보드 같은 자유로운 레이아웃에 적합, `DndContext` + `useSortable` + `onDragEnd`만으로 기존 `useState`+`fetch` 패턴과 자연스럽게 결합.

- `TodoBoard.tsx` — `"use client"`, mount 시 `/api/todos` fetch, 3열(todo/doing/done) 렌더, `onDragEnd`에서 로컬 상태 먼저 변경 후 `PATCH /api/todos/[id]` 호출
- `TodoCard.tsx` — `useSortable` 드래그 가능 카드
- `TodoCreateForm.tsx` — 입력 + 낙관적 추가 + POST
- `WeeklyPlanView.tsx` — `getCurrentWeekId()`로 이번 주 조회, `WeeklyGoalList` + 메모 textarea
- `YearlyGoalList.tsx` / `YearlyGoalForm.tsx` — CRUD 리스트 (LinkList/LinkCard와 동일 패턴)
- `NavBar.tsx` — `/`, `/board`, `/week`, `/goals` 이동
- `app/page.tsx` (대시보드) — 이번 주 목표/메모 + 할일 상태 요약 + 목표 목록 요약

**P1 제외 항목**: 우선순위, 마감일, 진행률 자동계산, 주간 회고 — 스키마는 나중에 필드만 추가하면 되므로 지금은 아예 안 만듦.

---

## 5. 구현 순서 (P0 내부)

1. **스캐폴딩** — create-next-app 실행, `npm run dev`로 기본 페이지 확인
2. **Mongo 연결** — `mongodb.ts` + `.env.local` 추가, 연결 확인
3. **할일 CRUD (API+최소 UI)** — 가장 먼저 (다른 모든 기능이 todos에 의존), 드래그앤드랍 전에 목록+생성만으로 먼저 검증
4. **할일 보드 + 드래그앤드랍** — `@dnd-kit` 추가, 상태 변경 PATCH 연결
5. **1년 목표 CRUD** — 독립적이라 다음 순서로 (주간 계획이 참조할 대상이 필요하므로)
6. **주간 계획 CRUD + 뷰** — todos와 yearlyGoals를 모두 참조하므로 마지막
7. **대시보드** — 위 세 가지에 다 의존하므로 제일 마지막
8. **연결 마무리** — 할일↔주간↔목표 매칭이 화면에 잘 반영되는지 다듬기

---

## 6. 완료 기준 (Acceptance Criteria)

- 할일 생성/수정/삭제가 MongoDB `todo.todos`에 실제로 반영됨
- 드래그로 todo/doing/done 이동 후 새로고침해도 상태 유지됨 (PATCH가 실제로 동작했다는 증거)
- 1년 목표 생성 후 새로고침해도 유지됨
- 이번 주 계획(목표 1~5개 + 메모) 생성 후 새로고침해도 유지됨
- 할일을 특정 요일에 배치 가능 (weekId/dayOfWeek 저장·조회 확인)
- 주간 계획이 1년 목표와 연결되고, 화면에서 어떤 목표를 위한 주인지 확인 가능
- 대시보드에서 이번 주 목표/메모 + 할일 현황 + 목표 목록을 한 번에 확인 가능
- `/`, `/board`, `/week`, `/goals` 네 페이지 모두 콘솔 에러 없이 생성→수정→드래그→삭제 전체 흐름 동작
- `.env.local`은 `.gitignore`에 포함되어 커밋되지 않음

---

## 7. 검증 방법

1. `npm run dev` → `localhost:3000` 빌드 에러 없이 뜨는지 확인
2. MongoDB Atlas에서 각 동작(생성/드래그/메모 저장)마다 실제 문서가 생기는지 직접 확인
3. 수동 플로우 테스트: 목표 생성 → 주간 계획(목표 연결 + 메모) → 할일 생성(주간 배치) → 드래그 이동 → 새로고침 → 대시보드 확인
4. 드래그 시 브라우저 개발자도구 Network 탭에서 `PATCH /api/todos/[id]` 200 응답 확인
5. 개발 서버 재시작 후에도 데이터 유지되는지 재확인 (메모리 버그 배제)

### 핵심 파일
- `C:\ClaudeCode\todo\src\lib\mongodb.ts`
- `C:\ClaudeCode\todo\src\app\api\todos\route.ts`
- `C:\ClaudeCode\todo\src\app\api\todos\[id]\route.ts`
- `C:\ClaudeCode\todo\src\components\TodoBoard.tsx`
- `C:\ClaudeCode\todo\src\app\api\weekly-plans\[weekId]\route.ts`
