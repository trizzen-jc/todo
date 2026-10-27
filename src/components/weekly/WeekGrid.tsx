"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import { DAY_LABELS } from "@/lib/utils";
import { generateKeyBetween } from "@/lib/fractionalIndex";

export default function WeekGrid({ weeklyPlanId }: { weeklyPlanId: string }) {
  const { todos, fetchTodos, addTodo } = useAppStore();
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const dayTodos = todos.filter((t) => t.weeklyPlanId === weeklyPlanId);

  const handleAdd = async (day: number) => {
    if (!draft.trim()) {
      setActiveDay(null);
      return;
    }
    await addTodo({
      title: draft,
      status: "todo",
      priority: "medium",
      dayOfWeek: day,
      weeklyPlanId,
      order: generateKeyBetween(null, null),
    });
    setDraft("");
    setActiveDay(null);
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {DAY_LABELS.map((label, idx) => (
        <div
          key={label}
          onClick={() => setActiveDay(idx)}
          className="min-h-[110px] cursor-pointer rounded-xl border border-line bg-surface p-2 shadow-card transition-shadow hover:shadow-md"
        >
          <div className="mb-1 text-xs font-medium text-muted">{label}</div>
          <div className="flex flex-col gap-1">
            {dayTodos
              .filter((t) => t.dayOfWeek === idx)
              .map((t) => (
                <div
                  key={t._id}
                  className="rounded-md bg-primary-50 px-2 py-1 text-xs text-primary-700 dark:bg-primary-500/15 dark:text-primary-300"
                >
                  {t.title}
                </div>
              ))}
          </div>
          {activeDay === idx && (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd(idx);
                if (e.key === "Escape") setActiveDay(null);
              }}
              onBlur={() => handleAdd(idx)}
              placeholder="할일 입력 후 Enter"
              className="mt-1 w-full rounded-md border border-line bg-surface px-1 py-0.5 text-xs text-foreground focus:border-primary-500 focus:outline-none"
            />
          )}
        </div>
      ))}
    </div>
  );
}
