const url = require('url');
const ws = require('ws');
const co = require('co');
const compose = require('koa-compose');

class KoaWebsocketServer {
  constructor (app) {
    this.app = app;
    this.middleware = [];
  }

  listen (options) {
    this.server = new ws.Server(options)
    this.server.on('connection', this.onConnection.bind(this));
  }

  broadcast(data, options) {
    this.server.clients.forEach(function each(client) {
      try {
        if (client.readyState === ws.OPEN) {
          client.send(data);
        }
      } catch (err) {
        console.log(err)
      }
    });
  };

  onConnection (ws, req) {
    const location = url.parse(req.url, true);
    const fn = co.wrap(compose(this.middleware));

    const context = this.app.createContext(req);
    context.websocket = ws;
    context.path = location.pathname;

    fn(context).catch(err => console.log(err));

    ws.isAlive = true;
    ws.on('pong', function () { ws.isAlive = true; })

    setInterval(() => {
      this.server.clients.forEach(ws => {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(() => {});
      })
    }, 30000);
  }

  use (fn) {
    this.middleware.push(fn);
    return this;
  }
}

module.exports = function (app, wsOptions = {}) {
  const oldListen = app.listen;

  app.listen = (...args) => {
    console.log('Attaching server...');
    app.server = oldListen.apply(app, args);

    const options = { server: app.server, ...wsOptions };

    app.ws.listen(options);
    return app.server
  }

  app.ws = new KoaWebsocketServer(app);
  return app;
}
