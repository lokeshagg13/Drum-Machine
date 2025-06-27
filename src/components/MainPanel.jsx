import { Fragment, useContext } from "react";

import ControlPanel from "./ControlPanel";
import GridPanel from "./GridPanel";
import InstrumentPanel from "./instruments/InstrumentPanel";
import ModalContext from "../store/modalContext";

import "./MainPanel.css";
import LoadBeatModal from "./modals/LoadBeatModal";
import SaveBeatModal from "./modals/SaveBeatModal";
import ClearConfirmationModal from "./modals/ClearConfirmationModal";
import BeatPlayer from "./BeatPlayer";

function MainPanel() {
  const modalCtx = useContext(ModalContext);

  return (
    <Fragment>
      <div className="main-panel">
        <div className="upper-panels">
          <InstrumentPanel />
          <GridPanel />
          <BeatPlayer />
        </div>
        <ControlPanel />
      </div>
      <div className="modals">
        {modalCtx.modalType && (
          <div className="backdrop" onClick={modalCtx.hideModals} />
        )}
        {modalCtx.modalType === "save" && <SaveBeatModal />}
        {modalCtx.modalType === "load" && <LoadBeatModal />}
        {modalCtx.modalType === "clear" && <ClearConfirmationModal />}
      </div>
    </Fragment>
  );
}

export default MainPanel;
