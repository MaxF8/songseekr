const KEYS = [
  "C",
  "C♯ / D♭",
  "D",
  "E♭",
  "E",
  "F",
  "F♯ / G♭",
  "G",
  "A♭",
  "A",
  "B♭",
  "B",
];

const SCALE_FOLDERS = [
  "C",
  "CSharp",
  "D",
  "EFlat",
  "E",
  "F",
  "FSharp",
  "G",
  "AFlat",
  "A",
  "BFlat",
  "B",
];

const MAJOR_SCALES = [
  ["C", "D", "E", "F", "G", "A", "B"],
  ["C♯", "D♯", "E♯", "F♯", "G♯", "A♯", "B♯"],
  ["D", "E", "F♯", "G", "A", "B", "C♯"],
  ["E♭", "F", "G", "A♭", "B♭", "C", "D"],
  ["E", "F♯", "G♯", "A", "B", "C♯", "D♯"],
  ["F", "G", "A", "B♭", "C", "D", "E"],
  ["F♯", "G♯", "A♯", "B", "C♯", "D♯", "E♯"],
  ["G", "A", "B", "C", "D", "E", "F♯"],
  ["A♭", "B♭", "C", "D♭", "E♭", "F", "G"],
  ["A", "B", "C♯", "D", "E", "F♯", "G♯"],
  ["B♭", "C", "D", "E♭", "F", "G", "A"],
  ["B", "C♯", "D♯", "E", "F♯", "G♯", "A♯"],
];

const MINOR_SCALES = [
  ["C", "D", "E♭", "F", "G", "A♭", "B♭"],
  ["C♯", "D♯", "E", "F♯", "G♯", "A", "B"],
  ["D", "E", "F", "G", "A", "B♭", "C"],
  ["E♭", "F", "G♭", "A♭", "B♭", "C♭", "D♭"],
  ["E", "F♯", "G", "A", "B", "C", "D"],
  ["F", "G", "A♭", "B♭", "C", "D♭", "E♭"],
  ["F♯", "G♯", "A", "B", "C♯", "D", "E"],
  ["G", "A", "B♭", "C", "D", "E♭", "F"],
  ["A♭", "B♭", "C♭", "D♭", "E♭", "F♭", "G♭"],
  ["A", "B", "C", "D", "E", "F", "G"],
  ["B♭", "C", "D♭", "E♭", "F", "G♭", "A♭"],
  ["B", "C♯", "D", "E", "F♯", "G", "A"],
];

const MAJOR_PENTATONIC_INTERVALS = [0, 2, 4, 7, 9];
const MINOR_PENTATONIC_INTERVALS = [0, 3, 5, 7, 10];
const GUITAR_STRING_PITCHES = [4, 11, 7, 2, 9, 4];

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

export function describeKey(audioFeature) {
  if (!audioFeature || !Number.isInteger(audioFeature.key)) return "Unavailable";
  const key = KEYS[audioFeature.key];
  if (!key) return "Unavailable";
  return `${key} ${audioFeature.mode === 1 ? "major" : "minor"}`;
}

export function formatDuration(durationMs) {
  const totalSeconds = Math.max(0, Math.round((Number(durationMs) || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function scaleCoordinates(audioFeature) {
  if (!audioFeature || !Number.isInteger(audioFeature.key)) return null;
  const folder = SCALE_FOLDERS[audioFeature.key];
  if (!folder) return null;
  return {
    folder,
    mode: audioFeature.mode === 1 ? "major" : "minor",
  };
}

export function getDiatonicChords(audioFeature) {
  if (!audioFeature || !Number.isInteger(audioFeature.key) || !KEYS[audioFeature.key]) return [];

  const major = audioFeature.mode === 1;
  const names = major ? MAJOR_SCALES[audioFeature.key] : MINOR_SCALES[audioFeature.key];
  const numerals = major
    ? ["I", "ii", "iii", "IV", "V", "vi", "vii°"]
    : ["i", "ii°", "III", "iv", "v", "VI", "VII"];
  const qualities = major
    ? ["maj", "min", "min", "maj", "maj", "min", "dim"]
    : ["min", "dim", "maj", "min", "min", "maj", "maj"];

  return names.map((note, index) => ({
    numeral: numerals[index],
    name: `${note}${qualities[index]}`,
  }));
}

export function getPentatonicPitchClasses(audioFeature) {
  if (!audioFeature || !Number.isInteger(audioFeature.key) || !KEYS[audioFeature.key]) return [];
  const intervals = audioFeature.mode === 1
    ? MAJOR_PENTATONIC_INTERVALS
    : MINOR_PENTATONIC_INTERVALS;
  return intervals.map((interval) => positiveModulo(audioFeature.key + interval, 12));
}

export function getFretboardNotes(audioFeature, startFret = 1, endFret = 17) {
  const pitchClasses = getPentatonicPitchClasses(audioFeature);
  if (pitchClasses.length === 0) return [];

  return GUITAR_STRING_PITCHES.flatMap((openPitch, stringIndex) =>
    Array.from({ length: endFret - startFret + 1 }, (_, offset) => {
      const fret = startFret + offset;
      const pitchClass = positiveModulo(openPitch + fret, 12);
      return pitchClasses.includes(pitchClass)
        ? { stringIndex, fret, root: pitchClass === audioFeature.key }
        : null;
    }).filter(Boolean)
  );
}

export function getPentatonicBoxes(audioFeature) {
  if (!audioFeature || !Number.isInteger(audioFeature.key) || !KEYS[audioFeature.key]) return [];

  const relativeMinor = audioFeature.mode === 1
    ? positiveModulo(audioFeature.key + 9, 12)
    : audioFeature.key;
  const relativeMinorFret = positiveModulo(relativeMinor - GUITAR_STRING_PITCHES[5], 12);
  const minorWindows = [
    [0, 3],
    [2, 5],
    [4, 8],
    [7, 10],
    [9, 12],
  ];
  const order = audioFeature.mode === 1 ? [1, 2, 3, 4, 0] : [0, 1, 2, 3, 4];

  return order.map((windowIndex, index) => {
    let [startFret, endFret] = minorWindows[windowIndex].map(
      (offset) => relativeMinorFret + offset
    );

    while (startFret > 12) {
      startFret -= 12;
      endFret -= 12;
    }

    return {
      position: index + 1,
      startFret,
      endFret,
      notes: getFretboardNotes(audioFeature, startFret, endFret),
    };
  });
}

export function artistNames(artists = []) {
  return artists.map((artist) => artist.name).join(", ") || "Unknown artist";
}
