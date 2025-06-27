import { useContext } from "react";
import BeatPlayerContext from "../../store/beatPlayerContext";

import "./InstrumentItem.css";

function InstrumentItem(props) {
  const { id, name, image, active } = props;
  const beatPlayerCtx = useContext(BeatPlayerContext);
  
  function toggleInstrumentStatus() {
    if (active) beatPlayerCtx.disableInstrument(id);
    else beatPlayerCtx.enableInstrument(id);
  }

  return (
    <button
      id={`instrument_${id}`}
      className={`instrument ${active ? "enabled" : "disabled"}`}
      onClick={toggleInstrumentStatus}
    >
      <div className="instrument-name">{name}</div>
      <div className="instrument-image">
        <img src={image} alt="" width="32" height="32" />
      </div>
    </button>
  );
}

export default InstrumentItem;
