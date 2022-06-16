import mongoose from "mongoose";
import constants from "../store/constants";

const cellSchema = new mongoose.Schema({
  status: {
    type: String,
    required: [true, "Status of the cell is required"],
  },
});

const rowSchema = new mongoose.Schema({
  row: {
    type: [cellSchema],
    required: [true, "Row of the beat is required"],
  },
});

const instrumentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "ID of the instrument is required"],
  },
  name: {
    type: String,
    required: [true, "Name of the instrument is required"],
  },
  active: {
    type: Boolean,
    required: [true, "Status of the instrument is required"],
    default: true,
  },
});

const beatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of the beat is required"],
    trim: true,
  },
  bpm: {
    type: Number,
    required: [true, "BPM is required"],
    default: constants.MIN_BPM,
  },
  numberOfBeats: {
    type: Number,
    required: [true, "Number of beats is required"],
    default: constants.MIN_BEATS,
  },
  numberOfInstruments: {
    type: Number,
    required: [true, "Number of instruments is required"],
    default: 6,
  },
  instruments: {
    type: [instrumentSchema],
    required: [true, "Info about the instruments is required"],
  },
  grid: {
    type: [rowSchema],
    required: [true, "Grid is required"],
  },
});

beatSchema.index({ name: 1 }, { unique: true });

mongoose.models = {};

const beatModel = mongoose.model("beatModel", beatSchema, "BeatCollection");
export default beatModel;
