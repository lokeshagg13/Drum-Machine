import { useContext } from "react";
import BeatPlayerContext from "../../store/beatPlayerContext";

import "./instrumentItem.css";

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
      className={`instrument ${active ? "enabled" : "disabled"}`}
      onClick={toggleInstrumentStatus}
    >
      <div className="name">{name}</div>
      <div className="image">
        <img src={image} alt="" width="32" height="32" />
      </div>
    </button>
  );
}

export default InstrumentItem;
