import { useState, useContext, useRef } from "react";
import ModalContext from "../../store/modalContext";
import BeatPlayerContext from "../../store/beatPlayerContext";
import Notification from "../ui/elements/notification";
import generateRandomBeat from "../../logic/beatRandomizer";

import "./loadBeatModal.css";
import Instrument from "../../logic/instruments";

function LoadBeatModal() {
  const fileInputRef = useRef();
  const modalCtx = useContext(ModalContext);
  const beatPlayerCtx = useContext(BeatPlayerContext);

  const [status, setStatus] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [fileName, setFileName] = useState("");

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  }

  // --- Get Random Beat From Beat Randomizer ---
  function getRandomBeat() {
    try {
      const { randomBPM, randomNumBeats, randomInstruments, randomBeatGrid } =
        generateRandomBeat();
      beatPlayerCtx.loadBeat(
        randomBPM,
        randomNumBeats,
        randomInstruments.length,
        randomInstruments,
        randomBeatGrid
      );
      modalCtx.hideModals();
    } catch (error) {
      setStatus("error");
      setRemarks("Failed to generate a random beat. Please try again.");
    }
  }

  // --- Load beat from file ---
  function loadBeatFromFile() {
    const file = fileInputRef.current.files[0];
    if (!file) {
      setStatus("error");
      setRemarks("Please select a beat file to load.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedBeat = JSON.parse(e.target.result);
        beatPlayerCtx.loadBeat(
          parsedBeat.bpm,
          parsedBeat.numberOfBeats,
          parsedBeat.numberOfInstruments,
          parsedBeat.instruments.map(({ id, name, active }) =>
            Instrument.load(id, name, active)
          ),
          parsedBeat.grid
        );
        modalCtx.hideModals();
      } catch (error) {
        setStatus("error");
        setRemarks("Failed to parse beat file.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="modal load-beat-modal">
      <div className="content">
        <div className="modal-header">
          <h3>Load a Beat</h3>
          <button className="closeBtn" onClick={modalCtx.hideModals}>
            ✕
          </button>
        </div>
        {/* --- Section 1: Random Beat Generator --- */}
        <div className="section">
          <h4>Try a Random Beat</h4>
          <p className="section-desc">
            Let us generate a fun beat for you to jam with. It’s totally random
            and often wild!
          </p>
          <div className="actions">
            <button className="confirmBtn" onClick={getRandomBeat}>
              Load Random Beat
            </button>
          </div>
        </div>
        <hr className="hor-line" />

        {/* --- Section 2: Upload a Beat File --- */}
        <div className="section">
          <h4>Upload Your Saved Beat</h4>
          <p className="section-desc">
            Choose a previously saved <code>.json</code> file to load your
            custom beat.
          </p>
          <div className="file-upload-wrapper">
            <label htmlFor="beat-file" className="file-upload-label">
              Choose Beat File
            </label>
            <input
              type="file"
              id="beat-file"
              accept="application/json"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {fileName && <div className="file-name">{fileName}</div>}
          </div>
          <div className="actions">
            <button className="cancelBtn" onClick={modalCtx.hideModals}>
              Cancel
            </button>
            <button className="confirmBtn" onClick={loadBeatFromFile}>
              Load
            </button>
          </div>
          {status && remarks && (
            <Notification type={status} message={remarks} />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoadBeatModal;
