"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { getWeekStart, formatDate } from "@/lib/utils";

export default function WeeklyPlanForm({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const { goals, addWeeklyPlan } = useAppStore();
  const [goalTexts, setGoalTexts] = useState<string[]>([""]);
  const [memo, setMemo] = useState("");
  const [goalId, setGoalId] = useState("");
  const [error, setError] = useState("");

  const updateGoalText = (i: number, value: string) => {
    setGoalTexts((prev) => prev.map((t, idx) => (idx === i ? value : t)));
  };

  const addGoalField = () => {
    if (goalTexts.length >= 5) return;
    setGoalTexts((prev) => [...prev, ""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const weekStart = formatDate(getWeekStart());
    const goalsPayload = goalTexts
      .filter((t) => t.trim())
      .map((text) => ({ text, done: false }));
    const created = await addWeeklyPlan({
      weekStart,
      goals: goalsPayload,
      memo,
      goalId: goalId || undefined,
    });
    if (!created) {
      setError("이미 이번 주 계획이 있어요.");
      return;
    }
    onCreated(created._id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4"
    >
      <h2 className="font-semibold">이번 주 계획 만들기</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-2">
        <label className="text-sm text-foreground/60">
          주간 목표 (최대 5개)
        </label>
        {goalTexts.map((text, i) => (
          <input
            key={i}
            value={text}
            onChange={(e) => updateGoalText(i, e.target.value)}
            placeholder={`목표 ${i + 1}`}
            className="rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
        ))}
        {goalTexts.length < 5 && (
          <button
            type="button"
            onClick={addGoalField}
            className="self-start text-sm text-foreground/60 hover:underline"
          >
            + 목표 추가
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-foreground/60">
          연결할 1년 목표 (선택)
        </label>
        <select
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          className="rounded-lg border border-black/15 px-3 py-2 text-sm"
        >
          <option value="">선택 안 함</option>
          {goals.map((g) => (
            <option key={g._id} value={g._id}>
              {g.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-foreground/60">주간 메모</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          className="rounded-lg border border-black/15 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="self-end rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-black/80"
      >
        생성
      </button>
    </form>
  );
}
