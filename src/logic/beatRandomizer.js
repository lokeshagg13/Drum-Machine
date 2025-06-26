import appConfig from "../logic/config";
import Instrument from "./instruments";

function generateRandomMultiple(min, max, mul = 1) {
    const minFactor = Math.ceil(min / mul);
    const maxFactor = Math.floor(max / mul);
    const randomMultiple =
        Math.floor(Math.random() * (maxFactor - minFactor + 1)) + minFactor;
    return randomMultiple * mul;
}

function generateRandomInstrumentList() {
    return appConfig.INSTRUMENTS.map((instrumentName, index) => {
        const instrument = new Instrument(index, instrumentName);
        instrument.active = Math.random() < 0.95;
        return instrument
    });
}

function generateRandomBeatGrid(instruments, numBeats, minPerc, maxPerc) {
    const totalCells = instruments.length * numBeats;
    const randomPerc = Math.random() * (maxPerc - minPerc) + minPerc;
    const numSelected = Math.floor((randomPerc / 100) * totalCells);
    const flatArray = Array(numSelected)
        .fill(appConfig.CELL.SELECTED)
        .concat(Array(totalCells - numSelected).fill(appConfig.CELL.UNSELECTED));

    for (let i = flatArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flatArray[i], flatArray[j]] = [flatArray[j], flatArray[i]];
    }
    const grid = [];
    for (let i = 0; i < instruments.length; i++) {
        grid.push(flatArray.slice(i * numBeats, (i + 1) * numBeats));
        if (instruments[i] === false) {
            for (let j = 0; j < numBeats; j++) {
                if (grid[i][j] === appConfig.CELL.SELECTED) {
                    grid[i][j] = appConfig.CELL.DISABLED
                }
            }
        }
    }
    return grid;
}

function generateRandomBeat() {
    const randomBPM = generateRandomMultiple(
        appConfig.MIN_BPM,
        appConfig.MAX_BPM,
        appConfig.BPM_INCREMENT
    );
    const randomNumBeats = generateRandomMultiple(
        appConfig.MIN_BEATS,
        appConfig.MAX_BEATS
    );
    const randomInstruments = generateRandomInstrumentList();
    const randomBeatGrid = generateRandomBeatGrid(
        randomInstruments.map((instrument) => instrument.active),
        randomNumBeats,
        appConfig.SELECTED_CELL_PERCENTAGE_RANGE[0],
        appConfig.SELECTED_CELL_PERCENTAGE_RANGE[1]
    );
    return { randomBPM, randomNumBeats, randomInstruments, randomBeatGrid }

}

export default generateRandomBeat;

