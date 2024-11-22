import { Skeleton } from "@/components/ui/skeleton";
import type { Track } from "@/state/player-machine";
import Image from "next/image";

export function TrackDisplay({ track }: { track: Track }) {
  return (
    <div className="relative flex flex-col items-center ">
      <Image
        src={track.image}
        alt=""
        width={300}
        height={300}
        className="rounded-xl"
      />
      <h2 className="truncate text-lg mt-2 font-bold">{track.title}</h2>
      <h3 className=" text-sm text-muted-foreground">{track.artist}</h3>
    </div>
  );
}
export function TrackDisplaySkeleton() {
  return (
    <div className="relative flex flex-col items-center opacity-20">
      <Skeleton className="size-[300px] rounded-xl" />
      <Skeleton className="h-6 mt-2 w-44"></Skeleton>
      <Skeleton className="h-4 mt-2 w-28"></Skeleton>
    </div>
  );
}
