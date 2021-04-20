const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

class CloudWorker {
  constructor(workerData) {
    this.workerData = workerData;

    this.daemon();
    this.messages = {};
  }

  daemon() {
    this.worker = new Worker(path.resolve(__dirname, "../runtime/runtime.js"), {
      workerData: this.workerData,
    });

    this.worker.on("error", (e) => {
      console.log("worker error", e);
    });
    this.worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(new Error(`Worker stopped with exit code ${code}`));
      }

      this.worker.removeAllListeners();
      this.daemon();
    });

    this.worker.on("message", (msg) => {
      const { messageId } = msg;
      const cache = this.messages[messageId];
      if (cache) {
        cache.res.end(msg.response.body);
        delete this.messages[messageId];
      }
    });
  }

  fetch(req, res) {
    const messageId = uuid.v1();
    const msg = {
      messageId,
      request: {
        messageId,
      },
      req,
      res,
    };
    this.messages[messageId] = msg;
    this.worker.postMessage(msg.request);
  }
}

module.exports = {
  CloudWorker,
};
