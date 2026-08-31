export class ApiError extends Error {
  constructor(message, status, code = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  let body = options.body;
  if (body && typeof body !== "string" && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const response = await fetch(path, {
    ...options,
    body,
    credentials: "same-origin",
    headers,
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const fallback = `Request failed (${response.status})`;
    const message = typeof payload === "object" ? payload?.error : payload;
    throw new ApiError(message || fallback, response.status, payload?.code);
  }

  if (path.startsWith("/api/") && !contentType.includes("application/json")) {
    throw new ApiError("The server returned an unexpected response.", 502, "INVALID_RESPONSE");
  }

  return payload;
}
