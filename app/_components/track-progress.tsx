import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

function formatSeconds(seconds: number) {
  return format(seconds * 1000, "mm:ss");
}

export function TrackProgress({
  currentTime,
  duration,
}: {
  duration: number;
  isPlaying: boolean;
  currentTime: number;
}) {
  const progressValue = (100 * currentTime) / duration;

  return (
    <div>
      <div className="flex justify-between text-muted-foreground text-sm mb-1">
        <div>{formatSeconds(currentTime)}</div>
        <div>{formatSeconds(duration)}</div>
      </div>
      <Progress value={progressValue} />
    </div>
  );
}
