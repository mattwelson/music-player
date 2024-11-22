import { it, describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PlayPauseButton } from "./controls";

describe("PlayPauseButton", () => {
  it("Renders play button while paused", async () => {
    render(
      <PlayPauseButton isPlaying={false} pause={vi.fn()} play={vi.fn()} />
    );

    expect(await screen.findByTitle("play")).toBeInTheDocument();
  });

  it("Renders pause button while paused", async () => {
    render(<PlayPauseButton isPlaying={true} pause={vi.fn()} play={vi.fn()} />);

    expect(await screen.findByTitle("pause")).toBeInTheDocument();
  });

  it("Calls play function when PLAY is pushed", async () => {
    const play = vi.fn();
    const user = userEvent.setup();
    render(<PlayPauseButton isPlaying={false} pause={vi.fn()} play={play} />);

    await user.click(await screen.findByTitle("play"));

    expect(play).toHaveBeenCalledOnce();
  });

  it("Renders pause button while paused", async () => {
    const pause = vi.fn();
    const user = userEvent.setup();
    render(<PlayPauseButton isPlaying={true} pause={pause} play={vi.fn()} />);

    await user.click(await screen.findByTitle("pause"));

    expect(pause).toHaveBeenCalledOnce();
  });
});
