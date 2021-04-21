const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const fs = require("fs");
const path = require("path");
require("./polyfill");

if (isMainThread) {
  throw new Error("runtime can only running on worker_threads");
}

parentPort.addListener("message", async (msg) => {
  const response = await new Promise((resolve, reject) => {
    const fetchEvent = new FetchEvent("fetch", { resolve, reject, ...msg });
    globalThis.dispatchEvent(fetchEvent);
  });
  parentPort.postMessage({
    messageId: msg.messageId,
    response,
  });
});

eval(fs.readFileSync(workerData.__filename, "utf-8"));
