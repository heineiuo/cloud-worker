# Cloud Worker

A simple proof of concept about using [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) as a cloud function runtime.


## Get Started

Run `npm install` and then `node main/index.js`.

Open browser with `http://localhost:8080` and see:

> hello world


## API
```js
addEventListener("fetch", (event) => {
  event.respondWith(new Response("hello world"));
});
```
