import { Fragment } from "react";
import classes from "./main-panel.module.css";
import ControlPanel from "./control-panel";
import GridPanel from "./grid-panel";
import InstrumentPanel from "./instrument-panel";

function MainPanel() {
  return (
    <Fragment>
      <div className={classes.main}>
        <div className={classes.actions}>
          <InstrumentPanel />
          <GridPanel />
        </div>
        <ControlPanel />
      </div>
    </Fragment>
  );
}

export default MainPanel;
