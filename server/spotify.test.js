const assert = require("node:assert/strict");
const test = require("node:test");

const {
  assertSpotifyId,
  normalizeFeature,
  normalizePlaylistEntry,
  normalizeTrack,
  SpotifyError,
} = require("./spotify");

test("assertSpotifyId accepts Spotify IDs and rejects path injection", () => {
  assert.equal(assertSpotifyId("4uLU6hMCjMI75M1A2tKUQC"), "4uLU6hMCjMI75M1A2tKUQC");
  assert.throws(() => assertSpotifyId("../me"), SpotifyError);
});

test("playlist normalization supports the current item field and filters episodes", () => {
  const track = normalizePlaylistEntry({
    item: {
      id: "track123",
      type: "track",
      name: "A track",
      duration_ms: 61000,
      artists: [{ id: "artist1", name: "Artist" }],
    },
  });

  assert.equal(track.id, "track123");
  assert.equal(track.durationMs, 61000);
  assert.equal(normalizePlaylistEntry({ item: { type: "episode" } }), null);
});

test("track and feature normalization use safe fallbacks", () => {
  assert.deepEqual(normalizeFeature({ key: -1, mode: 1 }), null);
  assert.deepEqual(normalizeFeature({ key: 9, mode: 0 }), { key: 9, mode: 0 });
  assert.equal(normalizeTrack({}).name, "Unavailable track");
});
