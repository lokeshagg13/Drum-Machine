import { createContext, useState } from "react";

const BeatPlayerContext = createContext({
  numberOfInstruments: 6,
  numberOfBeats: 8,
  bpm: 240,
  playing: true,
  currentGrid: new Array(6).fill(new Array(8).fill("unselected")),
  activeInstruments: new Array(6).fill(true),
  activeBeat: 1,
  moveToNextBeat: () => {},
  toggleGridCellSelection: (rowIdx, colIdx) => {},
  changeGridCellBasedOnActiveBeat: () => {},
  // play: () => {},
  // pause: () => {},
  // incrementBPM: () => {},
  // decrementBPM: () => {},
  // incrementBeats: () => {},
  // decrementBeats: () => {},
  // selectGridCell: (rowIdx, colIdx) => {},
  // unselectGridCell: (rowIdx, colIdx) => {},
  // enableInstrument: (idx) => {},
  // disableInstrument: (idx) => {},
});

export function BeatPlayerContextProvider(props) {
  const [numberOfInstruments, setNumberOfInstruments] = useState(6);
  const [numberOfBeats, setNumberOfBeats] = useState(8);
  const [bpm, setBPM] = useState(240);
  const [playing, setPlaying] = useState(true);
  const [currentGrid, setCurrentGrid] = useState(() => {
    return new Array(numberOfInstruments).fill(
      new Array(numberOfBeats).fill("unselected")
    );
  });
  const [activeInstruments, setActiveInstruments] = useState(() => {
    return new Array(numberOfInstruments).fill(true);
  });
  const [activeBeat, setActiveBeat] = useState(1);

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
          if (cIdx === activeBeat && col === "selected") {
            return "playing";
          } else if (col === "playing") return "selected";
          else return col;
        });
      })
    );
  }

  const currentBeatPlayerContext = {
    numberOfInstruments,
    numberOfBeats,
    bpm,
    playing,
    currentGrid,
    activeInstruments,
    activeBeat,
    moveToNextBeat,
    toggleGridCellSelection,
    changeGridCellBasedOnActiveBeat,
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
