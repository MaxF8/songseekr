const app = require("../server/app");

module.exports = (req, res) => {
  const requestUrl = new URL(req.url, "http://internal");
  const rewrittenPath = requestUrl.searchParams.get("path");

  if (rewrittenPath) {
    requestUrl.searchParams.delete("path");
    const query = requestUrl.searchParams.toString();
    req.url = `/api/${rewrittenPath}${query ? `?${query}` : ""}`;
  }

  return app(req, res);
};
