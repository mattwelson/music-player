import { atom } from "jotai";
import { atomWithMachine } from "jotai-xstate";
import { playerMachine, type Track } from "./player-machine";

export const audioPlayerAtom = atomWithMachine(playerMachine);
export const audioPlayerStateAtom = atom((get) => {
  const state = get(audioPlayerAtom);
  return {
    isPlaying: state.matches("ready.playing"),
    currentTrack: state.context.playlist[state.context.currentTrackIndex] as
      | Track
      | undefined,
    currentTime: state.context.currentTime,
    duration: state.context.duration,
    currentTrackIndex: state.context.currentTrackIndex,
    playlist: state.context.playlist,
  };
});
