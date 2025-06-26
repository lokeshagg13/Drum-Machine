const config = {
  MAX_BEATS: 30,
  MIN_BEATS: 2,
  DEFAULT_BEATS: 8,
  MAX_BPM: 700,
  MIN_BPM: 150,
  DEFAULT_BPM: 240,
  BPM_INCREMENT: 5,
  BPM_DECREMENT: 5,
  SELECTED_CELL_PERCENTAGE_RANGE: [30, 60],
  CELL: {
    UNSELECTED: 0,
    SELECTED: 1,
    CURRENT: 2,
    PLAYING: 3,
    DISABLED: 4,
  },
  INSTRUMENTS: ['Hi Hat', 'Snare', 'Bass Drum', 'Crash', 'Clap', 'Floor Tom']
};

export default config;
