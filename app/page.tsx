import type { Track } from "@/state/player-machine";
import { Player } from "./_components/player";

const playlist = [
  {
    id: "1",
    src: "/lost-in-city-lights-145038.mp3",
    title: "Lost in the City Lights",
    artist: "Cosmo Sheldrake",
    image: "/cover-1.png",
  },
  {
    id: "2",
    src: "/forest-lullaby-110624.mp3",
    title: "Forest Lullaby",
    artist: "Lesfm",
    image: "/cover-2.png",
  },
] satisfies Track[];

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-[#3c3236] via-[#3c223d] to-[#20324c]">
      <Player playlist={playlist} />
    </div>
  );
}
