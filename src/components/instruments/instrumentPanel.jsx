import instrumentsList from "../../store/instruments.js";
import InstrumentItem from "./instrumentItem";

import "./instrumentPanel.css";

function InstrumentPanel() {
  return (
    <div className="instrument-panel">
      {instrumentsList.map((instrument) => (
        <InstrumentItem
          key={instrument.instrument_id}
          id={instrument.instrument_id}
          name={instrument.instrument_name}
          image={instrument.instrument_image}
        />
      ))}
    </div>
  );
}

export default InstrumentPanel;
