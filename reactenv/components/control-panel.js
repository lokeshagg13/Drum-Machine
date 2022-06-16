import { useContext } from "react";

import BeatPlayerContext from "../store/beat-player-context";
import constants from "../store/constants";
import ModalContext from "../store/modal-context";
import classes from "./control-panel.module.css";

function ControlPanel() {
  const modalCtx = useContext(ModalContext);
  const beatPlayerCtx = useContext(BeatPlayerContext);

  return (
    <div className={classes.controls}>
      <div className={classes.play}>
        <button
          type="button"
          id="play-pause-btn"
          onClick={() => beatPlayerCtx.togglePlay()}
        >
          {beatPlayerCtx.isPlaying ? "Pause" : "Play"}
        </button>
        <h5>{beatPlayerCtx.isPlaying ? "Playing" : "Paused"}</h5>
      </div>
      <div className={classes.bpm}>
        <div className={classes.display}>
          <div className={classes.label}>Beats per minute</div>
          <input
            type="text"
            value={beatPlayerCtx.bpm}
            className={classes.input}
            disabled
          />
        </div>
        <div className={classes.bpmControls}>
          <button
            type="button"
            id="bpm-increment-btn"
            disabled={beatPlayerCtx.bpm >= constants.MAX_BPM ? true : false}
            onClick={() => beatPlayerCtx.incrementBPM()}
          >
            + {constants.BPM_INCREMENT}
          </button>
          <button
            type="button"
            id="bpm-decrement-btn"
            disabled={beatPlayerCtx.bpm <= constants.MIN_BPM ? true : false}
            onClick={() => beatPlayerCtx.decrementBPM()}
          >
            - {constants.BPM_DECREMENT}
          </button>
        </div>
      </div>
      <div className={classes.beats}>
        <div className={classes.display}>
          <div className={classes.label}>Number of Beats</div>
          <input
            type="text"
            value={beatPlayerCtx.numberOfBeats}
            className={classes.input}
            disabled
          />
        </div>
        <div className={classes.beatControls}>
          <button
            type="button"
            id="beat-increment-btn"
            disabled={
              beatPlayerCtx.numberOfBeats >= constants.MAX_BEATS ? true : false
            }
            onClick={() => beatPlayerCtx.incrementBeats()}
          >
            + 1
          </button>
          <button
            type="button"
            id="beat-decrement-btn"
            disabled={
              beatPlayerCtx.numberOfBeats <= constants.MIN_BEATS ? true : false
            }
            onClick={() => beatPlayerCtx.decrementBeats()}
          >
            - 1
          </button>
        </div>
      </div>
      <div className={classes.saveLoad}>
        <button
          type="button"
          id="save-btn"
          onClick={() => modalCtx.showModal("save")}
        >
          Save Beat
        </button>
        <button type="button" id="load-btn">
          Load Beat
        </button>
      </div>
      <button
        type="button"
        id="clear-board"
        className={classes.clear}
        onClick={() => beatPlayerCtx.clearGrid()}
      >
        Clear Board
      </button>
    </div>
  );
}

export default ControlPanel;
