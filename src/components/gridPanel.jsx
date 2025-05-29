import { useEffect, useContext } from "react";
import instrumentsList from "../store/instruments";
import BeatPlayerContext from "../store/beatPlayerContext";
import "./gridPanel.css";

function GridPanel() {
  const beatPlayerCtx = useContext(BeatPlayerContext);

  useEffect(() => {
    const playNotes = () => {
      for (let i = 0; i < beatPlayerCtx.numberOfInstruments; i += 1) {
        if (
          beatPlayerCtx.currentGrid[i][beatPlayerCtx.activeBeat] === "selected"
        ) {
          new Audio(
            `${process.env.PUBLIC_URL}${instrumentsList[i].sound_file_path}`
          ).play();
        }
      }
    };

    if (beatPlayerCtx.isPlaying) {
      const beatLength = (60 * 1000) / beatPlayerCtx.bpm;
      const interval = setInterval(() => {
        beatPlayerCtx.changeGridCellBasedOnActiveBeat();
        playNotes();
        beatPlayerCtx.moveToNextBeat();
      }, beatLength);
      return () => clearInterval(interval);
    }
  }, [beatPlayerCtx, beatPlayerCtx.activeBeat, beatPlayerCtx.isPlaying, beatPlayerCtx.bpm]);

  return (
    <div
      className="grid-panel"
      style={{
        gridTemplateRows: `repeat(${beatPlayerCtx.numberOfInstruments}, 1fr)`,
        gridTemplateColumns: `repeat(${beatPlayerCtx.numberOfBeats}, 1fr)`,
      }}
    >
      {beatPlayerCtx.currentGrid.flatMap((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <button
            key={`${rowIdx}-${colIdx}`}
            className={`grid-cell ${cell}`}
            onClick={() =>
              beatPlayerCtx.toggleGridCellSelection(rowIdx, colIdx)
            }
          ></button>
        ))
      )}
    </div>
  );
}

export default GridPanel;
