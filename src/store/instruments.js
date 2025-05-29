import hiHatImage from "../images/instruments/hi-hat.png";
import snareImage from "../images/instruments/snare.png";
import kickImage from "../images/instruments/kick.png";
import crashImage from "../images/instruments/crash.png";
import clapImage from "../images/instruments/clap.png";
import tomImage from "../images/instruments/tom.png";

const instruments = [
  {
    "instrument_id": 1,
    "instrument_name": "Hi Hat",
    "instrument_image": hiHatImage,
    "sound_file_path": "/sounds/hi hat.wav"
  },
  {
    "instrument_id": 2,
    "instrument_name": "Snare",
    "instrument_image": snareImage,
    "sound_file_path": "/sounds/snare.wav"
  },
  {
    "instrument_id": 3,
    "instrument_name": "Bass Drum",
    "instrument_image": kickImage,
    "sound_file_path": "/sounds/kick.wav"
  },
  {
    "instrument_id": 4,
    "instrument_name": "Crash",
    "instrument_image": crashImage,
    "sound_file_path": "/sounds/crash.wav"
  },
  {
    "instrument_id": 5,
    "instrument_name": "Clap",
    "instrument_image": clapImage,
    "sound_file_path": "/sounds/clap.wav"
  },
  {
    "instrument_id": 6,
    "instrument_name": "Floor Tom",
    "instrument_image": tomImage,
    "sound_file_path": "/sounds/tom.wav"
  }
];

export default instruments;
