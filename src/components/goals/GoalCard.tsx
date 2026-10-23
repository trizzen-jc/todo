"use client";

import { Goal } from "@/types";
import GoalProgress from "./GoalProgress";

export default function GoalCard({
  goal,
  progress,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  progress: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium">{goal.title}</h3>
        <div className="flex shrink-0 gap-1 text-xs">
          <button
            onClick={onEdit}
            className="rounded px-2 py-1 text-foreground/60 hover:bg-black/5"
          >
            수정
          </button>
          <button
            onClick={onDelete}
            className="rounded px-2 py-1 text-red-600 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>
      {goal.description && (
        <p className="mt-1 text-sm text-foreground/60">{goal.description}</p>
      )}
      <GoalProgress progress={progress} />
    </div>
  );
}
