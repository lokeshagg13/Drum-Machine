import { useState, useContext, useEffect } from "react";
import ModalContext from "../../store/modalContext";
import BeatPlayerContext from "../../store/beatPlayerContext";
import Notification from "../ui/elements/notification";

import "./loadBeatModal.css";

async function fetchBeats() {
  try {
    const fetchResponse = await fetch("/api/beats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const fetchResponseBody = await fetchResponse.json();
    if (!fetchResponse.ok)
      return { status: false, remarks: fetchResponseBody.message };

    const fetchedBeats = fetchResponseBody.beats;
    for (let i = 0; i < fetchedBeats.length; i += 1) {
      const grid = fetchedBeats[i].grid;
      const modifiedGrid = grid.map((item) =>
        item.row.map((cell) => cell.status)
      );
      delete fetchedBeats[i].grid;
      fetchedBeats[i].grid = JSON.parse(JSON.stringify(modifiedGrid));
    }
    return {
      status: true,
      remarks: fetchResponseBody.message,
      fetchedBeats: fetchedBeats,
    };
  } catch (error) {
    return { status: false, remarks: error.message };
  }
}

async function deleteBeat(beatName) {
  try {
    const deleteResponse = await fetch("/api/beats", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: beatName }),
    });
    const deleteResponseBody = await deleteResponse.json();
    if (!deleteResponse.ok)
      return { status: false, remarks: deleteResponseBody.message };

    return {
      status: true,
      remarks: deleteResponseBody.message,
    };
  } catch (error) {
    return { status: false, remarks: error.message };
  }
}

function LoadBeatModal() {
  const modalCtx = useContext(ModalContext);
  const beatPlayerCtx = useContext(BeatPlayerContext);
  const [fetchStatus, setFetchStatus] = useState(null);
  const [fetchRemarks, setFetchRemarks] = useState(null);
  const [fetchedBeats, setFetchedBeats] = useState(null);
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [loadStatus, setLoadStatus] = useState(null);
  const [loadRemarks, setLoadRemarks] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [deleteRemarks, setDeleteRemarks] = useState(null);

  function loadBeatHandler() {
    setDeleteStatus(null);
    setLoadStatus("pending");
    setLoadRemarks("Loading the beat");
    let selectedBeatInfo = Array.isArray(fetchedBeats)
      ? fetchedBeats.filter((beat) => beat._id === selectedBeat)
      : [];
    if (selectedBeatInfo.length === 0) {
      setLoadStatus("error");
      setLoadRemarks("Unable to load the beat");
      return;
    }
    selectedBeatInfo = selectedBeatInfo[0];
    beatPlayerCtx.loadBeat(
      selectedBeatInfo.bpm,
      selectedBeatInfo.numberOfBeats,
      selectedBeatInfo.numberOfInstruments,
      selectedBeatInfo.instruments,
      selectedBeatInfo.grid
    );
    setLoadStatus("success");
    setLoadRemarks("Loaded successfully");
    modalCtx.hideModals();
  }

  function deleteBeatHandler() {
    setLoadStatus(null);
    setDeleteStatus("pending");
    setDeleteRemarks("Deleting the beat");
    let selectedBeatInfo = Array.isArray(fetchedBeats)
      ? fetchedBeats.filter((beat) => beat._id === selectedBeat)
      : [];
    if (selectedBeatInfo.length === 0) {
      setLoadStatus("error");
      setLoadRemarks("Unable to delete the beat");
      return;
    }
    selectedBeatInfo = selectedBeatInfo[0];
    deleteBeat(selectedBeatInfo.name)
      .then((deleteResult) => {
        if (deleteResult.status === true) {
          setDeleteStatus("success");
          setDeleteRemarks(deleteResult.remarks);
        } else {
          setDeleteStatus("error");
          setDeleteRemarks(deleteResult.remarks);
        }
      })
      .catch((error) => {
        setDeleteStatus("error");
        setDeleteRemarks(error.message);
      });
  }

  useEffect(() => {
    setFetchStatus("fetching");
    fetchBeats()
      .then((fetchResult) => {
        if (fetchResult.status === true) {
          setFetchStatus("success");
          setFetchedBeats(fetchResult.fetchedBeats);
          setSelectedBeat(fetchResult.fetchedBeats[0]._id);
        } else {
          setFetchStatus("error");
          setFetchRemarks(fetchResult.remarks);
          setFetchedBeats(null);
          setSelectedBeat(null);
        }
      })
      .catch((error) => {
        setFetchStatus("error");
        setFetchRemarks(error.message);
        setFetchedBeats(null);
        setSelectedBeat(null);
      });
  }, [deleteStatus]);

  useEffect(() => {
    if (deleteStatus === "success" || deleteStatus === "error") {
      const timer = setTimeout(() => setDeleteStatus(null), 5000);
      return () => clearTimeout(timer);
    }
    if (loadStatus === "success" || loadStatus === "error") {
      const timer = setTimeout(() => setLoadStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [deleteStatus, loadStatus]);

  return (
    <div className="modal">
      <div className="content">
        <h3>Load the Beat</h3>
        <div className="control">
          {fetchStatus === "success" && (
            <select
              className="form-select"
              size="5"
              aria-label="loaded-beats"
              defaultValue={fetchedBeats[0]._id}
              onChange={(event) => setSelectedBeat(event.target.value)}
            >
              {fetchedBeats.map((beat) => (
                <option key={beat._id} value={beat._id}>
                  {beat.name}
                </option>
              ))}
            </select>
          )}
          {fetchStatus === "error" && fetchRemarks}
          {fetchStatus === "fetching" && "Fetching"}
        </div>
        {loadStatus && loadRemarks && (
          <Notification type={loadStatus} message={loadRemarks} />
        )}
        {deleteStatus && deleteRemarks && (
          <Notification type={deleteStatus} message={deleteRemarks} />
        )}
      </div>
      <button className="cancelBtn" onClick={modalCtx.hideModals}>
        Cancel
      </button>
      <button
        className="confirmBtn"
        onClick={loadBeatHandler}
        disabled={!selectedBeat}
      >
        Load
      </button>
      <button
        className="confirmBtn"
        onClick={deleteBeatHandler}
        disabled={!selectedBeat}
      >
        Delete
      </button>
    </div>
  );
}

export default LoadBeatModal;
