import hiHatImage from "../images/instruments/hi-hat.png";
import snareImage from "../images/instruments/snare.png";
import kickImage from "../images/instruments/kick.png";
import crashImage from "../images/instruments/crash.png";
import clapImage from "../images/instruments/clap.png";
import tomImage from "../images/instruments/tom.png";

class Instrument {
  static AUDIO_BASE_PATH = `${process.env.PUBLIC_URL}/sounds/`
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.image = this.getImageObject();
    this.soundPath = this.getAudioPath();
    this.audioPlayer = new Audio(`${Instrument.AUDIO_BASE_PATH}${this.soundPath}`);
    this.active = true;
  }

  static load(id, name, active) {
    const instrument = new Instrument(id, name);
    instrument.active = active;
    return instrument;
  }

  getImageObject() {
    switch (this.name) {
      case 'Hi Hat': return hiHatImage;
      case 'Snare': return snareImage;
      case 'Bass Drum': return kickImage;
      case 'Crash': return crashImage;
      case 'Clap': return clapImage;
      case 'Floor Tom': return tomImage;
      default: return null;
    }
  }

  getAudioPath() {
    switch (this.name) {
      case 'Hi Hat': return 'hi hat.WAV';
      case 'Snare': return 'snare.WAV';
      case 'Bass Drum': return 'kick.WAV';
      case 'Crash': return 'crash.wav';
      case 'Clap': return 'clap.wav';
      case 'Floor Tom': return 'floor tom.wav';
      default: return null;
    }
  }

  playSound() {
    this.audioPlayer.currentTime = 0;
    this.audioPlayer.play();
  }
}

export default Instrument;
