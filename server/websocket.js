module.exports = function (app) {
  const server = require('http').createServer(app.callback());
  const io = require('socket.io')(server);

  io.on('connection', socket => {
    console.log('socket.io connection');
    socket.emit('new connection', {
      timestamp: Date.now(),
      message: `socketId: ${socket.id} connected.`
    })

    io.on('disconnecting', reason => {
      console.log(reason);
    });

    io.on('disconnect', reason => {
      console.log(reason);
    });

    io.on('error', reason => {
      console.log(reason);
    });
  })

  app.ws = io;
  return server;
}
