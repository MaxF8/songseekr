const STRING_LABELS = ["E", "B", "G", "D", "A", "E"];
const STRING_PITCHES = [4, 11, 7, 2, 9, 4];
const FRET_WIDTH = 44;
const STRING_GAP = 28;
const GRID_LEFT = 34;
const GRID_TOP = 20;

function modulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

export default function SoloFretboard({
  endFret = 17,
  label,
  labelMode = "degrees",
  notes = [],
  startFret = 1,
  targetPitchClass = null,
  toneLabels = new Map(),
}) {
  const fretCount = endFret - startFret + 1;
  const gridWidth = fretCount * FRET_WIDTH;
  const gridHeight = STRING_GAP * (STRING_LABELS.length - 1);
  const width = GRID_LEFT + gridWidth + 12;
  const height = GRID_TOP + gridHeight + 35;
  const titleId = `solo-fretboard-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;

  return (
    <svg
      className="solo-fretboard"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={titleId}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>{label}</title>

      {STRING_LABELS.map((string, index) => {
        const y = GRID_TOP + index * STRING_GAP;
        return (
          <g key={`${string}-${index}`}>
            <text className="solo-fretboard__axis-label" x="5" y={y + 5}>{string}</text>
            <line
              className="solo-fretboard__string"
              x1={GRID_LEFT}
              x2={GRID_LEFT + gridWidth}
              y1={y}
              y2={y}
            />
          </g>
        );
      })}

      {Array.from({ length: fretCount + 1 }, (_, index) => {
        const x = GRID_LEFT + index * FRET_WIDTH;
        return (
          <line
            className={index === 0 && startFret === 0
              ? "solo-fretboard__nut"
              : "solo-fretboard__fret"}
            key={`fret-${startFret + index}`}
            x1={x}
            x2={x}
            y1={GRID_TOP}
            y2={GRID_TOP + gridHeight}
          />
        );
      })}

      {notes.map((note) => {
        const x = GRID_LEFT + (note.fret - startFret + 0.5) * FRET_WIDTH;
        const y = GRID_TOP + note.stringIndex * STRING_GAP;
        const isTarget = note.pitchClass === targetPitchClass;
        const toneLabel = toneLabels.get(note.pitchClass);
        const text = toneLabel || (labelMode === "notes" ? note.name : note.degree);
        const classes = [
          "solo-fretboard__note",
          note.pentatonic ? "solo-fretboard__note--safe" : "solo-fretboard__note--color",
          note.root ? "solo-fretboard__note--root" : "",
          isTarget ? "solo-fretboard__note--target" : "",
        ].filter(Boolean).join(" ");

        return (
          <g key={`note-${note.stringIndex}-${note.fret}`}>
            <circle className={classes} cx={x} cy={y} r="10" />
            {labelMode !== "dots" || toneLabel ? (
              <text
                className="solo-fretboard__note-label"
                x={x}
                y={y + 3.5}
                textAnchor="middle"
              >
                {text}
              </text>
            ) : null}
          </g>
        );
      })}

      {Array.from({ length: fretCount }, (_, index) => {
        const fret = startFret + index;
        return (
          <text
            className="solo-fretboard__axis-label"
            key={`label-${fret}`}
            x={GRID_LEFT + (index + 0.5) * FRET_WIDTH}
            y={GRID_TOP + gridHeight + 25}
            textAnchor="middle"
          >
            {fret === 0 ? "O" : fret}
          </text>
        );
      })}
    </svg>
  );
}

export function notesForPitchClasses(notes, pitchClasses) {
  const allowed = new Set(pitchClasses);
  return notes.filter((note) => allowed.has(note.pitchClass));
}

export function pitchClassAt(stringIndex, fret) {
  return modulo(STRING_PITCHES[stringIndex] + fret, 12);
}
