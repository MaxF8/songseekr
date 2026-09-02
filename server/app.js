const crypto = require("crypto");
const express = require("express");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const path = require("path");

const {
  SpotifyError,
  addFeatures,
  assertSpotifyId,
  exchangeAuthorizationCode,
  getAudioFeatures,
  getClientAccessToken,
  getUserAccessToken,
  normalizeAlbum,
  normalizePlaylist,
  normalizePlaylistEntry,
  normalizeSavedAlbumEntry,
  normalizeSavedTrackEntry,
  normalizeTrack,
  spotifyRequest,
  spotifyUserRequest,
} = require("./spotify");
const {
  STATE_COOKIE,
  RETURN_COOKIE,
  clearCookie,
  clearTokenCookies,
  getCookies,
  setCookie,
  setTokenCookies,
} = require("./cookies");
const { pageItems, pageParameters, pageResponse } = require("./pagination");

const app = express();
const clientBuild = path.resolve(__dirname, "../client/build");

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://i.scdn.co",
          "https://*.scdn.co",
          "https://*.spotifycdn.com",
        ],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'", "https://accounts.spotify.com"],
      },
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
app.use(express.json({ limit: "10kb" }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again shortly." },
});
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please try again later." },
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function getRequestOrigin(req) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const forwardedProtocol = req.headers["x-forwarded-proto"];
  let host = String(forwardedHost || req.get("host") || "127.0.0.1:3001").split(",")[0];
  const protocol = String(forwardedProtocol || req.protocol || "http").split(",")[0];
  if (host.startsWith("localhost")) host = host.replace("localhost", "127.0.0.1");
  return `${protocol}://${host}`;
}

function getRedirectUri(req) {
  return (
    process.env.SPOTIFY_REDIRECT_URI?.trim() ||
    // Keep the original variable name working for existing local and hosted deployments.
    process.env.REDIRECT_URI?.trim() ||
    `${getRequestOrigin(req)}/api/auth/callback`
  );
}

function safeReturnPath(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/";
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get(
  "/api/auth/start",
  asyncRoute(async (req, res) => {
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
      throw new SpotifyError("Spotify server credentials are not configured", 503);
    }

    const state = crypto.randomBytes(24).toString("hex");
    const redirectUri = getRedirectUri(req);
    setCookie(req, res, STATE_COOKIE, state, {
      path: "/api/auth",
      maxAge: 10 * 60,
    });
    setCookie(req, res, RETURN_COOKIE, safeReturnPath(req.query.returnTo), {
      path: "/api/auth",
      maxAge: 10 * 60,
    });

    const params = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: "user-library-read playlist-read-private",
      state,
    });
    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
  })
);

app.get(
  "/api/auth/callback",
  asyncRoute(async (req, res) => {
    const cookies = getCookies(req);
    const state = typeof req.query.state === "string" ? req.query.state : "";
    const code = typeof req.query.code === "string" ? req.query.code : "";
    const expectedState = cookies[STATE_COOKIE] || "";
    const returnTo = safeReturnPath(cookies[RETURN_COOKIE]);
    clearCookie(req, res, STATE_COOKIE, "/api/auth");
    clearCookie(req, res, RETURN_COOKIE, "/api/auth");

    const statesMatch =
      state.length === expectedState.length &&
      state.length > 0 &&
      crypto.timingSafeEqual(Buffer.from(state), Buffer.from(expectedState));
    if (!statesMatch) {
      return res.redirect("/?auth_error=state_mismatch");
    }
    if (!code) {
      return res.redirect("/?auth_error=access_denied");
    }

    try {
      const tokenResponse = await exchangeAuthorizationCode(code, getRedirectUri(req));
      setTokenCookies(req, res, tokenResponse);
      return res.redirect(returnTo);
    } catch {
      clearTokenCookies(req, res);
      return res.redirect("/?auth_error=token_exchange_failed");
    }
  })
);

app.get(
  "/api/session",
  asyncRoute(async (req, res) => {
    try {
      await getUserAccessToken(req, res);
      res.json({ authenticated: true });
    } catch (error) {
      if (error instanceof SpotifyError && error.status === 401) {
        return res.json({ authenticated: false });
      }
      throw error;
    }
  })
);

app.post("/api/logout", (req, res) => {
  clearTokenCookies(req, res);
  res.status(204).end();
});

app.get(
  "/api/search",
  asyncRoute(async (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (query.length < 1 || query.length > 100) {
      throw new SpotifyError("Search query must be between 1 and 100 characters", 400);
    }

    const accessToken = await getClientAccessToken();
    const params = new URLSearchParams({ q: query, type: "album,track", limit: "6" });
    const body = await spotifyRequest(`/search?${params}`, accessToken);
    const tracks = pageItems(body?.tracks).map(normalizeTrack).filter((track) => track.id);
    const albums = pageItems(body?.albums).map(normalizeAlbum).filter((album) => album.id);
    const featureResult = await getAudioFeatures(
      tracks.map((track) => track.id),
      accessToken
    );

    res.json({
      tracks: addFeatures(tracks, featureResult),
      albums,
      audioFeaturesAvailable: featureResult.available,
    });
  })
);

app.get(
  "/api/tracks/:trackId",
  asyncRoute(async (req, res) => {
    const trackId = assertSpotifyId(req.params.trackId);
    const accessToken = await getClientAccessToken();
    const [trackBody, featureResult] = await Promise.all([
      spotifyRequest(`/tracks/${trackId}`, accessToken),
      getAudioFeatures([trackId], accessToken),
    ]);
    const [track] = addFeatures([normalizeTrack(trackBody)], featureResult);
    res.json({ track, audioFeaturesAvailable: featureResult.available });
  })
);

