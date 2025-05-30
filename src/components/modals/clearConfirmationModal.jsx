import { useContext } from "react";
import ModalContext from "../../store/modalContext";
import BeatPlayerContext from "../../store/beatPlayerContext";

import "./clearConfirmationModal.css";

function ClearConfirmationModal() {
  const modalCtx = useContext(ModalContext);
  const beatPlayerCtx = useContext(BeatPlayerContext);

  const clearHandler = () => {
    beatPlayerCtx.clearGrid();
    modalCtx.hideModals();
  };

  return (
    <div className="modal clear-confirmation-modal">
      <div className="content">
        <div className="modal-header">
          <h3>Clear Beat Grid</h3>
          <button className="closeBtn" onClick={modalCtx.hideModals}>
            ✕
          </button>
        </div>
        <p>Are you sure you want to clear the beat grid?</p>
        <div className="actions">
          <button className="cancelBtn" onClick={modalCtx.hideModals}>
            Cancel
          </button>
          <button className="confirmBtn" onClick={clearHandler}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClearConfirmationModal;
