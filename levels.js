// levels.js

// Note → frequency map
const NOTE_FREQUENCIES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
};

// Level definitions
const LEVELS = [
  {
    id: "demo1",
    name: "Warmup (slow)",
    fallDuration: 4.5,
    tiles: [
      { time: 1.0, word: "la", note: "C4" },
      { time: 2.5, word: "la", note: "D4" },
      { time: 4.0, word: "la", note: "E4" },
      { time: 5.5, word: "play", note: "G4" },
      { time: 7.0, word: "music", note: "C5" },
      { time: 9.0, word: "type", note: "E4" },
      { time: 11.0, word: "piano", note: "G4" },
    ],
  },
  {
    id: "flow1",
    name: "Long Practice – Flow",
    fallDuration: 3.8,
    tiles: [
      { time: 1.0, word: "type", note: "C4" },
      { time: 1.8, word: "flow", note: "D4" },
      { time: 2.6, word: "beat", note: "E4" },
      { time: 3.4, word: "time", note: "G4" },
      { time: 4.2, word: "keys", note: "A4" },
      { time: 5.0, word: "rhythm", note: "G4" },

      { time: 6.0, word: "type", note: "C4" },
      { time: 6.8, word: "type", note: "D4" },
      { time: 7.6, word: "type", note: "E4" },
      { time: 8.4, word: "go", note: "G4" },
      { time: 9.2, word: "fast", note: "A4" },
      { time: 10.0, word: "now", note: "G4" },

      { time: 11.0, word: "left", note: "E4" },
      { time: 11.8, word: "right", note: "D4" },
      { time: 12.6, word: "up", note: "C4" },
      { time: 13.4, word: "down", note: "E4" },
      { time: 14.2, word: "jump", note: "G4" },
      { time: 15.0, word: "tap", note: "A4" },

      { time: 16.0, word: "focus", note: "C4" },
      { time: 16.8, word: "stay", note: "D4" },
      { time: 17.6, word: "in", note: "E4" },
      { time: 18.4, word: "the", note: "F4" },
      { time: 19.2, word: "zone", note: "G4" },
      { time: 20.0, word: "now", note: "A4" },

      { time: 21.0, word: "home", note: "E4" },
      { time: 21.8, word: "row", note: "D4" },
      { time: 22.6, word: "asdf", note: "C4" },
      { time: 23.4, word: "jkl;", note: "E4" },
      { time: 24.2, word: "type", note: "G4" },
      { time: 25.0, word: "smooth", note: "A4" },

      { time: 26.0, word: "flow", note: "C4" },
      { time: 26.8, word: "flow", note: "D4" },
      { time: 27.6, word: "flow", note: "E4" },
      { time: 28.4, word: "more", note: "G4" },
      { time: 29.2, word: "more", note: "A4" },
      { time: 30.0, word: "done", note: "C5" },
    ],
  },
  {
    id: "arpeggio1",
    name: "Long Practice – Arpeggios",
    fallDuration: 3.2,
    tiles: [
      { time: 0.8, word: "do", note: "C4" },
      { time: 1.4, word: "mi", note: "E4" },
      { time: 2.0, word: "so", note: "G4" },
      { time: 2.6, word: "do", note: "C5" },

      { time: 3.4, word: "re", note: "D4" },
      { time: 4.0, word: "fa", note: "F4" },
      { time: 4.6, word: "la", note: "A4" },
      { time: 5.2, word: "re", note: "D4" },

      { time: 6.0, word: "up", note: "C4" },
      { time: 6.6, word: "up", note: "E4" },
      { time: 7.2, word: "up", note: "G4" },
      { time: 7.8, word: "up", note: "C5" },

      { time: 8.6, word: "down", note: "C5" },
      { time: 9.2, word: "down", note: "G4" },
      { time: 9.8, word: "down", note: "E4" },
      { time: 10.4, word: "down", note: "C4" },

      { time: 11.2, word: "roll", note: "E4" },
      { time: 11.8, word: "roll", note: "G4" },
      { time: 12.4, word: "roll", note: "C5" },
      { time: 13.0, word: "rest", note: "D4" },

      { time: 14.0, word: "fast", note: "C4" },
      { time: 14.6, word: "fast", note: "E4" },
      { time: 15.2, word: "fast", note: "G4" },
      { time: 15.8, word: "fast", note: "C5" },

      { time: 16.6, word: "clean", note: "A4" },
      { time: 17.2, word: "clean", note: "G4" },
      { time: 17.8, word: "clean", note: "E4" },
      { time: 18.4, word: "clean", note: "C4" },

      { time: 19.4, word: "final", note: "D4" },
      { time: 20.0, word: "run", note: "F4" },
      { time: 20.6, word: "run", note: "A4" },
      { time: 21.2, word: "run", note: "C5" },

      { time: 22.0, word: "done", note: "C5" },
      { time: 22.6, word: "gg", note: "G4" },
      { time: 23.2, word: "wp", note: "E4" },
      { time: 23.8, word: "rest", note: "C4" },
    ],
  },
];
