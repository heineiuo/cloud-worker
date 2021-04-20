const http = require("http");
const path = require("path");
const { CloudWorker } = require("./CloudWorker");

const workers = {};

async function findWorker() {
  if (!workers.app) {
    workers.app = new CloudWorker({
      __filename: path.resolve(__dirname, "../apps/app.js"),
    });
  }
  return workers.app;
}

async function queueFetchEvent(req, res) {
  const worker = await findWorker();
  if (worker) {
    worker.fetch(req, res);
  } else {
    res.end("Not Found");
  }
}

const server = http.createServer(queueFetchEvent);

server.listen(8080);
