import { useContext } from "react";
import BeatPlayerContext from "../store/beatPlayerContext";
import "./GridPanel.css";
import appConfig from "../logic/config";

function GridPanel() {
  const beatPlayerCtx = useContext(BeatPlayerContext);

  function getClassNameForCell(value) {
    for (const [key, val] of Object.entries(appConfig.CELL)) {
      if (val === value) {
        return key.toLowerCase();
      }
    }
    return null;
  }

  return (
    <div
      className="grid-panel"
      style={{
        gridTemplateRows: `repeat(${beatPlayerCtx.numberOfInstruments}, 1fr)`,
        gridTemplateColumns: `repeat(${beatPlayerCtx.numberOfBeats}, 1fr)`,
      }}
    >
      {beatPlayerCtx.gridState.flatMap((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <button
            key={`${rowIdx}-${colIdx}`}
            className={`grid-cell ${getClassNameForCell(cell)}`}
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
