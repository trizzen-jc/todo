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
          className="min-h-[110px] cursor-pointer rounded-lg border border-black/10 p-2 hover:bg-black/5"
        >
          <div className="mb-1 text-xs font-medium text-foreground/50">
            {label}
          </div>
          <div className="flex flex-col gap-1">
            {dayTodos
              .filter((t) => t.dayOfWeek === idx)
              .map((t) => (
                <div
                  key={t._id}
                  className="rounded bg-black/5 px-2 py-1 text-xs"
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
              className="mt-1 w-full rounded border border-black/15 px-1 py-0.5 text-xs"
            />
          )}
        </div>
      ))}
    </div>
  );
}
