import { Fragment } from "react";

import "./modalTemplate.css";

function Modal(props) {
  const { purpose, type } = props;
  return (
    <div className="modal">
      <div className="content">{props.children}</div>
      {purpose === "confirmation" && (
        <Fragment>
          <button className="cancelBtn" onClick={props.onCancel}>
            Cancel
          </button>
          <button className="confirmBtn" onClick={props.onConfirm}>
            {type === "save" ? "Save" : "Load"}
          </button>
        </Fragment>
      )}
      {purpose === "notification" && (
        <Fragment>
          <button className="confirmBtn" onClick={props.onOK}>
            OK
          </button>
        </Fragment>
      )}
    </div>
  );
}

export default Modal;