app.get(
  "/api/albums/:albumId",
  asyncRoute(async (req, res) => {
    const albumId = assertSpotifyId(req.params.albumId);
    const { limit, offset } = pageParameters(req.query, 16, 50);
    const accessToken = await getClientAccessToken();
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    const [albumBody, tracksBody] = await Promise.all([
      spotifyRequest(`/albums/${albumId}`, accessToken),
      spotifyRequest(`/albums/${albumId}/tracks?${params}`, accessToken),
    ]);
    const tracks = pageItems(tracksBody).map(normalizeTrack).filter((track) => track.id);
    const featureResult = await getAudioFeatures(
      tracks.map((track) => track.id),
      accessToken
    );

    res.json({
      album: normalizeAlbum(albumBody),
      ...pageResponse(tracksBody, addFeatures(tracks, featureResult), { limit, offset }),
      audioFeaturesAvailable: featureResult.available,
    });
  })
);

app.get(
  "/api/me/playlists",
  asyncRoute(async (req, res) => {
    const { limit, offset } = pageParameters(req.query);
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    const body = await spotifyUserRequest(req, res, `/me/playlists?${params}`);
    const items = (await Promise.all(
      pageItems(body).map(async (playlist) => {
        const item = normalizePlaylist(playlist);
        if (!item.id || item.total !== 0) return item;

        try {
          const itemPage = await spotifyUserRequest(
            req,
            res,
            `/playlists/${item.id}/items?limit=1&offset=0`
          );
          const total = Number(itemPage?.total);
          return Number.isSafeInteger(total) && total >= 0 ? { ...item, total } : item;
        } catch {
          return item;
        }
      })
    )).filter((item) => item.id);
    res.json(pageResponse(body, items, { limit, offset }));
  })
);

app.get(
  "/api/me/albums",
  asyncRoute(async (req, res) => {
    const { limit, offset } = pageParameters(req.query);
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    const body = await spotifyUserRequest(req, res, `/me/albums?${params}`);
    const items = pageItems(body)
      .map(normalizeSavedAlbumEntry)
      .filter((item) => item.id);
    res.json(pageResponse(body, items, { limit, offset }));
  })
);

app.get(
  "/api/me/tracks",
  asyncRoute(async (req, res) => {
    const { limit, offset } = pageParameters(req.query);
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    let accessToken = await getUserAccessToken(req, res);
    let body;
    try {
      body = await spotifyRequest(`/me/tracks?${params}`, accessToken);
    } catch (error) {
      if (!(error instanceof SpotifyError) || error.status !== 401) throw error;
      accessToken = await getUserAccessToken(req, res, true);
      body = await spotifyRequest(`/me/tracks?${params}`, accessToken);
    }
    const tracks = pageItems(body)
      .map(normalizeSavedTrackEntry)
      .filter((track) => track.id);
    const featureResult = await getAudioFeatures(
      tracks.map((track) => track.id),
      accessToken
    );
    res.json({
      ...pageResponse(body, addFeatures(tracks, featureResult), { limit, offset }),
      audioFeaturesAvailable: featureResult.available,
    });
  })
);

app.get(
  "/api/playlists/:playlistId/items",
  asyncRoute(async (req, res) => {
    const playlistId = assertSpotifyId(req.params.playlistId);
    const { limit, offset } = pageParameters(req.query, 16, 50);
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    let accessToken = await getUserAccessToken(req, res);

    const requestPlaylist = async (token) => {
      const playlistPromise = spotifyRequest(`/playlists/${playlistId}`, token);
      const itemsPromise = spotifyRequest(`/playlists/${playlistId}/items?${params}`, token).catch(
        (error) => {
          if (!(error instanceof SpotifyError) || error.status !== 404) throw error;
          return spotifyRequest(`/playlists/${playlistId}/tracks?${params}`, token);
        }
      );
      return Promise.all([playlistPromise, itemsPromise]);
    };

    let playlistBody;
    let itemsBody;
    try {
      [playlistBody, itemsBody] = await requestPlaylist(accessToken);
    } catch (error) {
      if (!(error instanceof SpotifyError) || error.status !== 401) throw error;
      accessToken = await getUserAccessToken(req, res, true);
      [playlistBody, itemsBody] = await requestPlaylist(accessToken);
    }
    const tracks = pageItems(itemsBody)
      .map(normalizePlaylistEntry)
      .filter((track) => track?.id);
    const featureResult = await getAudioFeatures(
      tracks.map((track) => track.id),
      accessToken
    );

    res.json({
      playlist: normalizePlaylist(playlistBody),
      ...pageResponse(itemsBody, addFeatures(tracks, featureResult), { limit, offset }),
      audioFeaturesAvailable: featureResult.available,
    });
  })
);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use(
  "/assets",
  express.static(path.join(clientBuild, "assets"), {
    index: false,
    maxAge: "1y",
    immutable: true,
  })
);
app.use(express.static(clientBuild, { index: false, maxAge: "1h" }));
app.use((req, res, next) => {
  if (!["GET", "HEAD"].includes(req.method)) return next();
  res.setHeader("Cache-Control", "no-cache");
  return res.sendFile(path.join(clientBuild, "index.html"));
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof SpotifyError) {
    if (error.retryAfter) res.setHeader("Retry-After", error.retryAfter);
    return res.status(error.status).json({
      error: error.message,
      code: error.status === 429 ? "SPOTIFY_RATE_LIMIT" : "SPOTIFY_ERROR",
    });
  }

  if (error?.name === "TimeoutError") {
    return res.status(504).json({ error: "Spotify request timed out" });
  }

  console.error("Unhandled request error", error);
  return res.status(500).json({ error: "Unexpected server error" });
});

module.exports = app;
