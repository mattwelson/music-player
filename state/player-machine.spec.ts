import { expect, it, vi, describe } from "vitest";
import { playerMachine, type Track } from "./player-machine";
import { createActor } from "xstate";

describe("playerMachine", () => {
  const mockTrack = {
    id: "1",
    src: "test.mp3",
    title: "Test Track",
    artist: "Test Artist",
    image: "test.jpg",
  } satisfies Track;

  global.Audio = vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    addEventListener: vi.fn(),
    currentTime: 0,
    duration: 0,
  }));

  it("should start in an idle state", () => {
    const actor = createActor(playerMachine).start();
    expect(actor.getSnapshot().value).toBe("idle");
  });

  it("should transition to loading state when playlist is loaded", () => {
    const actor = createActor(playerMachine).start();

    actor.send({
      type: "LOAD_PLAYLIST",
      playlist: [mockTrack],
    });

    expect(actor.getSnapshot().value).toBe("loading");
    expect(actor.getSnapshot().context.playlist).toEqual([mockTrack]);
  });

  it("should transition to ready.paused when audio is loaded", () => {
    const actor = createActor(playerMachine).start();

    actor.send({
      type: "LOAD_PLAYLIST",
      playlist: [mockTrack],
    });
    actor.send({ type: "LOADED" });

    expect(actor.getSnapshot().context.currentTrackIndex).toBe(0);
    expect(actor.getSnapshot().value).toEqual({ ready: "paused" });
  });

  it("should transition between playing and paused states", () => {
    const actor = createActor(playerMachine).start();

    // Setup initial state
    actor.send({ type: "LOAD_PLAYLIST", playlist: [mockTrack] });
    actor.send({ type: "LOADED" });

    // Test play
    actor.send({ type: "PLAY" });
    expect(actor.getSnapshot().value).toEqual({ ready: "playing" });

    // Test pause
    actor.send({ type: "PAUSE" });
    expect(actor.getSnapshot().value).toEqual({ ready: "paused" });
  });

  it("should handle track transitions", () => {
    const actor = createActor(playerMachine).start();
    const playlist = [
      mockTrack,
      { ...mockTrack, id: "2" },
      { ...mockTrack, id: "3" },
    ];

    actor.send({ type: "LOAD_PLAYLIST", playlist });
    actor.send({ type: "LOADED" });

    // Test next track
    actor.send({ type: "NEXT" });
    actor.send({ type: "LOADED" });

    expect(actor.getSnapshot().context.currentTrackIndex).toBe(1);

    // Test previous track
    actor.send({ type: "PREVIOUS" });
    actor.send({ type: "LOADED" });

    expect(actor.getSnapshot().context.currentTrackIndex).toBe(0);

    // Test select track
    actor.send({ type: "SELECT_TRACK", index: 2 });
    actor.send({ type: "LOADED" });

    expect(actor.getSnapshot().context.currentTrackIndex).toBe(2);
  });
});
