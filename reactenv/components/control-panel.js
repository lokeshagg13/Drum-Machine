import classes from "./control-panel.module.css";

function ControlPanel(props) {
  return (
    <div className={classes.controls}>
      <div className={classes.play}>
        <button type="button" id="play-pause-btn">
          Pause
        </button>
        <h5>Playing</h5>
      </div>
      <div className={classes.bpm}>
        <div className={classes.display}>
          <div className={classes.label}>Beats per minute</div>
          <input type="text" value="240" className={classes.input} disabled />
        </div>
        <div className={classes.bpmControls}>
          <button type="button" id="bpm-increment-btn">
            + 5
          </button>
          <button type="button" id="bpm-decrement-btn">
            - 5
          </button>
        </div>
      </div>
      <div className={classes.control}>
        <div>
          <div>
            <div>Number of Beats</div>
            <div></div>
          </div>
          <div>
            <button type="button" id="beats-increment-btn">
              + 1
            </button>
            <button type="button" id="beats-decrement-btn">
              - 1
            </button>
          </div>
        </div>
      </div>
      <div className={classes.control}>
        <button type="button" id="save-btn">
          Save Beat
        </button>
        <button type="button" id="load-btn">
          Load Beat
        </button>
      </div>
      <div className={classes.control}>
        <button type="button" id="clear-board">
          Clear Board
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
