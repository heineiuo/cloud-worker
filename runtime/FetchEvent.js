class Request {}

class FetchEvent extends Event {
  constructor(init) {
    super("fetch");
    this.messageId = init.messageId;
    this.request = init.request;
    this.clientId = init.clientId || process.pid;
    this.isReload = init.isReload || false;
    this.response = new Promise((resolve, reject) => {
      this.respondWith = resolve;
      this.reject = reject;
    });
  }
}

module.exports = {
  FetchEvent,
};
