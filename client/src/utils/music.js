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

export function artistNames(artists = []) {
  return artists.map((artist) => artist.name).join(", ") || "Unknown artist";
}
