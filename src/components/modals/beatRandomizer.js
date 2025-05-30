import constants from "../../store/constants";
import instruments from "../../store/instruments";

function generateRandomMultiple(min, max, mul = 1) {
    const minFactor = Math.ceil(min / mul);
    const maxFactor = Math.floor(max / mul);
    const randomMultiple =
        Math.floor(Math.random() * (maxFactor - minFactor + 1)) + minFactor;
    return randomMultiple * mul;
}

function generateRandomInstrumentList() {
    return instruments.map((instrument) => ({
        id: instrument.instrument_id,
        name: instrument.instrument_name,
        active: Math.random() < 0.95,
    }));
}

function generateRandomBeatGrid(instrumentsList, numBeats, minPerc, maxPerc) {
    const totalCells = instrumentsList.length * numBeats;
    const randomPerc = Math.random() * (maxPerc - minPerc) + minPerc;
    const numSelected = Math.floor((randomPerc / 100) * totalCells);
    const flatArray = Array(numSelected)
        .fill("selected")
        .concat(Array(totalCells - numSelected).fill("unselected"));

    for (let i = flatArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flatArray[i], flatArray[j]] = [flatArray[j], flatArray[i]];
    }
    const grid = [];
    for (let i = 0; i < instrumentsList.length; i++) {
        grid.push(flatArray.slice(i * numBeats, (i + 1) * numBeats));
        if (instrumentsList[i] === false) {
            for (let j = 0; j < numBeats; j++) {
                if (grid[i][j] === "selected") {
                    grid[i][j] = "disabled"
                }
            }
        }
    }
    return grid;
}

function generateRandomBeat() {
    const randomBPM = generateRandomMultiple(
        constants.MIN_BPM,
        constants.MAX_BPM,
        constants.BPM_INCREMENT
    );
    const randomNumBeats = generateRandomMultiple(
        constants.MIN_BEATS,
        constants.MAX_BEATS
    );
    const randomInstruments = generateRandomInstrumentList();
    const randomBeatGrid = generateRandomBeatGrid(
        randomInstruments.map((instrument) => instrument.active),
        randomNumBeats,
        constants.SELECTED_CELL_PERCENTAGE_RANGE[0],
        constants.SELECTED_CELL_PERCENTAGE_RANGE[1]
    );
    console.log(randomBPM, randomNumBeats, randomInstruments, randomBeatGrid)
    return { randomBPM, randomNumBeats, randomInstruments, randomBeatGrid }
}

export default generateRandomBeat;

