import Image from "next/image";
import { useContext } from "react";
import BeatPlayerContext from "../store/beat-player-context";

import classes from "./instrument-item.module.css";

function InstrumentItem(props) {
  const { id, name, image } = props;
  const beatPlayerCtx = useContext(BeatPlayerContext);
  const active = beatPlayerCtx.instruments[id - 1].active;

  function toggleInstrumentStatus(event) {
    if (active) beatPlayerCtx.disableInstrument(id);
    else beatPlayerCtx.enableInstrument(id);

  }

  return (
    <button
      id={`instrument_${id}`}
      className={`${classes.instrument} ${active ? classes.enabled : classes.disabled}`}
      onClick={toggleInstrumentStatus}
    >
      <div className={classes.name}>{name}</div>
      <div className={classes.image}>
        <Image src={image} alt="" width="32" height="32" />
      </div>
    </button>
  );
}

export default InstrumentItem;
