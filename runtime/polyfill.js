class Request {}

class Response {
  constructor(body) {
    this.body = body;
  }
}

class FetchEvent extends Event {
  constructor(type, init) {
    super(type);
    this.messageId = init.messageId;
    this.request = init.request;
    this.clientId = init.clientId || process.pid;
    this.isReload = init.isReload || false;
    this.respondWith = init.resolve;
    this.reject = init.reject;
  }
}

const target = new EventTarget();

globalThis.addEventListener = (...args) => target.addEventListener(...args);
globalThis.dispatchEvent = (...args) => target.dispatchEvent(...args);

globalThis.addEventListener("response", (res) => {
  parentPort.postMessage(res);
});

globalThis.FetchEvent = FetchEvent;
globalThis.Response = Response;
