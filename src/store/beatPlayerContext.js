import { createContext, useState } from "react";

import constants from "./constants";
import instrumentsList from "./instruments.js";

const BeatPlayerContext = createContext({
  numberOfInstruments: 6,
  numberOfBeats: 8,
  bpm: 240,
  isPlaying: true,
  currentGrid: new Array(6).fill(new Array(8).fill("unselected")),
  instruments: null,
  activeBeat: 1,
  moveToNextBeat: () => { },
  toggleGridCellSelection: (rowIdx, colIdx) => { },
  changeGridCellBasedOnActiveBeat: () => { },
  togglePlay: () => { },
  clearGrid: () => { },
  isBeatGridEmpty: (considerDisabled) => { },
  incrementBPM: () => { },
  decrementBPM: () => { },
  incrementBeats: () => { },
  decrementBeats: () => { },
  enableInstrument: (id) => { },
  disableInstrument: (id) => { },
  loadBeat: (bpm, numberOfBeats, numberOfInstruments, instruments, grid) => { },
});

export function BeatPlayerContextProvider(props) {
  const [numberOfInstruments, setNumberOfInstruments] = useState(6);
  const [numberOfBeats, setNumberOfBeats] = useState(8);
  const [bpm, setBPM] = useState(240);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeBeat, setActiveBeat] = useState(1);
  const [instruments, setInstruments] = useState(() => {
    return instrumentsList.map((instrument) => ({
      id: instrument.instrument_id,
      name: instrument.instrument_name,
      active: true,
    }));
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
          // eslint-disable-next-line
          return row.map((col, cIdx) => {
            if (colIdx === cIdx) {
              if (instruments[rowIdx].active === false) return "disabled";
              else if (col === "selected") return "unselected";
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

  function disableInstrument(id) {
    setInstruments((instruments) =>
      instruments.map((instrument) => {
        if (instrument.id === id) instrument.active = false;
        return instrument;
      })
    );

    setCurrentGrid((currentGrid) =>
      currentGrid.map((row, rIdx) => {
        if (id - 1 === rIdx) {
          return row.map((col) => {
            if (col === "selected" || col === "playing") return "disabled";
            else return col;
          });
        } else return row;
      })
    );
  }

  function enableInstrument(id) {
    setInstruments((instruments) =>
      instruments.map((instrument) => {
        if (instrument.id === id) instrument.active = true;
        return instrument;
      })
    );

    setCurrentGrid((currentGrid) =>
      currentGrid.map((row, rIdx) => {
        if (id - 1 === rIdx) {
          return row.map((col) => {
            if (col === "disabled") return "selected";
            else return col;
          });
        } else return row;
      })
    );
  }

  function clearGrid() {
    setCurrentGrid((currentGrid) =>
      currentGrid.map((row) => {
        return row.map((col) => {
          if (col === "selected") return "unselected";
          else if (col === "playing") return "current";
          else if (col === "disabled") return "unselected";
          else return col;
        });
      })
    );
  }

  function isBeatGridEmpty(considerDisabled = false) {
    for (let i = 0; i < currentGrid.length; i++) {
      for (let j = 0; j < currentGrid[0].length; j++) {
        if (currentGrid[i][j] === "selected" || currentGrid[i][j] === "playing") {
          return false;
        }
        if (considerDisabled && currentGrid[i][j] === "disabled") {
          return false;
        }
      }
    }
    return true;
  }

  function loadBeat(
    bpm,
    numberOfBeats,
    numberOfInstruments,
    instruments,
    grid
  ) {
    setBPM(bpm);
    setNumberOfBeats(numberOfBeats);
    setNumberOfInstruments(numberOfInstruments);
    setInstruments(instruments);
    setCurrentGrid(grid);
    setIsPlaying(true);
    setActiveBeat(1);
  }

  const currentBeatPlayerContext = {
    numberOfInstruments,
    numberOfBeats,
    bpm,
    isPlaying,
    currentGrid,
    instruments,
    activeBeat,
    moveToNextBeat,
    toggleGridCellSelection,
    changeGridCellBasedOnActiveBeat,
    togglePlay,
    incrementBPM,
    decrementBPM,
    incrementBeats,
    decrementBeats,
    enableInstrument,
    disableInstrument,
    clearGrid,
    isBeatGridEmpty,
    loadBeat,
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
