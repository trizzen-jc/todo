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
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-card transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-foreground">{goal.title}</h3>
        <div className="flex shrink-0 gap-1 text-xs">
          <button
            onClick={onEdit}
            className="rounded-md px-2 py-1 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            수정
          </button>
          <button
            onClick={onDelete}
            className="rounded-md px-2 py-1 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            삭제
          </button>
        </div>
      </div>
      {goal.description && (
        <p className="mt-1 text-sm text-muted">{goal.description}</p>
      )}
      <GoalProgress progress={progress} />
    </div>
  );
}
