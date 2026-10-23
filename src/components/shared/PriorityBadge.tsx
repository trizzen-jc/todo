import { Priority } from "@/types";

const STYLES: Record<Priority, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-black/5 text-foreground/50",
};

const LABELS: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  );
}
