import { apiRequest, ApiError } from "./client";

afterEach(() => {
  vi.restoreAllMocks();
});

it("parses successful JSON responses with same-origin credentials", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );

  await expect(apiRequest("/api/health")).resolves.toEqual({ status: "ok" });
  expect(fetchMock).toHaveBeenCalledWith(
    "/api/health",
    expect.objectContaining({ credentials: "same-origin" })
  );
});

it("turns API failures into typed errors", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify({ error: "Authentication required", code: "SPOTIFY_ERROR" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  );

  await expect(apiRequest("/api/me/tracks")).rejects.toEqual(
    expect.objectContaining({
      name: "ApiError",
      message: "Authentication required",
      status: 401,
    })
  );
  await expect(Promise.reject(new ApiError("test", 400))).rejects.toBeInstanceOf(ApiError);
});

it("rejects an HTML fallback returned for an API URL", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response("<!doctype html><title>App</title>", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    })
  );

  await expect(apiRequest("/api/search?q=test")).rejects.toEqual(
    expect.objectContaining({ code: "INVALID_RESPONSE", status: 502 })
  );
});
