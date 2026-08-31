const assert = require("node:assert/strict");
const test = require("node:test");

const app = require("./app");
const vercelHandler = require("../api/index");

test("health and anonymous session routes return secure, predictable responses", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const origin = `http://127.0.0.1:${address.port}`;
  const [health, session] = await Promise.all([
    fetch(`${origin}/api/health`),
    fetch(`${origin}/api/session`),
  ]);

  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });
  assert.equal(health.headers.get("x-content-type-options"), "nosniff");
  assert.equal(health.headers.get("x-frame-options"), "DENY");
  assert.deepEqual(await session.json(), { authenticated: false });
});

test("Spotify auth accepts the legacy REDIRECT_URI setting", async (t) => {
  const previous = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
    redirectUri: process.env.REDIRECT_URI,
  };
  process.env.CLIENT_ID = "test-client-id";
  process.env.CLIENT_SECRET = "test-client-secret";
  delete process.env.SPOTIFY_REDIRECT_URI;
  process.env.REDIRECT_URI = "http://127.0.0.1:3000/api/auth/callback";
  t.after(() => {
    for (const [key, value] of Object.entries({
      CLIENT_ID: previous.clientId,
      CLIENT_SECRET: previous.clientSecret,
      SPOTIFY_REDIRECT_URI: previous.spotifyRedirectUri,
      REDIRECT_URI: previous.redirectUri,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/api/auth/start`, {
    redirect: "manual",
  });
  const location = new URL(response.headers.get("location"));
  assert.equal(location.searchParams.get("redirect_uri"), process.env.REDIRECT_URI);
});

test("Vercel API wrapper restores the rewritten API path", async (t) => {
  const server = require("node:http").createServer(vercelHandler);
  server.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/api?path=health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});
