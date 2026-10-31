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
    <label className="flex items-center gap-2 text-[14px] text-foreground">
      <input
        type="checkbox"
        checked={item.done}
        onChange={onToggle}
        className="h-4 w-4 rounded border-line text-primary focus:ring-0"
      />
      <span className={item.done ? "text-muted line-through" : ""}>
        {item.text}
      </span>
    </label>
  );
}
