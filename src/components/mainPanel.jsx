import { Fragment, useContext } from "react";

import ControlPanel from "./controlPanel";
import GridPanel from "./gridPanel";
import InstrumentPanel from "./instruments/instrumentPanel";
import ModalContext from "../store/modalContext";

import "./mainPanel.css";
import LoadBeatModal from "./modals/loadBeatModal";
import SaveBeatModal from "./modals/saveBeatModal"

function MainPanel() {
  const modalCtx = useContext(ModalContext);

  return (
    <Fragment>
      <div className="main">
        <div className="actions">
          <InstrumentPanel />
          <GridPanel />
        </div>
        <ControlPanel />
      </div>
      <div className="modals">
        {modalCtx.modalType && (
          <div className="backdrop" onClick={modalCtx.hideModals} />
        )}
        {modalCtx.modalType === "save" && <SaveBeatModal />}
        {modalCtx.modalType === "load" && <LoadBeatModal />}
      </div>
    </Fragment>
  );
}

export default MainPanel;
