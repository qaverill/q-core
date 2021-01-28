const logger = require('@q/logger');
const { validateConfig, port } = require('./config');
const SetupAllEndpoints = require('./api');
const { app, routes, httpServer } = require('./express-server');
const { setupSockets } = require('./sockets');
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
