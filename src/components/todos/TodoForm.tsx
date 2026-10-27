"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import { generateKeyBetween } from "@/lib/fractionalIndex";
import { formatDate } from "@/lib/utils";
import { Priority } from "@/types";

const fieldClass =
  "rounded-lg border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

export default function TodoForm() {
  const { todos, addTodo, weeklyPlans, goals, fetchWeeklyPlans, fetchGoals } =
    useAppStore();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [weeklyPlanId, setWeeklyPlanId] = useState("");
  const [goalId, setGoalId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeeklyPlans();
    fetchGoals();
  }, [fetchWeeklyPlans, fetchGoals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    setError("");
    const todoColumn = todos.filter((t) => t.status === "todo");
    const lastOrder = todoColumn.length
      ? todoColumn[todoColumn.length - 1].order
      : null;
    addTodo({
      title,
      status: "todo",
      priority,
      dueDate: dueDate || undefined,
      order: generateKeyBetween(lastOrder, null),
      weeklyPlanId: weeklyPlanId || undefined,
      goalId: goalId || undefined,
    });
    setTitle("");
    setDueDate("");
    setPriority("medium");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-3 shadow-card"
    >
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          placeholder="새 할일 제목"
          className={`min-w-[160px] flex-1 ${fieldClass}`}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={fieldClass}
        >
          <option value="high">우선순위: 높음</option>
          <option value="medium">우선순위: 보통</option>
          <option value="low">우선순위: 낮음</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={fieldClass}
        />
        <select
          value={weeklyPlanId}
          onChange={(e) => setWeeklyPlanId(e.target.value)}
          className={fieldClass}
        >
          <option value="">주간계획 연결 안 함</option>
          {weeklyPlans.map((w) => (
            <option key={w._id} value={w._id}>
              {formatDate(w.weekStart)} 주
            </option>
          ))}
        </select>
        <select
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          className={fieldClass}
        >
          <option value="">목표 연결 안 함</option>
          {goals.map((g) => (
            <option key={g._id} value={g._id}>
              {g.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          추가
        </button>
      </div>
    </form>
  );
}
