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
  /* ---------------- EASY ---------------- */

  {
    id: "easy_warmup",
    name: "[Easy] Warmup Steps",
    fallDuration: 4.8, // slow
    tiles: [
      { time: 1.0, word: "la", note: "C4" },
      { time: 3.0, word: "la", note: "D4" },
      { time: 5.0, word: "la", note: "E4" },
      { time: 7.0, word: "play", note: "G4" },
      { time: 9.0, word: "music", note: "C5" },

      { time: 12.0, word: "type", note: "E4" },
      { time: 14.0, word: "keys", note: "G4" },
      { time: 16.0, word: "slow", note: "F4" },
      { time: 18.0, word: "flow", note: "E4" },
      { time: 20.0, word: "done", note: "C4" },
    ],
  },

  {
    id: "easy_home_row",
    name: "[Easy] Home Row Drill",
    fallDuration: 4.4,
    tiles: [
      { time: 1.0, word: "asdf", note: "C4" },
      { time: 3.0, word: "jkl;", note: "E4" },
      { time: 5.0, word: "asdf", note: "G4" },
      { time: 7.0, word: "jkl;", note: "C5" },

      { time: 10.0, word: "home", note: "E4" },
      { time: 12.0, word: "row", note: "D4" },
      { time: 14.0, word: "type", note: "C4" },
      { time: 16.0, word: "calm", note: "E4" },

      { time: 19.0, word: "easy", note: "G4" },
      { time: 21.0, word: "mode", note: "C5" },
    ],
  },

  /* ---------------- MEDIUM ---------------- */

  {
    id: "medium_flow",
    name: "[Medium] Flow Trainer",
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
    ],
  },

  {
    id: "medium_arpeggios",
    name: "[Medium] Arpeggio Run",
    fallDuration: 3.4,
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
    ],
  },

  /* ---------------- HARD ---------------- */

  {
    id: "hard_stream",
    name: "[Hard] Word Stream",
    fallDuration: 2.9, // fast
    tiles: [
      { time: 0.8, word: "go", note: "C4" },
      { time: 1.3, word: "now", note: "D4" },
      { time: 1.8, word: "fast", note: "E4" },
      { time: 2.3, word: "type", note: "G4" },

      { time: 2.9, word: "more", note: "A4" },
      { time: 3.4, word: "more", note: "G4" },
      { time: 3.9, word: "spam", note: "E4" },
      { time: 4.4, word: "keys", note: "C4" },

      { time: 5.0, word: "left", note: "D4" },
      { time: 5.5, word: "up", note: "E4" },
      { time: 6.0, word: "right", note: "G4" },
      { time: 6.5, word: "down", note: "A4" },

      { time: 7.1, word: "jump", note: "C5" },
      { time: 7.6, word: "tap", note: "G4" },
      { time: 8.1, word: "roll", note: "E4" },
      { time: 8.6, word: "dash", note: "C4" },

      { time: 9.2, word: "focus", note: "F4" },
      { time: 9.7, word: "hard", note: "G4" },
      { time: 10.2, word: "mode", note: "A4" },
      { time: 10.7, word: "on", note: "C5" },
    ],
  },

  {
    id: "hard_pattern",
    name: "[Hard] Pattern Burst",
    fallDuration: 2.7, // even faster
    tiles: [
      { time: 0.8, word: "aa", note: "C4" },
      { time: 1.1, word: "ss", note: "D4" },
      { time: 1.4, word: "dd", note: "E4" },
      { time: 1.7, word: "ff", note: "F4" },

      { time: 2.1, word: "jj", note: "G4" },
      { time: 2.4, word: "kk", note: "A4" },
      { time: 2.7, word: "ll", note: "C5" },
      { time: 3.0, word: ";;", note: "B4" },

      { time: 3.5, word: "combo", note: "G4" },
      { time: 3.9, word: "rush", note: "E4" },
      { time: 4.3, word: "stay", note: "D4" },
      { time: 4.7, word: "calm", note: "C4" },

      { time: 5.2, word: "final", note: "E4" },
      { time: 5.6, word: "push", note: "G4" },
      { time: 6.0, word: "gg", note: "A4" },
      { time: 6.4, word: "wp", note: "C5" },
    ],
  },
];
