import { Priority } from "@/types";

const STYLES: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  low: "bg-foreground/5 text-muted",
};

const LABELS: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  );
}
