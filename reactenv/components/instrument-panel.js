import instrumentsList from "../instruments.json";
import InstrumentItem from "./instrument-item";

import classes from "./instrument-panel.module.css";

function InstrumentPanel() {
  console.log(instrumentsList);
  return (
    <div className={classes.panel}>
      {instrumentsList.map((instrument) => (
        <InstrumentItem
          key={instrument.instrument_id}
          name={instrument.instrument_name}
          image={instrument.instrument_image}
        />
      ))}
    </div>
  );
}

export default InstrumentPanel;
