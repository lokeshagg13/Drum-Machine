import { useEffect, useRef, useState, useContext } from "react";
import instrumentsList from "../instruments.json";
import BeatPlayerContext from "../store/beat-player-context";
import classes from "./grid-panel.module.css";

function GridPanel() {
  const panelRef = useRef();
  const beatPlayerCtx = useContext(BeatPlayerContext);

  function getClassBasedOnGridType(gridType) {
    switch (gridType) {
      case "disabled":
        return classes.disabled;
      case "selected":
        return classes.selected;
      case "unselected":
        return classes.unselected;
      case "playing":
        return classes.playing;
      case "current":
        return classes.current;
      default:
        return classes.unselected;
    }
  }

  function playNotes() {
    for (let i = 0; i < beatPlayerCtx.numberOfInstruments; i += 1) {
      if (
        beatPlayerCtx.currentGrid[i][beatPlayerCtx.activeBeat] === "selected"
      ) {
        new Audio(instrumentsList[i].sound_file_path).play();
      }
    }
  }

  useEffect(() => {
    if (beatPlayerCtx.isPlaying) {
      const beatLength = (60 * 1000) / beatPlayerCtx.bpm;
      const interval = setInterval(() => {
        beatPlayerCtx.changeGridCellBasedOnActiveBeat();
        playNotes();
        beatPlayerCtx.moveToNextBeat();
      }, beatLength);
      return () => clearInterval(interval);
    }
  }, [beatPlayerCtx.activeBeat, beatPlayerCtx.isPlaying, beatPlayerCtx.bpm]);

  const panelWidth = panelRef.current ? panelRef.current.offsetWidth : 0;
  const panelHeight = panelRef.current ? panelRef.current.offsetHeight : 0;
  return (
    <div className={classes.panel} ref={panelRef}>
      {beatPlayerCtx.currentGrid.map((row, idx) => (
        <div key={idx} className={classes.row}>
          {row.map((col, jIdx) => (
            <div key={jIdx} className={classes.col}>
              <button
                className={`${classes.cell} ${getClassBasedOnGridType(col)}`}
                style={{
                  width: `${panelWidth / beatPlayerCtx.numberOfBeats - 1}px`,
                  height: `${
                    panelHeight / beatPlayerCtx.numberOfInstruments - 2.5
                  }px`,
                }}
                onClick={() => beatPlayerCtx.toggleGridCellSelection(idx, jIdx)}
              ></button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GridPanel;
