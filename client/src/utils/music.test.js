import { artistNames, describeKey, formatDuration, scaleCoordinates } from "./music";

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
});
