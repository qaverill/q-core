const logger = require('@q/logger');
const { validateConfig, port } = require('./config');
const SetupAllEndpoints = require('./endpoints');
const { server, routes } = require('./express-server');
// ----------------------------------
// ROOT
// ----------------------------------
logger.info('Starting server...');
validateConfig();

logger.info('Available endpoints:');
SetupAllEndpoints(routes);

server.use('/', routes);
server.listen(port);
