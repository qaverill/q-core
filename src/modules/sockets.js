const io = require('socket.io');

module.exports = {
  setupSockets: (httpServer) => (
    io(httpServer, {
      cors: {
        origin: 'http://localhost:3030',
        methods: ['GET', 'POST', 'PUT'],
      },
    })
  ),
};
