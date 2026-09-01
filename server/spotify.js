const {
  ACCESS_COOKIE,
  EXPIRES_COOKIE,
  REFRESH_COOKIE,
  clearTokenCookies,
  getCookies,
  setTokenCookies,
} = require("./cookies");

const ACCOUNTS_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1";
const SPOTIFY_ID_PATTERN = /^[A-Za-z0-9]{1,64}$/;

let clientTokenCache = null;

class SpotifyError extends Error {
  constructor(message, status = 500, details = null, retryAfter = null) {
    super(message);
    this.name = "SpotifyError";
    this.status = status;
    this.details = details;
    this.retryAfter = retryAfter;
  }
}

function requireCredentials() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new SpotifyError("Spotify server credentials are not configured", 503);
  }
  return { clientId, clientSecret };
}

function basicAuthorization() {
  const { clientId, clientSecret } = requireCredentials();
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function requestToken(parameters) {
  const response = await fetch(ACCOUNTS_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuthorization(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(parameters),
    signal: AbortSignal.timeout(15000),
  });
  const body = await parseResponse(response);

  if (!response.ok) {
    throw new SpotifyError(
      body?.error_description || body?.error || "Spotify authorization failed",
      response.status,
      body
    );
  }
  return body;
}

async function exchangeAuthorizationCode(code, redirectUri) {
  return requestToken({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });
}

async function refreshAccessToken(refreshToken) {
  return requestToken({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}

async function getClientAccessToken() {
  if (clientTokenCache && clientTokenCache.expiresAt > Date.now() + 60000) {
    return clientTokenCache.token;
  }

  const tokenResponse = await requestToken({ grant_type: "client_credentials" });
  clientTokenCache = {
    token: tokenResponse.access_token,
    expiresAt: Date.now() + (Number(tokenResponse.expires_in) || 3600) * 1000,
  };
  return clientTokenCache.token;
}

async function spotifyRequest(path, accessToken, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: options.signal || AbortSignal.timeout(15000),
  });
  const body = await parseResponse(response);

  if (!response.ok) {
    const message =
      body?.error?.message || body?.message || `Spotify request failed (${response.status})`;
    throw new SpotifyError(
      message,
      response.status,
      body,
      response.headers.get("retry-after")
    );
  }
  return body;
}

async function getUserAccessToken(req, res, forceRefresh = false) {
  const cookies = getCookies(req);
  const accessToken = cookies[ACCESS_COOKIE];
  const refreshToken = cookies[REFRESH_COOKIE];
  const expiresAt = Number(cookies[EXPIRES_COOKIE]) || 0;

  if (!forceRefresh && accessToken && expiresAt > Date.now() + 60000) {
    return accessToken;
  }
  if (!refreshToken) {
    if (accessToken && !forceRefresh) return accessToken;
    throw new SpotifyError("Authentication required", 401);
  }

  try {
    const tokenResponse = await refreshAccessToken(refreshToken);
    setTokenCookies(req, res, tokenResponse);
    return tokenResponse.access_token;
  } catch (error) {
    if (error instanceof SpotifyError && error.details?.error === "invalid_grant") {
      clearTokenCookies(req, res);
      throw new SpotifyError("Spotify session expired. Please connect again.", 401);
    }
    throw error;
  }
}

async function spotifyUserRequest(req, res, path) {
  let accessToken = await getUserAccessToken(req, res);
  try {
    return await spotifyRequest(path, accessToken);
  } catch (error) {
    if (!(error instanceof SpotifyError) || error.status !== 401) throw error;
    accessToken = await getUserAccessToken(req, res, true);
    return spotifyRequest(path, accessToken);
  }
}

function assertSpotifyId(id) {
  if (!SPOTIFY_ID_PATTERN.test(id || "")) {
    throw new SpotifyError("Invalid Spotify ID", 400);
  }
  return id;
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeArtist(artist) {
  artist = objectOrEmpty(artist);
  return {
    id: artist.id || null,
    name: artist.name || "Unknown artist",
    spotifyUrl: artist.external_urls?.spotify || null,
  };
}

function bestImage(images) {
  if (!Array.isArray(images)) return null;
  return images.find((image) => image?.url)?.url || null;
}

function normalizeTrack(track) {
  track = objectOrEmpty(track);
  const album = objectOrEmpty(track.album);
  const hasAlbum = Object.keys(album).length > 0;

  return {
    id: track.id || null,
    name: track.name || "Unavailable track",
    durationMs: Number(track.duration_ms) || 0,
    artists: arrayOrEmpty(track.artists).map(normalizeArtist),
    album: hasAlbum
      ? {
          id: album.id || null,
          name: album.name || "Unknown album",
          image: bestImage(album.images),
        }
      : null,
    image: bestImage(album.images),
    spotifyUrl: track.external_urls?.spotify || null,
    available: Boolean(track.id),
  };
}

function normalizeAlbum(album) {
  album = objectOrEmpty(album);
  return {
    id: album.id || null,
    name: album.name || "Unknown album",
    artists: arrayOrEmpty(album.artists).map(normalizeArtist),
    image: bestImage(album.images),
    spotifyUrl: album.external_urls?.spotify || null,
    releaseDate: album.release_date || null,
  };
}

function normalizePlaylist(playlist) {
  // Spotify can leave null entries in a user's playlist collection when a
  // playlist is no longer available. Keep those entries filterable instead
  // of failing the entire paginated response.
  playlist = objectOrEmpty(playlist);
  return {
    id: playlist.id || null,
    name: playlist.name || "Untitled playlist",
    image: bestImage(playlist.images),
    spotifyUrl: playlist.external_urls?.spotify || null,
    owner: playlist.owner?.display_name || null,
    total: playlist.items?.total ?? playlist.tracks?.total ?? null,
  };
}

function normalizeFeature(feature) {
  if (!feature || feature.key === -1) return null;
  return {
    key: feature.key,
    mode: feature.mode,
  };
}

function normalizePlaylistEntry(entry) {
  entry = objectOrEmpty(entry);
  const item = entry.item || entry.track || null;
  if (!item || (item.type && item.type !== "track")) return null;
  return normalizeTrack(item);
}

function normalizeSavedAlbumEntry(entry) {
  entry = objectOrEmpty(entry);
  return normalizeAlbum(entry.album);
}

function normalizeSavedTrackEntry(entry) {
  entry = objectOrEmpty(entry);
  return normalizeTrack(entry.track || entry.item);
}

async function getAudioFeatures(trackIds, accessToken) {
  const ids = [...new Set(arrayOrEmpty(trackIds).filter(Boolean))].slice(0, 100);
  if (ids.length === 0) return { features: {}, available: true };

  try {
    const body = await spotifyRequest(
      `/audio-features?ids=${encodeURIComponent(ids.join(","))}`,
      accessToken
    );
    const features = {};
    for (const feature of arrayOrEmpty(body?.audio_features)) {
      if (feature?.id) features[feature.id] = normalizeFeature(feature);
    }
    return { features, available: true };
  } catch (error) {
    if (error instanceof SpotifyError && [403, 404].includes(error.status)) {
      return { features: {}, available: false };
    }
    throw error;
  }
}

function addFeatures(tracks, featureResult) {
  const features = objectOrEmpty(featureResult?.features);
  return arrayOrEmpty(tracks).filter(Boolean).map((track) => ({
    ...track,
    audioFeature: track.id ? features[track.id] || null : null,
  }));
}

module.exports = {
  SpotifyError,
  addFeatures,
  assertSpotifyId,
  exchangeAuthorizationCode,
  getAudioFeatures,
  getClientAccessToken,
  getUserAccessToken,
  normalizeAlbum,
  normalizeFeature,
  normalizePlaylist,
  normalizePlaylistEntry,
  normalizeSavedAlbumEntry,
  normalizeSavedTrackEntry,
  normalizeTrack,
  spotifyRequest,
  spotifyUserRequest,
};
