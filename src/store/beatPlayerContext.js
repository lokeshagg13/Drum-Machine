import { createContext, useRef, useState } from "react";

import constants from "./constants";
import Instrument from "../logic/instruments.js";

const BeatPlayerContext = createContext({
  beatPlayerStatus: null,
  numberOfInstruments: 0,
  numberOfBeats: 0,
  bpm: 0,
  instruments: [],
  activeBeatRef: 1,
  gridRef: [],
  gridState: [],
  startBeatPlayer: () => { },
  pauseBeatPlayer: () => { },
  resumeBeatPlayer: () => { },
  incrementBeats: () => { },
  decrementBeats: () => { },
  incrementBPM: () => { },
  decrementBPM: () => { },
  enableInstrument: (id) => { },
  disableInstrument: (id) => { },
  clearGrid: () => { },
  isBeatGridEmpty: (considerDisabled) => { },
  toggleGridCellSelection: (rowIdx, colIdx) => { },
  updateGridBasedOnActiveBeat: () => { },
  playActiveBeat: () => { },
  moveToNextBeat: () => { },
  loadBeat: (bpm, numberOfBeats, numberOfInstruments, instruments, grid) => { }
});

export function BeatPlayerContextProvider(props) {
  const [beatPlayerStatus, setBeatPlayerStatus] = useState(null);
  const [numberOfInstruments, setNumberOfInstruments] = useState(constants.INSTRUMENTS.length);
  const [numberOfBeats, setNumberOfBeats] = useState(constants.DEFAULT_BEATS);
  const [bpm, setBPM] = useState(constants.DEFAULT_BPM);
  const [instruments, setInstruments] = useState(() => {
    return constants.INSTRUMENTS.map((instrumentName, index) => new Instrument(index, instrumentName));
  });
  const [gridState, setGridState] = useState(() => {
    return new Array(numberOfInstruments).fill(
      new Array(numberOfBeats).fill(constants.CELL.UNSELECTED)
    );
  });

  const activeBeatRef = useRef(1);
  const gridRef = useRef(new Array(numberOfInstruments).fill(
    new Array(numberOfBeats).fill(constants.CELL.UNSELECTED)
  ));

  function startBeatPlayer() {
    setBeatPlayerStatus("running");
  }

  function pauseBeatPlayer() {
    setBeatPlayerStatus("paused");
  }

  function resumeBeatPlayer() {
    setBeatPlayerStatus("running");
  }

  function updateGrid(newGrid) {
    gridRef.current = newGrid;
    setGridState(newGrid);
  }

  function incrementBeats() {
    if (numberOfBeats < constants.MAX_BEATS) {
      setNumberOfBeats(numberOfBeats + 1);
      const currentGrid = gridRef.current;
      const newGrid = currentGrid.map((row) => {
        const rowDuplicate = JSON.parse(JSON.stringify(row));
        rowDuplicate.push(constants.CELL.UNSELECTED);
        return rowDuplicate;
      });
      updateGrid(newGrid);
    }
  }

  function decrementBeats() {
    if (numberOfBeats > constants.MIN_BEATS) {
      setNumberOfBeats(numberOfBeats - 1);
      const currentGrid = gridRef.current;
      const newGrid = currentGrid.map((row) => {
        const rowDuplicate = JSON.parse(JSON.stringify(row));
        rowDuplicate.pop();
        return rowDuplicate;
      });
      updateGrid(newGrid);
    }
  }

  function incrementBPM() {
    if (bpm < constants.MAX_BPM) setBPM(bpm + constants.BPM_INCREMENT);
  }

  function decrementBPM() {
    if (bpm > constants.MIN_BPM) setBPM(bpm - constants.BPM_DECREMENT);
  }

  function enableInstrument(id) {
    setInstruments((instruments) =>
      instruments.map((instrument) => {
        if (instrument.id === id) instrument.active = true;
        return instrument;
      })
    );

    const currentGrid = gridRef.current;
    const newGrid = currentGrid.map((row, rIdx) => {
      if (id === rIdx) {
        return row.map((col) => {
          if (col === constants.CELL.DISABLED) return constants.CELL.SELECTED;
          else return col;
        });
      } else return row;
    });
    updateGrid(newGrid);
  }

  function disableInstrument(id) {
    setInstruments((instruments) =>
      instruments.map((instrument) => {
        if (instrument.id === id) instrument.active = false;
        return instrument;
      })
    );

    const currentGrid = gridRef.current;
    const newGrid = currentGrid.map((row, rIdx) => {
      if (id === rIdx) {
        return row.map((col) => {
          if (col === constants.CELL.SELECTED || col === constants.CELL.PLAYING) return constants.CELL.DISABLED;
          else return col;
        });
      } else return row;
    });
    updateGrid(newGrid);
  }

  function clearGrid() {
    updateGrid(new Array(numberOfInstruments).fill(
      new Array(numberOfBeats).fill(constants.CELL.UNSELECTED)
    ));
    activeBeatRef.current = 1;
  }

  function isBeatGridEmpty(considerDisabled = false) {
    const currentGrid = gridRef.current;
    for (let i = 0; i < currentGrid.length; i++) {
      for (let j = 0; j < currentGrid[0].length; j++) {
        if (currentGrid[i][j] === constants.CELL.SELECTED || currentGrid[i][j] === constants.CELL.PLAYING) {
          return false;
        }
        if (considerDisabled && currentGrid[i][j] === constants.CELL.DISABLED) {
          return false;
        }
      }
    }
    return true;
  }

  function toggleGridCellSelection(rowIdx, colIdx) {
    const currentGrid = gridRef.current;
    const newGrid = currentGrid.map((row, rIdx) => {
      if (rowIdx !== rIdx) return row;
      return row.map((col, cIdx) => {
        if (colIdx !== cIdx) return col;
        if (instruments[rowIdx].active === false) return constants.CELL.DISABLED;
        else if (col === constants.CELL.SELECTED) return constants.CELL.UNSELECTED;
        else if (col === constants.CELL.UNSELECTED) return constants.CELL.SELECTED;
        else if (col === constants.CELL.PLAYING) return constants.CELL.UNSELECTED;
        else if (col === constants.CELL.CURRENT) return constants.CELL.SELECTED;
        else if (col === constants.CELL.DISABLED) return constants.CELL.DISABLED;
        else return constants.CELL.DISABLED;
      });
    });
    updateGrid(newGrid);
  }

  function updateGridBasedOnActiveBeat() {
    const currentGrid = gridRef.current;
    const newGrid = currentGrid.map(
      (row) => {
        return row.map(
          (col, cIdx) => {
            switch (col) {
              case constants.CELL.SELECTED:
                return cIdx === activeBeatRef.current - 1 ?
                  constants.CELL.PLAYING :
                  col;
              case constants.CELL.UNSELECTED:
                return cIdx === activeBeatRef.current - 1 ?
                  constants.CELL.CURRENT :
                  col;
              case constants.CELL.PLAYING:
                return constants.CELL.SELECTED;
              case constants.CELL.CURRENT:
                return constants.CELL.UNSELECTED;
              default: return col;
            }
          }
        );
      }
    );
    updateGrid(newGrid);
  }

  function playActiveBeat() {
    const currentGrid = gridRef.current;
    currentGrid.forEach((row, instrumentIdx) => {
      if (instruments[instrumentIdx]?.active) {
        if (row[activeBeatRef.current - 1] === constants.CELL.PLAYING) {
          instruments[instrumentIdx].playSound();
        }
      }
    });
  }

  function moveToNextBeat() {
    const currentBeat = activeBeatRef.current;
    activeBeatRef.current = (currentBeat < numberOfBeats) ?
      currentBeat + 1 :
      1;
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
    updateGrid(grid);
  }

  const currentBeatPlayerContext = {
    beatPlayerStatus,
    numberOfInstruments,
    numberOfBeats,
    bpm,
    instruments,
    gridRef,
    gridState,
    startBeatPlayer,
    pauseBeatPlayer,
    resumeBeatPlayer,
    incrementBeats,
    decrementBeats,
    incrementBPM,
    decrementBPM,
    enableInstrument,
    disableInstrument,
    clearGrid,
    isBeatGridEmpty,
    toggleGridCellSelection,
    updateGridBasedOnActiveBeat,
    playActiveBeat,
    moveToNextBeat,
    loadBeat
  };

  return (
    <BeatPlayerContext.Provider value={currentBeatPlayerContext}>
      {props.children}
    </BeatPlayerContext.Provider>
  );
}

export default BeatPlayerContext;