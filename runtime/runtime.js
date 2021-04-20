const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const fs = require("fs");
const { FetchEvent } = require("./FetchEvent");
const path = require("path");

if (isMainThread) {
  throw new Error("runtime can only running on worker_threads");
}

parentPort.addListener("message", async (msg) => {
  const fetchEvent = new FetchEvent(msg);
  globalThis.dispatchEvent(fetchEvent);
  const response = await fetchEvent.response;
  parentPort.postMessage({
    messageId: msg.messageId,
    response,
  });
});

class Response {
  constructor(body) {
    this.body = body;
  }
}

const target = new EventTarget();

globalThis.addEventListener = (...args) => target.addEventListener(...args);
globalThis.dispatchEvent = (...args) => target.dispatchEvent(...args);

globalThis.Response = Response;

globalThis.eval(fs.readFileSync(workerData.__filename, "utf-8"));
