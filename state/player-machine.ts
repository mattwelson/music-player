import { assign, createActor, createMachine } from "xstate";

export interface Track {
  id: string;
  src: string;
  title: string;
  artist: string;
  image: string;
}

interface PlayerContext {
  audio: HTMLAudioElement | undefined;
  duration: number;
  currentTime: number;
  playlist: Track[];
  currentTrackIndex: number;
}

export type PlayerEvent =
  | { type: "LOAD_PLAYLIST"; playlist: Track[] }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "TRACK_ENDED" }
  | { type: "LOADED" }
  | { type: "TIME_UPDATE"; currentTime: number }
  | { type: "DURATION_CHANGE"; duration: number }
  | { type: "SELECT_TRACK"; index: number };

export const playerMachine = createMachine({
  types: {
    context: {} as PlayerContext,
    events: {} as PlayerEvent,
  },
  id: "audioPlayer",
  initial: "idle",
  context: {
    audio: undefined,
    duration: 0,
    currentTime: 0,
    currentTrackIndex: 0,
    playlist: [],
  } satisfies PlayerContext,
  states: {
    idle: {
      on: {
        LOAD_PLAYLIST: {
          target: "loading",
          actions: assign({
            playlist: ({ event }) => event.playlist,
            currentTrackIndex: 0,
          }),
        },
      },
    },
    loading: {
      entry: [
        assign({
          audio: ({ context, self }) => {
            const currentTrack = context.playlist[context.currentTrackIndex];
            if (!currentTrack) return undefined;

            if (context.audio) {
              context.audio.pause();
              context.audio.currentTime = 0;
            }

            console.log({ currentTrack });
            const audio = new Audio(currentTrack.src);

            // add event listeners
            audio.addEventListener("ended", () => {
              self.send({ type: "TRACK_ENDED" });
            });

            audio.addEventListener("loadeddata", () => {
              self.send({ type: "LOADED" });
            });

            audio.addEventListener("timeupdate", () => {
              self.send({
                type: "TIME_UPDATE",
                currentTime: audio.currentTime,
              });
            });

            audio.addEventListener("durationchange", () => {
              self.send({
                type: "DURATION_CHANGE",
                duration: audio.duration,
              });
            });

            return audio;
          },
        }),
      ],
      on: {
        LOADED: "ready",
        TIME_UPDATE: {
          actions: assign({
            currentTime: ({ event }) => event.currentTime,
          }),
        },
        DURATION_CHANGE: {
          actions: assign({
            duration: ({ event }) => event.duration,
          }),
        },
      },
    },
    ready: {
      initial: "paused",
      states: {
        playing: {
          entry: ({ context }) => context.audio?.play(),
          on: {
            PAUSE: "paused",
            TRACK_ENDED: {
              target: "#audioPlayer.trackTransition",
            },
            TIME_UPDATE: {
              actions: assign({
                currentTime: ({ event }) => event.currentTime,
              }),
            },
          },
        },
        paused: {
          entry: ({ context }) => context.audio?.pause(),
          on: {
            PLAY: "playing",
            TIME_UPDATE: {
              actions: assign({
                currentTime: ({ event }) => event.currentTime,
              }),
            },
          },
        },
      },
      on: {
        NEXT: "trackTransition",
        PREVIOUS: "trackTransition",
        SELECT_TRACK: {
          target: "trackTransition",
          actions: assign({
            currentTrackIndex: ({ event }) => event.index,
          }),
        },
      },
    },
    trackTransition: {
      entry: [
        assign({
          currentTrackIndex: ({ context, event }) => {
            if (event.type === "TRACK_ENDED" || event.type === "NEXT")
              return (context.currentTrackIndex + 1) % context.playlist.length;
            if (event.type === "PREVIOUS")
              return (
                (context.currentTrackIndex - 1 + context.playlist.length) %
                context.playlist.length
              );
            return context.currentTrackIndex;
          },
        }),
      ],
      always: "loading",
    },
  },
});

export const player = createActor(playerMachine);
