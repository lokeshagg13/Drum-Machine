import { Fragment } from "react";

import classes from "./modal-template.module.css";

function Modal(props) {
  const { purpose, type } = props;
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
      {purpose === "confirmation" && (
        <Fragment>
          <button className={classes.cancelBtn} onClick={props.onCancel}>
            Cancel
          </button>
          <button className={classes.confirmBtn} onClick={props.onConfirm}>
            {type === "save" ? "Save" : "Load"}
          </button>
        </Fragment>
      )}
      {purpose === "notification" && (
        <Fragment>
          <button className={classes.confirmBtn} onClick={props.onOK}>
            OK
          </button>
        </Fragment>
      )}
    </div>
  );
}

export default Modal;
