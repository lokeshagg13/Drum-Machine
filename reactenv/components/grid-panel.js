import { useEffect, useRef, useState, useContext } from "react";
import instrumentsList from "../instruments.json";
import BeatPlayerContext from "../store/beat-player-context";
import classes from "./grid-panel.module.css";

function GridPanel() {
  const panelRef = useRef();
  const beatPlayerCtx = useContext(BeatPlayerContext);
  const [panelWidth, setPanelWidth] = useState(1277);
  const [panelHeight, setPanelHeight] = useState(571);
  const { numberOfInstruments, numberOfBeats, currentGrid } = beatPlayerCtx;

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
    setPanelWidth(panelRef.current.offsetWidth);
    setPanelHeight(panelRef.current.offsetHeight);
    if (beatPlayerCtx.playing) {
      const beatLength = (60 * 1000) / beatPlayerCtx.bpm;
      const interval = setInterval(() => {
        beatPlayerCtx.changeGridCellBasedOnActiveBeat()
        playNotes();
        beatPlayerCtx.moveToNextBeat();
      }, beatLength);
      return () => clearInterval(interval)
    }
  }, [beatPlayerCtx.activeBeat]);

  return (
    <div className={classes.panel} ref={panelRef}>
      {currentGrid.map((row, idx) => (
        <div key={idx} className={classes.row}>
          {row.map((col, jIdx) => (
            <div key={jIdx} className={classes.col}>
              <button
                className={`${classes.cell} ${getClassBasedOnGridType(col)}`}
                style={{
                  width: `${panelWidth / numberOfBeats - 1}px`,
                  height: `${panelHeight / numberOfInstruments - 2.5}px`,
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
