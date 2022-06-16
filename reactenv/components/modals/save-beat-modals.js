import { useState, useContext, useRef } from "react";
import Modal from "../ui/elements/modal-template";
import ModalContext from "../../store/modal-context";
import BeatPlayerContext from "../../store/beat-player-context";
import Notification from "../ui/elements/notification";

import classes from "./save-beat-modal.module.css";

function SaveBeatModal() {
  const nameInputRef = useRef();
  const modalCtx = useContext(ModalContext);
  const beatPlayerCtx = useContext(BeatPlayerContext);
  const [status, setStatus] = useState(null);
  const [remarks, setRemarks] = useState(null);

  async function saveBeatHandler() {
    const beatName = nameInputRef.current.value;
    setStatus("pending");
    setRemarks("Saving the beat");
    const saveResponse = await fetch("/api/beats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: beatName,
        bpm: beatPlayerCtx.bpm,
        numberOfBeats: beatPlayerCtx.numberOfBeats,
        numberOfInstruments: beatPlayerCtx.numberOfInstruments,
        instruments: beatPlayerCtx.instruments,
        currentGrid: beatPlayerCtx.currentGrid,
      }),
    });
    const saveResponseBody = await saveResponse.json();
    if (!saveResponse.ok) {
      setStatus("error");
      setRemarks(saveResponseBody.message);
      return;
    }
    setStatus("success");
    setRemarks(saveResponseBody.message);
  }

  return (
    <Modal
      purpose="confirmation"
      type="save"
      onCancel={modalCtx.hideModals}
      onConfirm={saveBeatHandler}
    >
      <h3>Save the Beat</h3>
      <div className={classes.control}>
        <label htmlFor="beat-name">Beat Name</label>
        <input type="text" id="beat-name" ref={nameInputRef} />
      </div>
      {status && remarks && <Notification type={status} message={remarks} />}
    </Modal>
  );
}

export default SaveBeatModal;
