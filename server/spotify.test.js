const assert = require("node:assert/strict");
const test = require("node:test");

const {
  addFeatures,
  assertSpotifyId,
  normalizeAlbum,
  normalizeFeature,
  normalizePlaylist,
  normalizePlaylistEntry,
  normalizeSavedAlbumEntry,
  normalizeSavedTrackEntry,
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
  assert.equal(normalizePlaylistEntry({ item: { type: "show" } }), null);
  assert.equal(normalizePlaylistEntry({ item: null }), null);
  assert.equal(normalizePlaylistEntry(null), null);
});

test("playlist normalization tolerates unavailable collection entries", () => {
  assert.deepEqual(normalizePlaylist(null), {
    id: null,
    name: "Untitled playlist",
    image: null,
    spotifyUrl: null,
    owner: null,
    total: null,
  });

  assert.deepEqual(normalizePlaylist({ id: "playlist123", images: null }), {
    id: "playlist123",
    name: "Untitled playlist",
    image: null,
    spotifyUrl: null,
    owner: null,
    total: null,
  });
});

test("track and feature normalization use safe fallbacks", () => {
  assert.deepEqual(normalizeFeature({ key: -1, mode: 1 }), null);
  assert.deepEqual(normalizeFeature({ key: 9, mode: 0 }), {
    key: 9,
    mode: 0,
    tempo: null,
    timeSignature: null,
  });
  assert.deepEqual(normalizeFeature({ key: 4, mode: 1, tempo: 124.5, time_signature: 4 }), {
    key: 4,
    mode: 1,
    tempo: 124.5,
    timeSignature: 4,
  });
  assert.equal(normalizeTrack({}).name, "Unavailable track");
  assert.deepEqual(normalizeTrack(null).artists, []);
  assert.deepEqual(normalizeTrack({ artists: {}, album: { images: null } }).artists, []);
  assert.equal(normalizeTrack({ album: null }).album, null);
});

test("album and saved-library normalization tolerate unavailable entries", () => {
  assert.equal(normalizeAlbum(null).id, null);
  assert.deepEqual(normalizeAlbum({ artists: null, images: null }).artists, []);
  assert.equal(normalizeSavedAlbumEntry(null).id, null);
  assert.equal(normalizeSavedAlbumEntry({ album: null }).id, null);
  assert.equal(normalizeSavedTrackEntry(null).id, null);
  assert.equal(normalizeSavedTrackEntry({ track: null }).id, null);
});

test("feature attachment tolerates missing and malformed inputs", () => {
  assert.deepEqual(addFeatures(null, null), []);
  assert.deepEqual(addFeatures([{ id: "track1" }], { features: null }), [
    { id: "track1", audioFeature: null },
  ]);
});
