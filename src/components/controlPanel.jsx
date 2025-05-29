import { useContext } from "react";

import BeatPlayerContext from "../store/beatPlayerContext";
import constants from "../store/constants";
import ModalContext from "../store/modalContext";

import "./controlPanel.css";
import PauseIcon from "./ui/icons/pauseIcon";
import PlayIcon from "./ui/icons/playIcon";
import ClearIcon from "./ui/icons/clearIcon";
import SaveIcon from "./ui/icons/saveIcon";
import LoadIcon from "./ui/icons/loadIcon";

function ControlPanel() {
  const modalCtx = useContext(ModalContext);
  const beatPlayerCtx = useContext(BeatPlayerContext);

  return (
    <div className="controls">
      <div className="controls-inner">
        <div className="inputs">
          {/* BPM Input */}
          <div className="input-group">
            <div className="input-label">Beats Per Minute</div>
            <div className="input-wrapper">
              <button
                className="decrement"
                onClick={() => beatPlayerCtx.decrementBPM()}
                disabled={beatPlayerCtx.bpm <= constants.MIN_BPM}
              >
                –
              </button>
              <input type="text" value={beatPlayerCtx.bpm} readOnly />
              <button
                className="increment"
                onClick={() => beatPlayerCtx.incrementBPM()}
                disabled={beatPlayerCtx.bpm >= constants.MAX_BPM}
              >
                +
              </button>
            </div>
          </div>

          {/* Beats Input */}
          <div className="input-group">
            <div className="input-label">Number of Beats</div>
            <div className="input-wrapper">
              <button
                className="decrement"
                onClick={() => beatPlayerCtx.decrementBeats()}
                disabled={beatPlayerCtx.numberOfBeats <= constants.MIN_BEATS}
              >
                –
              </button>
              <input type="text" value={beatPlayerCtx.numberOfBeats} readOnly />
              <button
                className="increment"
                onClick={() => beatPlayerCtx.incrementBeats()}
                disabled={beatPlayerCtx.numberOfBeats >= constants.MAX_BEATS}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Button Grid */}
        <div className="button-grid">
          <button onClick={() => beatPlayerCtx.togglePlay()}>
            {beatPlayerCtx.isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span className="button-text">
              {beatPlayerCtx.isPlaying ? "Pause" : "Play"}
            </span>
          </button>
          <button onClick={() => beatPlayerCtx.clearGrid()}>
            <ClearIcon />
            <span className="button-text">Clear</span>
          </button>
          <button onClick={() => modalCtx.showModal("save")}>
            <SaveIcon />
            <span className="button-text">Save</span>
          </button>
          <button onClick={() => modalCtx.showModal("load")}>
            <LoadIcon />
            <span className="button-text">Load</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
