import { useState } from "react";
import Modal from "./modal-template";

import classes from "./save-beat-modal.module.css";

function SaveBeatModal() {
  const [errorRemarks, setErrorRemarks] = useState(null);

  return (
    <Modal purpose="confirmation" type="save">
      <h3>Save the Beat</h3>
      <div className={classes.control}>
        <label htmlFor="beat-name">Beat Name</label>
        <input type="text" id="beat-name" />
      </div>
      <div className={classes.error}>{errorRemarks}</div>
    </Modal>
  );
}

export default SaveBeatModal;
