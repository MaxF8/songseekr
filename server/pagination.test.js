const assert = require("node:assert/strict");
const test = require("node:test");

const {
  MAX_SPOTIFY_OFFSET,
  pageItems,
  pageParameters,
  pageResponse,
} = require("./pagination");

test("pageParameters accepts valid paging values and bounds unsafe input", () => {
  assert.deepEqual(pageParameters({ limit: "24", offset: "96" }), {
    limit: 24,
    offset: 96,
  });
  assert.deepEqual(pageParameters({ limit: "500", offset: "999999" }), {
    limit: 50,
    offset: MAX_SPOTIFY_OFFSET,
  });
  assert.deepEqual(pageParameters({ limit: "0", offset: "-1" }), {
    limit: 1,
    offset: 0,
  });
  assert.deepEqual(pageParameters({ limit: "24px", offset: "96oops" }), {
    limit: 24,
    offset: 0,
  });
  assert.deepEqual(pageParameters({ limit: ["16", "32"], offset: ["64"] }, 24), {
    limit: 16,
    offset: 64,
  });
});

test("pageItems rejects missing and malformed item collections", () => {
  assert.deepEqual(pageItems(null), []);
  assert.deepEqual(pageItems({}), []);
  assert.deepEqual(pageItems({ items: null }), []);
  assert.deepEqual(pageItems({ items: { 0: "not-an-array" } }), []);
  assert.deepEqual(pageItems({ items: [null, { id: "item" }] }), [null, { id: "item" }]);
});

test("pageResponse always returns safe paging metadata and an array", () => {
  assert.deepEqual(
    pageResponse(
      { total: "120", limit: "24", offset: "96" },
      [{ id: "item" }],
      { limit: 24, offset: 96 }
    ),
    {
      items: [{ id: "item" }],
      total: 120,
      limit: 24,
      offset: 96,
    }
  );

  assert.deepEqual(
    pageResponse(
      { total: -10, limit: 0, offset: "bad" },
      null,
      { limit: 24, offset: 72 }
    ),
    {
      items: [],
      total: 0,
      limit: 24,
      offset: 72,
    }
  );
});
