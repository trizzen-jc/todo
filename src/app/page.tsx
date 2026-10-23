"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useAppStore } from "@/store";
import { getWeekStart, formatDate } from "@/lib/utils";
import WeeklyGoalItem from "@/components/weekly/WeeklyGoalItem";
import NeedLoginBanner from "@/components/shared/NeedLoginBanner";

export default function DashboardPage() {
  const {
    weeklyPlans,
    fetchWeeklyPlans,
    toggleWeeklyGoal,
    todos,
    fetchTodos,
    goals,
    fetchGoals,
  } = useAppStore();

  useEffect(() => {
    fetchWeeklyPlans();
    fetchTodos();
    fetchGoals();
  }, [fetchWeeklyPlans, fetchTodos, fetchGoals]);

  const thisWeekStart = formatDate(getWeekStart());
  const plan = weeklyPlans.find(
    (w) => formatDate(w.weekStart) === thisWeekStart
  );

  const statusCounts = {
    todo: todos.filter((t) => t.status === "todo").length,
    doing: todos.filter((t) => t.status === "doing").length,
    done: todos.filter((t) => t.status === "done").length,
  };

  const doneCount = plan?.goals.filter((g) => g.done).length ?? 0;
  const progress =
    plan && plan.goals.length
      ? Math.round((doneCount / plan.goals.length) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={null}>
        <NeedLoginBanner />
      </Suspense>
      <h1 className="text-xl font-semibold">대시보드</h1>

      {!plan ? (
        <div className="rounded-xl border border-black/10 bg-white p-4 text-sm text-foreground/60">
          아직 이번 주 계획이 없어요.{" "}
          <Link href="/weekly" className="underline">
            주간 계획 만들러 가기
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">
              {formatDate(plan.weekStart)} 주 계획
            </h2>
            <span className="text-sm text-foreground/60">
              진행률 {progress}% ({doneCount}/{plan.goals.length})
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full bg-black transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex flex-col gap-1">
            {plan.goals.map((g, i) => (
              <WeeklyGoalItem
                key={i}
                item={g}
                onToggle={() => toggleWeeklyGoal(plan._id, i)}
              />
            ))}
          </div>
          {plan.memo && (
            <p className="mt-3 whitespace-pre-wrap rounded-lg bg-black/5 p-2 text-sm text-foreground/70">
              {plan.memo}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-black/10 bg-white p-4 text-center">
          <div className="text-2xl font-semibold">{statusCounts.todo}</div>
          <div className="text-xs text-foreground/50">할 일</div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4 text-center">
          <div className="text-2xl font-semibold">{statusCounts.doing}</div>
          <div className="text-xs text-foreground/50">진행 중</div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4 text-center">
          <div className="text-2xl font-semibold">{statusCounts.done}</div>
          <div className="text-xs text-foreground/50">완료</div>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-foreground/60">
          1년 목표
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {goals.map((g) => {
            const linkedCount = todos.filter(
              (t) => t.goalId === g._id && t.weeklyPlanId === plan?._id
            ).length;
            return (
              <div
                key={g._id}
                className="rounded-xl border border-black/10 bg-white p-3 text-sm"
              >
                <span className="font-medium">{g.title}</span>
                <span className="ml-2 text-foreground/50">
                  이번 주 연결 할일 {linkedCount}개
                </span>
              </div>
            );
          })}
          {goals.length === 0 && (
            <p className="text-sm text-foreground/50">
              등록된 목표가 없어요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
