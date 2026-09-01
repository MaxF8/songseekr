const MAX_SPOTIFY_OFFSET = 100000;

function nonNegativeInteger(value, fallback = 0) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : fallback;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
}

function requestedInteger(value) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (typeof candidate !== "string" || !/^\d+$/.test(candidate)) return null;

  const number = Number(candidate);
  return Number.isSafeInteger(number) ? number : null;
}

function pageParameters(query = {}, defaultLimit = 24, maximumLimit = 50) {
  const safeMaximum = positiveInteger(maximumLimit, 50);
  const safeDefault = Math.min(positiveInteger(defaultLimit, 24), safeMaximum);
  const requestedLimit = requestedInteger(query.limit);
  const requestedOffset = requestedInteger(query.offset);

  return {
    limit:
      requestedLimit === null
        ? safeDefault
        : Math.min(Math.max(requestedLimit, 1), safeMaximum),
    offset:
      requestedOffset === null ? 0 : Math.min(requestedOffset, MAX_SPOTIFY_OFFSET),
  };
}

function pageItems(body) {
  return Array.isArray(body?.items) ? body.items : [];
}

function pageResponse(body, items, requested = {}) {
  const safeItems = Array.isArray(items) ? items : [];
  const fallbackLimit = positiveInteger(requested.limit, safeItems.length);
  const fallbackOffset = nonNegativeInteger(requested.offset, 0);

  return {
    items: safeItems,
    total: nonNegativeInteger(body?.total, 0),
    limit: positiveInteger(body?.limit, fallbackLimit),
    offset: nonNegativeInteger(body?.offset, fallbackOffset),
  };
}

module.exports = {
  MAX_SPOTIFY_OFFSET,
  pageItems,
  pageParameters,
  pageResponse,
};
