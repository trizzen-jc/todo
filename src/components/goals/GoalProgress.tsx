import ProgressBar from "@/components/shared/ProgressBar";

export default function GoalProgress({ progress }: { progress: number }) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs text-foreground/50">
        <span>진행률</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-1">
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
}
