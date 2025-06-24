import instruments from "./instruments/instruments";

let beatPlayer;

class BeatPlayer {
    constructor(getCurrentGrid, getInstruments, updateCurrentGrid) {
        this.activeBeat = 1;
        this.getCurrentGrid = getCurrentGrid;
        this.getInstruments = getInstruments;
        this.updateCurrentGrid = updateCurrentGrid;
    }

    #playInstrumentSound(instrumentIdx) {
        const player = instruments[instrumentIdx].audioPlayerPlayerPlayerPlayer;
        if (player) {
            player.currentTime = 0;
            player.play();
        }
    }

    moveToNextBeat() {
        const currentGrid = this.getCurrentGrid();
        this.activeBeat =
            (this.activeBeat < currentGrid[0].length) ?
                this.activeBeat + 1 :
                1;
    }
}

export function initBeatPlayer({
    getCurrentGrid,
    getBPM,
    getInstruments,
    updateCurrentGrid,
}) {
    beatPlayer = new BeatPlayer(getCurrentGrid, getInstruments, updateCurrentGrid);

    let lastTime = performance.now();
    let animationFrameId;
    let isPaused = false;

    function startBeatLoop() {
        if (isPaused) return;

        function beatLoop(currentTime) {
            if (!isPaused) {

                const deltaTime = currentTime - lastTime;
                const beatDuration = (60 * 1000) / getBPM();
                if (deltaTime >= beatDuration) {
                    beatPlayer.changeGridCellsBasedOnActiveBeat();
                    beatPlayer.playActiveBeat();
                    beatPlayer.moveToNextBeat();
                    lastTime = currentTime;
                }
                animationFrameId = requestAnimationFrame(beatLoop);
            }
        }
        animationFrameId = requestAnimationFrame(beatLoop);
    }

    function startBeatPlayer() {
        isPaused = false;
        lastTime = performance.now();
        startBeatLoop();
    };

    function pauseBeatPlayer() {
        if (isPaused) return;
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
    };

    function resumeBeatPlayer() {
        if (!isPaused) return;
        isPaused = false;
        lastTime = performance.now();
        startBeatLoop();
    }

    function stopBeatPlayer() {
        isPaused = false;
        beatPlayer = null;
        cancelAnimationFrame(animationFrameId);
    }

    return {
        startBeatPlayer,
        pauseBeatPlayer,
        resumeBeatPlayer,
        stopBeatPlayer
    };
}
