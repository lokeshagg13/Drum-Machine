import { createContext, useRef, useState } from "react";

import appConfig from "../logic/config.js";
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
  const [numberOfInstruments, setNumberOfInstruments] = useState(appConfig.INSTRUMENTS.length);
  const [numberOfBeats, setNumberOfBeats] = useState(appConfig.DEFAULT_BEATS);
  const [bpm, setBPM] = useState(appConfig.DEFAULT_BPM);
  const [instruments, setInstruments] = useState(() => {
    return appConfig.INSTRUMENTS.map((instrumentName, index) => new Instrument(index, instrumentName));
  });
  const [gridState, setGridState] = useState(() => {
    return new Array(numberOfInstruments).fill(
      new Array(numberOfBeats).fill(appConfig.CELL.UNSELECTED)
    );
  });

  const activeBeatRef = useRef(1);
  const gridRef = useRef(new Array(numberOfInstruments).fill(
    new Array(numberOfBeats).fill(appConfig.CELL.UNSELECTED)
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
    if (numberOfBeats < appConfig.MAX_BEATS) {
      setNumberOfBeats(numberOfBeats + 1);
      const currentGrid = gridRef.current;
      const newGrid = currentGrid.map((row) => {
        const rowDuplicate = JSON.parse(JSON.stringify(row));
        rowDuplicate.push(appConfig.CELL.UNSELECTED);
        return rowDuplicate;
      });
      updateGrid(newGrid);
    }
  }

  function decrementBeats() {
    if (numberOfBeats > appConfig.MIN_BEATS) {
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
    if (bpm < appConfig.MAX_BPM) setBPM(bpm + appConfig.BPM_INCREMENT);
  }

  function decrementBPM() {
    if (bpm > appConfig.MIN_BPM) setBPM(bpm - appConfig.BPM_DECREMENT);
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
          if (col === appConfig.CELL.DISABLED) return appConfig.CELL.SELECTED;
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
          if (col === appConfig.CELL.SELECTED || col === appConfig.CELL.PLAYING) return appConfig.CELL.DISABLED;
          else return col;
        });
      } else return row;
    });
    updateGrid(newGrid);
  }

  function clearGrid() {
    updateGrid(new Array(numberOfInstruments).fill(
      new Array(numberOfBeats).fill(appConfig.CELL.UNSELECTED)
    ));
    activeBeatRef.current = 1;
  }

  function isBeatGridEmpty(considerDisabled = false) {
    const currentGrid = gridRef.current;
    for (let i = 0; i < currentGrid.length; i++) {
      for (let j = 0; j < currentGrid[0].length; j++) {
        if (currentGrid[i][j] === appConfig.CELL.SELECTED || currentGrid[i][j] === appConfig.CELL.PLAYING) {
          return false;
        }
        if (considerDisabled && currentGrid[i][j] === appConfig.CELL.DISABLED) {
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
        if (instruments[rowIdx].active === false) return appConfig.CELL.DISABLED;
        else if (col === appConfig.CELL.SELECTED) return appConfig.CELL.UNSELECTED;
        else if (col === appConfig.CELL.UNSELECTED) return appConfig.CELL.SELECTED;
        else if (col === appConfig.CELL.PLAYING) return appConfig.CELL.UNSELECTED;
        else if (col === appConfig.CELL.CURRENT) return appConfig.CELL.SELECTED;
        else if (col === appConfig.CELL.DISABLED) return appConfig.CELL.DISABLED;
        else return appConfig.CELL.DISABLED;
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
              case appConfig.CELL.SELECTED:
                return cIdx === activeBeatRef.current - 1 ?
                  appConfig.CELL.PLAYING :
                  col;
              case appConfig.CELL.UNSELECTED:
                return cIdx === activeBeatRef.current - 1 ?
                  appConfig.CELL.CURRENT :
                  col;
              case appConfig.CELL.PLAYING:
                return appConfig.CELL.SELECTED;
              case appConfig.CELL.CURRENT:
                return appConfig.CELL.UNSELECTED;
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
        if (row[activeBeatRef.current - 1] === appConfig.CELL.PLAYING) {
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