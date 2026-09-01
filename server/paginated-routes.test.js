const assert = require("node:assert/strict");
const test = require("node:test");

process.env.CLIENT_ID ||= "pagination-test-client";
process.env.CLIENT_SECRET ||= "pagination-test-secret";

const app = require("./app");

function spotifyResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("every paginated API survives unavailable Spotify entries on late pages", async (t) => {
  const realFetch = global.fetch;
  const upstreamRequests = [];
  global.fetch = async (input, options) => {
    const url = String(input);
    if (!url.startsWith("https://")) return realFetch(input, options);
    upstreamRequests.push(url);

    if (url === "https://accounts.spotify.com/api/token") {
      return spotifyResponse({ access_token: "client-token", expires_in: 3600 });
    }
    if (url.includes("/audio-features?")) {
      return spotifyResponse({ audio_features: [null] });
    }
    if (url.includes("/me/playlists?")) {
      return spotifyResponse({
        items: [null, { id: "playlist1", images: null }],
        total: 120,
        limit: 24,
        offset: 96,
      });
    }
    if (url.includes("/me/albums?")) {
      return spotifyResponse({
        items: [null, { album: null }, { album: { id: "album1", artists: null, images: null } }],
        total: 120,
        limit: 24,
        offset: 96,
      });
    }
    if (url.includes("/me/tracks?")) {
      return spotifyResponse({
        items: [null, { track: null }, { track: { id: "track1", artists: null } }],
        total: 120,
        limit: 24,
        offset: 96,
      });
    }
    if (url.endsWith("/playlists/playlist1")) {
      return spotifyResponse({ id: "playlist1", images: null });
    }
    if (url.includes("/playlists/playlist1/items?")) {
      return spotifyResponse({
        items: [null, { item: null }, { item: { type: "episode" } }, { item: { id: "track2", type: "track", artists: null } }],
        total: 80,
        limit: 16,
        offset: 64,
      });
    }
    if (url.endsWith("/albums/album1")) {
      return spotifyResponse({ id: "album1", artists: null, images: null });
    }
    if (url.includes("/albums/album1/tracks?")) {
      return spotifyResponse({
        items: [null, { id: "track3", artists: null }],
        total: 80,
        limit: 16,
        offset: 64,
      });
    }
    return spotifyResponse({ error: { message: `Unexpected test URL: ${url}` } }, 500);
  };
  t.after(() => {
    global.fetch = realFetch;
  });

  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const { port } = server.address();
  const origin = `http://127.0.0.1:${port}`;
  const cookie = `songseekr_access=user-token; songseekr_expires=${Date.now() + 3600000}`;
  const request = (path) => realFetch(`${origin}${path}`, { headers: { cookie } });

  const cases = [
    ["/api/me/playlists", 24, "playlist1"],
    ["/api/me/albums", 24, "album1"],
    ["/api/me/tracks", 24, "track1"],
    ["/api/playlists/playlist1/items", 16, "track2"],
    ["/api/albums/album1", 16, "track3"],
  ];

  for (const [route, limit, expectedId] of cases) {
    for (let page = 1; page <= 5; page += 1) {
      const path = `${route}?limit=${limit}&offset=${(page - 1) * limit}`;
      const response = await request(path);
      const body = await response.json();
      assert.equal(response.status, 200, `${path}: ${JSON.stringify(body)}`);
      assert.deepEqual(body.items.map((item) => item.id), [expectedId]);
      assert.ok(body.total > 0);
    }
  }

  assert.ok(upstreamRequests.some((url) => url.includes("/me/playlists?limit=24&offset=72")));
  assert.ok(upstreamRequests.some((url) => url.includes("/me/playlists?limit=24&offset=96")));
  assert.ok(upstreamRequests.some((url) => url.includes("/me/albums?limit=24&offset=96")));
  assert.ok(upstreamRequests.some((url) => url.includes("/me/tracks?limit=24&offset=96")));
  assert.ok(upstreamRequests.some((url) => url.includes("/items?limit=16&offset=64")));
  assert.ok(upstreamRequests.some((url) => url.includes("/tracks?limit=16&offset=64")));
});
