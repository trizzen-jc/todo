"use client";

import { WeeklyGoalItem as WeeklyGoalItemType } from "@/types";

export default function WeeklyGoalItem({
  item,
  onToggle,
}: {
  item: WeeklyGoalItemType;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={item.done} onChange={onToggle} />
      <span className={item.done ? "text-foreground/40 line-through" : ""}>
        {item.text}
      </span>
    </label>
  );
}
