import { useContext } from "react";
import InstrumentItem from "./instrumentItem";
import BeatPlayerContext from "../../store/beatPlayerContext";

import "./instrumentPanel.css";

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
