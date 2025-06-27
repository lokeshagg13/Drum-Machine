import { useContext } from "react";
import InstrumentItem from "./InstrumentItem";
import BeatPlayerContext from "../../store/beatPlayerContext";

import "./InstrumentPanel.css";

function InstrumentPanel() {
  const beatPlayerContext = useContext(BeatPlayerContext);

  return (
    <div className="instrument-panel">
      {beatPlayerContext.instruments.map(({ id, name, image, active }) => (
        <InstrumentItem
          key={id}
          id={id}
          name={name}
          image={image}
          active={active}
        />
      ))}
    </div>
  );
}

export default InstrumentPanel;
