const Koa = require('koa');
const Router = require('koa-router');
const websockify = require('koa-websocket');

const api = new Router();
const app = websockify(new Koa());

api.get('/*', function* (next) {
  this.websocket.send('Hello World');
  this.websocket.on('message', function(message) {
    console.log(message);
  });
});

console.log(app.ws);

app.ws.use(api.routes()).use(api.allowedMethods());

app.listen(3000);
