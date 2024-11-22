"use client";

import { audioPlayerAtom, audioPlayerStateAtom } from "@/state";
import { type Track } from "@/state/player-machine";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { TrackDisplay, TrackDisplaySkeleton } from "./track-display";
import { Controls } from "./controls";
import { TrackProgress } from "./track-progress";

export function Player({ playlist: initialPlaylist }: { playlist: Track[] }) {
  const sendToMachine = useSetAtom(audioPlayerAtom);
  const { isPlaying, currentTrack, duration, currentTime, playlist } =
    useAtomValue(audioPlayerStateAtom);

  useEffect(() => {
    if (playlist.length === 0 && initialPlaylist.length > 0) {
      sendToMachine({ type: "LOAD_PLAYLIST", playlist: initialPlaylist });
    }
  }, [playlist, initialPlaylist, sendToMachine]);

  return (
    <div className="p-6 rounded-2xl bg-black/50 text-white space-y-6">
      {currentTrack ? (
        <TrackDisplay track={currentTrack} />
      ) : (
        <TrackDisplaySkeleton />
      )}
      <TrackProgress
        isPlaying={isPlaying}
        duration={duration}
        currentTime={currentTime}
      />
      <Controls
        isPlaying={isPlaying}
        play={() => sendToMachine({ type: "PLAY" })}
        pause={() => sendToMachine({ type: "PAUSE" })}
        next={() => sendToMachine({ type: "NEXT" })}
        previous={() => sendToMachine({ type: "PREVIOUS" })}
      />
    </div>
  );
}
