import mongoose from "mongoose";
import beatModel from "../../models/beat";
import constants from "../../store/constants";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") return;

  let connection;
  try {
    connection = await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error connecting to the DB" });
  }

  if (req.method === "POST") {
    try {
      const { name } = req.body;
      const searchedBeat = await beatModel.findOne({ name: name });
      if (searchedBeat) throw new Error("Beat name already exist");

      const {
        bpm,
        numberOfBeats,
        numberOfInstruments,
        instruments,
        currentGrid,
      } = req.body;

      if (
        !Number.isInteger(bpm) ||
        !Number.isInteger(numberOfBeats) ||
        !Number.isInteger(numberOfInstruments) ||
        !Array.isArray(instruments) ||
        !Array.isArray(currentGrid)
      )
        throw new Error("Invalid data");

      if (
        bpm < constants.MIN_BPM ||
        bpm > constants.MAX_BPM ||
        numberOfBeats < constants.MIN_BEATS ||
        numberOfBeats > constants.MAX_BEATS ||
        instruments.length !== numberOfInstruments
      )
        throw new Error("Invalid data");

      const invalidInstruments = instruments.filter(
        (instrument) => !instrument.id || !instrument.name || !instrument.active
      );
      if (invalidInstruments.length > 0) throw new Error("Invalid data");

      const grid = currentGrid.map((row) => ({
        row: row.map((col) => ({ status: col })),
      }));

      try {
        await beatModel.create({
          name: name,
          bpm: bpm,
          numberOfBeats: numberOfBeats,
          numberOfInstruments: numberOfInstruments,
          instruments: instruments,
          grid: grid,
        });
      } catch (error) {
        throw new Error("Error saving the beat");
      }
      await connection.disconnect();
      return res.status(200).json({ message: "Saved successfully" });
    } catch (error) {
      await connection.disconnect();
      return res.status(500).json({ message: error.message });
    }
  }
}
