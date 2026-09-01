import {
  artistNames,
  describeKey,
  formatDuration,
  getDiatonicChords,
  getDiatonicHarmony,
  getFretboardNotes,
  getPentatonicBoxes,
  getPentatonicPitchClasses,
  getScaleFretboardNotes,
  getScaleNotes,
  scaleCoordinates,
} from "./music";

describe("music utilities", () => {
  it("formats duration and artists for display", () => {
    expect(formatDuration(185000)).toBe("3:05");
    expect(artistNames([{ name: "One" }, { name: "Two" }])).toBe("One, Two");
  });

  it("maps Spotify pitch classes and modes", () => {
    expect(describeKey({ key: 9, mode: 1 })).toBe("A major");
    expect(describeKey({ key: 3, mode: 0 })).toBe("E♭ minor");
    expect(scaleCoordinates({ key: 1, mode: 1 })).toEqual({
      folder: "CSharp",
      mode: "major",
    });
  });

  it("does not guess when key data is missing", () => {
    expect(describeKey(null)).toBe("Unavailable");
    expect(describeKey({ key: -1, mode: 1 })).toBe("Unavailable");
    expect(scaleCoordinates(null)).toBeNull();
  });

  it("builds chords and guitar positions from music theory instead of image files", () => {
    const eMajor = { key: 4, mode: 1 };

    expect(getDiatonicChords(eMajor)).toEqual([
      { numeral: "I", name: "Emaj" },
      { numeral: "ii", name: "F♯min" },
      { numeral: "iii", name: "G♯min" },
      { numeral: "IV", name: "Amaj" },
      { numeral: "V", name: "Bmaj" },
      { numeral: "vi", name: "C♯min" },
      { numeral: "vii°", name: "D♯dim" },
    ]);
    expect(getPentatonicPitchClasses(eMajor)).toEqual([4, 6, 8, 11, 1]);
    expect(getPentatonicBoxes(eMajor).map(({ startFret, endFret }) => [startFret, endFret]))
      .toEqual([[11, 14], [1, 5], [4, 7], [6, 9], [9, 12]]);
    expect(getFretboardNotes(eMajor, 1, 17)).toContainEqual({
      stringIndex: 0,
      fret: 12,
      root: true,
    });
  });

  it("generates complete references for every Spotify key and both modes", () => {
    for (let key = 0; key < 12; key += 1) {
      for (const mode of [0, 1]) {
        const audioFeature = { key, mode };
        expect(getDiatonicChords(audioFeature)).toHaveLength(7);
        expect(getPentatonicPitchClasses(audioFeature)).toHaveLength(5);
        expect(getPentatonicBoxes(audioFeature)).toHaveLength(5);
        expect(getPentatonicBoxes(audioFeature).every((box) => box.notes.length > 0)).toBe(true);
        expect(getFretboardNotes(audioFeature, 1, 17).length).toBeGreaterThan(0);
        expect(getScaleNotes(audioFeature)).toHaveLength(7);
        expect(getScaleFretboardNotes(audioFeature, 1, 17).length).toBeGreaterThan(0);
        expect(getDiatonicHarmony(audioFeature)).toHaveLength(7);
      }
    }
  });

  it("builds chord tones and transferable scale labels for solo practice", () => {
    const aMinor = { key: 9, mode: 0 };

    expect(getScaleNotes(aMinor).map(({ degree, name }) => ({ degree, name }))).toEqual([
      { degree: "1", name: "A" },
      { degree: "2", name: "B" },
      { degree: "♭3", name: "C" },
      { degree: "4", name: "D" },
      { degree: "5", name: "E" },
      { degree: "♭6", name: "F" },
      { degree: "♭7", name: "G" },
    ]);
    expect(getDiatonicHarmony(aMinor)[0].tones.map(({ name, role }) => [name, role])).toEqual([
      ["A", "Root"],
      ["C", "Third"],
      ["E", "Fifth"],
      ["G", "Seventh"],
    ]);
  });
});
