"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import WeeklyPlanForm from "@/components/weekly/WeeklyPlanForm";
import { getWeekStart, formatDate } from "@/lib/utils";

export default function WeeklyListPage() {
  const { weeklyPlans, fetchWeeklyPlans, goals, fetchGoals } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    fetchWeeklyPlans();
    fetchGoals();
  }, [fetchWeeklyPlans, fetchGoals]);

  const thisWeekStart = formatDate(getWeekStart());
  const thisWeekPlan = weeklyPlans.find(
    (w) => formatDate(w.weekStart) === thisWeekStart
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        주간 계획
      </h1>

      {!thisWeekPlan && (
        <WeeklyPlanForm onCreated={(id) => router.push(`/weekly/${id}`)} />
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted">최근 4주</h2>
        {weeklyPlans.map((w) => {
          const goal = goals.find((g) => g._id === w.goalId);
          return (
            <Link
              key={w._id}
              href={`/weekly/${w._id}`}
              className="rounded-xl border border-line bg-surface p-3 text-sm text-foreground shadow-card transition-shadow hover:shadow-md"
            >
              {formatDate(w.weekStart)} 주 — 목표 {w.goals.length}개
              {goal && <span className="ml-2 text-muted">({goal.title})</span>}
            </Link>
          );
        })}
        {weeklyPlans.length === 0 && (
          <p className="text-sm text-muted">아직 계획이 없어요.</p>
        )}
      </div>
    </div>
  );
}
