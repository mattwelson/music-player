import { Button } from "@/components/ui/button";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

export function PlayPauseButton({
  isPlaying,
  play,
  pause,
}: {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
}) {
  if (isPlaying)
    return (
      <Button onClick={pause} size="rounded" title="pause">
        <Pause />
      </Button>
    );
  return (
    <Button onClick={play} size="rounded" title="play">
      <Play />
    </Button>
  );
}

export function Controls({
  isPlaying,
  play,
  pause,
  next,
  previous,
}: {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
}) {
  return (
    <div className="flex justify-center gap-2">
      <Button size="rounded" variant="ghost" onClick={previous}>
        <SkipBack />
      </Button>
      <PlayPauseButton isPlaying={isPlaying} pause={pause} play={play} />
      <Button size="rounded" variant="ghost" onClick={next}>
        <SkipForward />
      </Button>
    </div>
  );
}
