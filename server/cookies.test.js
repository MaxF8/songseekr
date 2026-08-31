const assert = require("node:assert/strict");
const test = require("node:test");

const { parseCookies, setCookie } = require("./cookies");

test("parseCookies decodes values and preserves embedded equals signs", () => {
  assert.deepEqual(parseCookies("plain=value; encoded=hello%20world; token=a%3Db"), {
    plain: "value",
    encoded: "hello world",
    token: "a=b",
  });
});

test("setCookie defaults to HttpOnly, SameSite Lax, and the requested path", () => {
  const headers = [];
  const req = { headers: {}, secure: false };
  const res = { append: (name, value) => headers.push([name, value]) };

  setCookie(req, res, "session", "secret", { path: "/api", maxAge: 60 });

  assert.equal(headers[0][0], "Set-Cookie");
  assert.match(headers[0][1], /^session=secret;/);
  assert.match(headers[0][1], /Path=\/api/);
  assert.match(headers[0][1], /SameSite=Lax/);
  assert.match(headers[0][1], /HttpOnly/);
  assert.match(headers[0][1], /Max-Age=60/);
});
