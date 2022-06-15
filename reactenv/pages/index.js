import MainPanel from "../components/main-panel";
import { BeatPlayerContextProvider } from "../store/beat-player-context";

export default function Home() {
  return (
    <BeatPlayerContextProvider>
      <MainPanel />
    </BeatPlayerContextProvider>
  );
}
