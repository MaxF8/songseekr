import {
  getDiatonicChords,
  getFretboardNotes,
  getPentatonicBoxes,
  getScaleNotes,
} from "../../utils/music";

const STRING_LABELS = ["E", "B", "G", "D", "A", "E"];
const FRET_WIDTH = 42;
const STRING_GAP = 24;
const GRID_LEFT = 30;
const GRID_TOP = 18;
const STRING_PITCHES = [4, 11, 7, 2, 9, 4];

function addScaleLabels(audioFeature, notes) {
  const noteByPitchClass = new Map(getScaleNotes(audioFeature).map((note) => [note.pitchClass, note]));
  return notes.map((note) => {
    const pitchClass = (STRING_PITCHES[note.stringIndex] + note.fret) % 12;
    return { ...note, ...noteByPitchClass.get(pitchClass) };
  });
}

function FretboardSvg({ endFret, label, labelMode = "dots", notes, startFret, showInlays = false }) {
  const fretCount = endFret - startFret + 1;
  const gridWidth = fretCount * FRET_WIDTH;
  const gridHeight = STRING_GAP * (STRING_LABELS.length - 1);
  const width = GRID_LEFT + gridWidth + 10;
  const height = GRID_TOP + gridHeight + 34;
  const titleId = `fretboard-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
  const inlayFrets = [3, 5, 7, 9, 12, 15, 17].filter(
    (fret) => fret >= startFret && fret <= endFret
  );

  return (
    <svg
      className="fretboard"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={titleId}
      preserveAspectRatio="xMinYMid meet"
    >
      <title id={titleId}>{label}</title>

      {STRING_LABELS.map((string, index) => {
        const y = GRID_TOP + index * STRING_GAP;
        return (
          <g key={`${string}-${index}`}>
            <text className="fretboard__string-label" x="4" y={y + 5}>
              {string}
            </text>
            <line
              className="fretboard__string"
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
            className={index === 0 && startFret === 0 ? "fretboard__nut" : "fretboard__fret"}
            key={`fret-${startFret + index}`}
            x1={x}
            x2={x}
            y1={GRID_TOP}
            y2={GRID_TOP + gridHeight}
          />
        );
      })}

      {showInlays &&
        inlayFrets.flatMap((fret) => {
          const x = GRID_LEFT + (fret - startFret + 0.5) * FRET_WIDTH;
          const ys = fret === 12
            ? [GRID_TOP + STRING_GAP * 1.5, GRID_TOP + STRING_GAP * 3.5]
            : [GRID_TOP + STRING_GAP * 2.5];
          return ys.map((y, index) => (
            <circle
              className="fretboard__inlay"
              key={`inlay-${fret}-${index}`}
              cx={x}
              cy={y}
              r="6"
            />
          ));
        })}

      {notes.map((note) => {
        const x = GRID_LEFT + (note.fret - startFret + 0.5) * FRET_WIDTH;
        const y = GRID_TOP + note.stringIndex * STRING_GAP;
        const noteLabel = labelMode === "notes" ? note.name : note.degree;
        return (
          <g key={`note-${note.stringIndex}-${note.fret}`}>
            <circle
              className={note.root ? "fretboard__note fretboard__note--root" : "fretboard__note"}
              cx={x}
              cy={y}
              r="8"
            />
            {labelMode !== "dots" ? (
              <text
                className={note.root
                  ? "fretboard__note-label fretboard__note-label--root"
                  : "fretboard__note-label"}
                x={x}
                y={y + 3}
                textAnchor="middle"
              >
                {noteLabel}
              </text>
            ) : null}
          </g>
        );
      })}

      {Array.from({ length: fretCount }, (_, index) => {
        const fret = startFret + index;
        return (
          <text
            className="fretboard__fret-label"
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

export function ChordsInKey({ audioFeature }) {
  const chords = getDiatonicChords(audioFeature);

  return (
    <div className="chord-diagram">
      <table>
        <caption className="sr-only">Diatonic chords in this key</caption>
        <thead>
          <tr>
            {chords.map((chord) => (
              <th key={chord.numeral} scope="col">{chord.numeral}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {chords.map((chord) => (
              <td key={chord.numeral}>{chord.name}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function PentatonicShapes({ audioFeature, labelMode = "dots" }) {
  const boxes = getPentatonicBoxes(audioFeature);

  return (
    <div className="pentatonic-boxes">
      {boxes.map((box) => (
        <figure className="pentatonic-box" key={box.position}>
          <figcaption>Position {box.position}</figcaption>
          <FretboardSvg
            startFret={box.startFret}
            endFret={box.endFret}
            labelMode={labelMode}
            notes={addScaleLabels(audioFeature, box.notes)}
            label={`Pentatonic position ${box.position}, frets ${box.startFret} through ${box.endFret}`}
          />
        </figure>
      ))}
    </div>
  );
}

export function PentatonicFretboard({ audioFeature, labelMode = "dots" }) {
  return (
    <div className="full-fretboard">
      <FretboardSvg
        startFret={1}
        endFret={17}
        labelMode={labelMode}
        notes={addScaleLabels(audioFeature, getFretboardNotes(audioFeature, 1, 17))}
        label="Pentatonic notes across frets 1 through 17"
        showInlays
      />
    </div>
  );
}
