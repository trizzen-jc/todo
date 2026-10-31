import { Priority } from "@/types";

const STYLES: Record<Priority, string> = {
  high: "bg-primary/10 text-primary",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-surface-strong text-muted",
};

const LABELS: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  );
}
