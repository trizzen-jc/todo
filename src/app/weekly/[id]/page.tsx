"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppStore } from "@/store";
import WeeklyGoalItem from "@/components/weekly/WeeklyGoalItem";
import WeekGrid from "@/components/weekly/WeekGrid";
import ProgressBar from "@/components/shared/ProgressBar";
import { formatDate } from "@/lib/utils";

const textareaClass =
  "rounded-lg border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

export default function WeeklyDetailPage() {
  const params = useParams<{ id: string }>();
  const { weeklyPlans, fetchWeeklyPlans, toggleWeeklyGoal, updateWeeklyPlan } =
    useAppStore();
  const [memo, setMemo] = useState("");
  const [retrospective, setRetrospective] = useState("");

  useEffect(() => {
    fetchWeeklyPlans();
  }, [fetchWeeklyPlans]);

  const plan = weeklyPlans.find((w) => w._id === params.id);

  useEffect(() => {
    if (plan) {
      setMemo(plan.memo);
      setRetrospective(plan.retrospective ?? "");
    }
  }, [plan]);

  if (!plan) return <p className="text-sm text-muted">불러오는 중...</p>;

  const doneCount = plan.goals.filter((g) => g.done).length;
  const progress = plan.goals.length
    ? Math.round((doneCount / plan.goals.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {formatDate(plan.weekStart)} 주 계획
        </h1>
        <p className="mt-1 text-sm text-muted">
          진행률 {progress}% ({doneCount}/{plan.goals.length})
        </p>
        <div className="mt-2 max-w-xs">
          <ProgressBar progress={progress} />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 shadow-card">
        <h2 className="text-sm font-medium text-muted">주간 목표</h2>
        {plan.goals.map((g, i) => (
          <WeeklyGoalItem
            key={i}
            item={g}
            onToggle={() => toggleWeeklyGoal(plan._id, i)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted">요일별 할일</h2>
        <WeekGrid weeklyPlanId={plan._id} />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted">메모</h2>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          onBlur={() => updateWeeklyPlan(plan._id, { memo })}
          rows={4}
          className={textareaClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted">주간 회고</h2>
        <textarea
          value={retrospective}
          onChange={(e) => setRetrospective(e.target.value)}
          onBlur={() => updateWeeklyPlan(plan._id, { retrospective })}
          rows={4}
          placeholder="이번 주를 돌아보며..."
          className={textareaClass}
        />
      </div>
    </div>
  );
}
