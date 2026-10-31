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
    <div className="rounded-md border border-line bg-surface p-4 transition-shadow hover:shadow-card">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-semibold text-foreground">
          {goal.title}
        </h3>
        <div className="flex shrink-0 gap-1 text-[13px]">
          <button
            onClick={onEdit}
            className="rounded-sm px-2 py-1 text-muted transition-colors hover:bg-surface-soft hover:text-foreground"
          >
            수정
          </button>
          <button
            onClick={onDelete}
            className="rounded-sm px-2 py-1 text-error transition-colors hover:bg-surface-soft"
          >
            삭제
          </button>
        </div>
      </div>
      {goal.description && (
        <p className="mt-1 text-[14px] text-muted">{goal.description}</p>
      )}
      <GoalProgress progress={progress} />
    </div>
  );
}
