const logger = require('@q/logger');
const { validateConfig, port } = require('./config');
const SetupAllEndpoints = require('./api');
const { app, routes, httpServer } = require('./modules/express-server');
const { setupSockets } = require('./modules/sockets');
const KickoffIngestions = require('./ingesting');
// ----------------------------------
// ROOT
// ----------------------------------
logger.info('Starting server...');
console.log(`  PORT: ${port}`);
validateConfig();

logger.info('Available endpoints:');
const socket = setupSockets(httpServer);
SetupAllEndpoints(socket, routes);
app.use('/', routes);

httpServer.listen(port);

// KickoffIngestions();
