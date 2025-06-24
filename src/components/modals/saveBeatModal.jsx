import { useState, useContext, useRef } from "react";
import ModalContext from "../../store/modalContext";
import BeatPlayerContext from "../../store/beatPlayerContext";
import Notification from "../ui/elements/notification";

import "./saveBeatModal.css";

function SaveBeatModal() {
  const nameInputRef = useRef();
  const modalCtx = useContext(ModalContext);
  const beatPlayerCtx = useContext(BeatPlayerContext);
  const [status, setStatus] = useState(null);
  const [remarks, setRemarks] = useState(null);

  function saveBeatHandler() {
    const beatName = nameInputRef.current.value.trim();
    if (!beatName || beatName === "") {
      setStatus("error");
      setRemarks("Please enter a valid name for your beat");
      return;
    }

    if (beatPlayerCtx.isBeatGridEmpty(false)) {
      setStatus("error");
      setRemarks("No beat found. Please create a beat first.");
      return;
    }

    setStatus("pending");
    setRemarks("Preparing your beat file...");

    try {
      const beatData = {
        name: beatName,
        bpm: beatPlayerCtx.bpm,
        numberOfBeats: beatPlayerCtx.numberOfBeats,
        numberOfInstruments: beatPlayerCtx.numberOfInstruments,
        instruments: beatPlayerCtx.instruments,
        grid: beatPlayerCtx.gridRef.current,
      };
      const jsonBlob = new Blob([JSON.stringify(beatData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(jsonBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${beatName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      nameInputRef.current.value = "";
      setStatus("success");
      setRemarks(`Your beat has been saved as ${beatName}.json`);
    } catch (error) {
      setStatus("error");
      setRemarks(`Error: ${error.message}`);
    }
  }

  return (
    <div className="modal save-beat-modal">
      <div className="content">
        <div className="modal-header">
          <h3>Save Beat</h3>
          <button className="closeBtn" onClick={modalCtx.hideModals}>
            ✕
          </button>
        </div>
        <div className="control">
          <label htmlFor="beat-name">Beat Name</label>
          <input
            type="text"
            id="beat-name"
            placeholder="e.g. my_first_beat"
            ref={nameInputRef}
          />
        </div>
        {status && remarks && <Notification type={status} message={remarks} />}
        <div className="actions">
          <button className="cancelBtn" onClick={modalCtx.hideModals}>
            Cancel
          </button>
          <button className="confirmBtn" onClick={saveBeatHandler}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveBeatModal;
