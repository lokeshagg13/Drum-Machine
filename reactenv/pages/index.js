import MainPanel from "../components/main-panel";
import { BeatPlayerContextProvider } from "../store/beat-player-context";
import { ModalContextProvider } from "../store/modal-context";

export default function Home() {
  return (
    <ModalContextProvider>
      <BeatPlayerContextProvider>
        <MainPanel />
      </BeatPlayerContextProvider>
    </ModalContextProvider>
  );
}
