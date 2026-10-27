export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
      <div
        className="h-full rounded-full bg-primary-600 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
