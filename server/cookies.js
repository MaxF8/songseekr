const ACCESS_COOKIE = "songseekr_access";
const REFRESH_COOKIE = "songseekr_refresh";
const EXPIRES_COOKIE = "songseekr_expires";
const STATE_COOKIE = "songseekr_oauth_state";
const RETURN_COOKIE = "songseekr_oauth_return";

function parseCookies(header = "") {
  return header.split(";").reduce((cookies, part) => {
    const separator = part.indexOf("=");
    if (separator === -1) return cookies;

    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (!key) return cookies;

    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
    return cookies;
  }, {});
}

function isSecureRequest(req) {
  const forwardedProtocol = req.headers["x-forwarded-proto"];
  return (
    process.env.NODE_ENV === "production" ||
    req.secure ||
    forwardedProtocol === "https"
  );
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || "/"}`);
  parts.push(`SameSite=${options.sameSite || "Lax"}`);

  if (options.httpOnly !== false) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (Number.isFinite(options.maxAge)) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }
  return parts.join("; ");
}

function setCookie(req, res, name, value, options = {}) {
  res.append(
    "Set-Cookie",
    serializeCookie(name, value, {
      secure: isSecureRequest(req),
      ...options,
    })
  );
}

function clearCookie(req, res, name, path = "/") {
  setCookie(req, res, name, "", { path, maxAge: 0 });
}

function getCookies(req) {
  return parseCookies(req.headers.cookie || "");
}

function setTokenCookies(req, res, tokenResponse) {
  const expiresIn = Number(tokenResponse.expires_in) || 3600;
  setCookie(req, res, ACCESS_COOKIE, tokenResponse.access_token, {
    path: "/api",
    maxAge: expiresIn,
  });
  setCookie(req, res, EXPIRES_COOKIE, String(Date.now() + expiresIn * 1000), {
    path: "/api",
    maxAge: expiresIn,
  });

  if (tokenResponse.refresh_token) {
    setCookie(req, res, REFRESH_COOKIE, tokenResponse.refresh_token, {
      path: "/api",
      maxAge: 60 * 60 * 24 * 180,
    });
  }
}

function clearTokenCookies(req, res) {
  clearCookie(req, res, ACCESS_COOKIE, "/api");
  clearCookie(req, res, REFRESH_COOKIE, "/api");
  clearCookie(req, res, EXPIRES_COOKIE, "/api");
}

module.exports = {
  ACCESS_COOKIE,
  EXPIRES_COOKIE,
  REFRESH_COOKIE,
  RETURN_COOKIE,
  STATE_COOKIE,
  clearCookie,
  clearTokenCookies,
  getCookies,
  parseCookies,
  setCookie,
  setTokenCookies,
};
