const server = require('express')();
const bodyParser = require('body-parser');
const config = require('config');

const { q_logger } = require('q-lib');
const { logIncomingRequest } = require('./gates');

q_logger.info('Starting server...');

config.validate();

server.use(require('cors')());

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => logIncomingRequest({ req, next }));

server.use('/spotify', require('./api/spotify'));
server.use('/mongodb', require('./api/mongodb'));
server.use('/lifx', require('./api/lifx'));
server.use('/transactions', require('./api/transactions'));
server.use('/unsaved', require('./api/unsaved'));
server.use('/tokens', require('./api/tokens'));

server.listen(config.port, () => q_logger.info(`Started Q on port ${config.port}`));
