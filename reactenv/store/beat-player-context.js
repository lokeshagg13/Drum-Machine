import { createContext, useState } from "react";

import constants from "./constants";

const BeatPlayerContext = createContext({
  numberOfInstruments: 6,
  numberOfBeats: 8,
  bpm: 240,
  isPlaying: true,
  currentGrid: new Array(6).fill(new Array(8).fill("unselected")),
  activeInstruments: new Array(6).fill(true),
  activeBeat: 1,
  moveToNextBeat: () => {},
  toggleGridCellSelection: (rowIdx, colIdx) => {},
  changeGridCellBasedOnActiveBeat: () => {},
  togglePlay: () => {},
  clearGrid: () => {},
  incrementBPM: () => {},
  decrementBPM: () => {},
  incrementBeats: () => {},
  decrementBeats: () => {},
  // enableInstrument: (idx) => {},
  // disableInstrument: (idx) => {},
});

export function BeatPlayerContextProvider(props) {
  const [numberOfInstruments, setNumberOfInstruments] = useState(6);
  const [numberOfBeats, setNumberOfBeats] = useState(8);
  const [bpm, setBPM] = useState(240);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeBeat, setActiveBeat] = useState(1);
  const [activeInstruments, setActiveInstruments] = useState(() => {
    return new Array(numberOfInstruments).fill(true);
  });
  const [currentGrid, setCurrentGrid] = useState(() => {
    return new Array(numberOfInstruments).fill(
      new Array(numberOfBeats).fill("unselected")
    );
  });

  function moveToNextBeat() {
    if (activeBeat < numberOfBeats - 1) setActiveBeat(activeBeat + 1);
    else setActiveBeat(0);
  }

  function toggleGridCellSelection(rowIdx, colIdx) {
    setCurrentGrid((currentGrid) =>
      currentGrid.map((row, rIdx) => {
        if (rowIdx === rIdx) {
          return row.map((col, cIdx) => {
            if (colIdx === cIdx) {
              if (col === "selected") return "unselected";
              else if (col === "unselected") return "selected";
              else if (col === "playing") return "unselected";
              else if (col === "current") return "selected";
              else if (col === "disabled") return "disabled";
            } else return col;
          });
        } else return row;
      })
    );
  }

  function changeGridCellBasedOnActiveBeat() {
    setCurrentGrid((currentGrid) =>
      currentGrid.map((row) => {
        return row.map((col, cIdx) => {
          if (cIdx === activeBeat && col === "selected") return "playing";
          else if (cIdx === activeBeat && col === "unselected")
            return "current";
          else if (col === "playing") return "selected";
          else if (col === "current") return "unselected";
          else return col;
        });
      })
    );
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function incrementBPM() {
    if (bpm < constants.MAX_BPM) setBPM(bpm + constants.BPM_INCREMENT);
  }

  function decrementBPM() {
    if (bpm > constants.MIN_BPM) setBPM(bpm - constants.BPM_DECREMENT);
  }

  function incrementBeats() {
    if (numberOfBeats < constants.MAX_BEATS) {
      setNumberOfBeats(numberOfBeats + 1);
      setCurrentGrid((currentGrid) =>
        currentGrid.map((row) => {
          const rowDuplicate = JSON.parse(JSON.stringify(row));
          rowDuplicate.push("unselected");
          return rowDuplicate;
        })
      );
    }
  }

  function decrementBeats() {
    if (numberOfBeats > constants.MIN_BEATS) {
      setNumberOfBeats(numberOfBeats - 1);
      setCurrentGrid((currentGrid) =>
        currentGrid.map((row) => {
          const rowDuplicate = JSON.parse(JSON.stringify(row));
          rowDuplicate.pop();
          return rowDuplicate;
        })
      );
    }
  }

  function clearGrid() {
    setCurrentGrid((currentGrid) =>
      currentGrid.map((row) => {
        return row.map((col) => {
          if (col === "selected") return "unselected";
          else if (col === "playing") return "current";
          else return col;
        });
      })
    );
  }

  const currentBeatPlayerContext = {
    numberOfInstruments,
    numberOfBeats,
    bpm,
    isPlaying,
    currentGrid,
    activeInstruments,
    activeBeat,
    moveToNextBeat,
    toggleGridCellSelection,
    changeGridCellBasedOnActiveBeat,
    togglePlay,
    incrementBPM,
    decrementBPM,
    incrementBeats,
    decrementBeats,
    clearGrid,
  };

  return (
    <BeatPlayerContext.Provider value={currentBeatPlayerContext}>
      {props.children}
    </BeatPlayerContext.Provider>
  );
}

export default BeatPlayerContext;

// modals for save and load menu

// openSaveModal
// openLoadModal
// hideModals
