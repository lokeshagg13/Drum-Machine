import { useContext, useEffect, useRef } from "react";
import BeatPlayerContext from "../store/beatPlayerContext";

function BeatPlayer() {
  const beatPlayerCtx = useContext(BeatPlayerContext);
  const lastFrameTime = useRef(performance.now());
  let animationFrameId = useRef(null);

  useEffect(() => {
    const beatLoop = (currentFrameTime) => {
      if (beatPlayerCtx.beatPlayerStatus !== "running") return;
      const deltaFrameTime = currentFrameTime - lastFrameTime.current;
      const beatDuration = (60 * 1000) / beatPlayerCtx.bpm;
      if (deltaFrameTime >= beatDuration) {
        beatPlayerCtx.updateGridBasedOnActiveBeat();
        beatPlayerCtx.playActiveBeat();
        beatPlayerCtx.moveToNextBeat();
        lastFrameTime.current = currentFrameTime;
      }
      animationFrameId.current = requestAnimationFrame(beatLoop);
    };

    if (beatPlayerCtx.beatPlayerStatus === "running") {
      lastFrameTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(beatLoop);
    } else if (beatPlayerCtx.beatPlayerStatus === "paused") {
      cancelAnimationFrame(animationFrameId.current);
    }
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [beatPlayerCtx]);

  useEffect(() => {
    if (beatPlayerCtx.beatPlayerStatus === null)
      beatPlayerCtx.startBeatPlayer();
  }, []);

  return <></>;
}

export default BeatPlayer;
