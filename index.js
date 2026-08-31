require("dotenv").config();

const app = require("./server/app");

const port = Number(process.env.PORT) || 3001;
const server = app.listen(port, () => {
  console.log(`songseekr listening on http://127.0.0.1:${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received; closing server`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
