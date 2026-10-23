export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
      <div
        className="h-full bg-black transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
