import { Fragment, useContext } from "react";

import ControlPanel from "./control-panel";
import GridPanel from "./grid-panel";
import InstrumentPanel from "./instrument-panel";
import ModalContext from "../store/modal-context";
import SaveBeatModal from "./modals/save-beat-modals";

import classes from "./main-panel.module.css";

function MainPanel() {
  const modalCtx = useContext(ModalContext);

  return (
    <Fragment>
      <div className={classes.main}>
        <div className={classes.actions}>
          <InstrumentPanel />
          <GridPanel />
        </div>
        <ControlPanel />
      </div>
      <div className={classes.modals}>
        {modalCtx.modalType && (
          <div className={classes.backdrop} onClick={modalCtx.hideModals} />
        )}
        {modalCtx.modalType === "save" && <SaveBeatModal />}
      </div>
    </Fragment>
  );
}

export default MainPanel;
