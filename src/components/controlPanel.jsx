import { useContext, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import BeatPlayerContext from "../store/beatPlayerContext";
import constants from "../store/constants";
import ModalContext from "../store/modalContext";

import "./controlPanel.css";
import PauseIcon from "./ui/icons/pauseIcon";
import PlayIcon from "./ui/icons/playIcon";
import ClearIcon from "./ui/icons/clearIcon";
import SaveIcon from "./ui/icons/saveIcon";
import LoadIcon from "./ui/icons/loadIcon";
import InfoIcon from "./ui/icons/infoIcon";

function ControlPanel() {
  const modalCtx = useContext(ModalContext);
  const beatPlayerCtx = useContext(BeatPlayerContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (beatPlayerCtx.beatPlayerStatus === "running") {
        // For changing BPM
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
          if (e.key === "+" || e.key === "=") {
            // Some keyboards require '=' key for '+'
            e.preventDefault();
            if (beatPlayerCtx.bpm < constants.MAX_BPM) {
              beatPlayerCtx.incrementBPM();
            }
          } else if (e.key === "_" || e.key === "-") {
            // Shift + '-' gives '_'
            e.preventDefault();
            if (beatPlayerCtx.bpm > constants.MIN_BPM) {
              beatPlayerCtx.decrementBPM();
            }
          }
        }
        // For changing number of beats
        if ((e.ctrlKey || e.metaKey) && e.altKey) {
          if (e.key === "+" || e.key === "=") {
            e.preventDefault();
            if (beatPlayerCtx.numberOfBeats < constants.MAX_BEATS) {
              beatPlayerCtx.incrementBeats();
            }
          } else if (e.key === "_" || e.key === "–" || e.key === "-") {
            // Shift + '-' gives '_'
            e.preventDefault();
            if (beatPlayerCtx.numberOfBeats > constants.MIN_BEATS) {
              beatPlayerCtx.decrementBeats();
            }
          }
        }
        // For pausing the beat player
        if (e.code === "Space") {
          e.preventDefault();
          beatPlayerCtx.handlePauseBeatPlayer();
        }
      } else if (beatPlayerCtx.beatPlayerStatus === "paused") {
        // For resuming the beat player
        if (e.code === "Space") {
          e.preventDefault();
          beatPlayerCtx.handleResumeBeatPlayer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [beatPlayerCtx, beatPlayerCtx.bpm]);

  return (
    <div className="control-panel">
      <div className="controls-inner">
        <div className="inputs">
          {/* BPM Input */}
          <div className="input-group">
            <div className="input-label">
              <span>Beats Per Minute</span>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="bpm-tooltip">
                    <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>+/-</kbd>
                  </Tooltip>
                }
              >
                <span className="icon cursor-pointer ms-2 text-muted">
                  <InfoIcon />
                </span>
              </OverlayTrigger>
            </div>
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
            <div className="input-label">
              <span>Number of Beats</span>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="beats-tooltip">
                    <kbd>Ctrl/Cmd</kbd> + <kbd>Alt/Opt</kbd> + <kbd>+/-</kbd>
                  </Tooltip>
                }
              >
                <span className="icon cursor-pointer ms-2 text-muted">
                  <InfoIcon />
                </span>
              </OverlayTrigger>
            </div>

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
          <button
            onClick={
              beatPlayerCtx.beatPlayerStatus === "running"
                ? () => beatPlayerCtx.pauseBeatPlayer()
                : beatPlayerCtx.beatPlayerStatus === "paused"
                ? () => beatPlayerCtx.resumeBeatPlayer()
                : () => {}
            }
          >
            {beatPlayerCtx.beatPlayerStatus === "running" ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
            <span className="button-text">
              {beatPlayerCtx.beatPlayerStatus === "running" ? "Pause" : "Play"}
            </span>
          </button>
          {beatPlayerCtx.isBeatGridEmpty(true) ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="clear-tooltip">Nothing to clear</Tooltip>}
              delay={{ show: 250, hide: 100 }}
            >
              <button onClick={() => {}} className="disabled-tooltip-btn">
                <ClearIcon />
                <span className="button-text">Clear</span>
              </button>
            </OverlayTrigger>
          ) : (
            <button onClick={() => modalCtx.showModal("clear")}>
              <ClearIcon />
              <span className="button-text">Clear</span>
            </button>
          )}
          {beatPlayerCtx.isBeatGridEmpty(false) ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="save-tooltip">Nothing to save</Tooltip>}
              delay={{ show: 250, hide: 100 }}
            >
              <button onClick={() => {}}>
                <SaveIcon />
                <span className="button-text">Save</span>
              </button>
            </OverlayTrigger>
          ) : (
            <button onClick={() => modalCtx.showModal("save")}>
              <SaveIcon />
              <span className="button-text">Save</span>
            </button>
          )}
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
