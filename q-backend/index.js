const server = require('express')();
const bodyParser = require('body-parser');
const q_logger = require('q-logger');
const config = require('config');

q_logger.info("Starting server...");

server.use(require('cors')());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
  q_logger.info(`${req.method} ${req.originalUrl}`, {query: req.query, body: req.body});
  next();
});

server.use('/spotify', require('./spotify'));
server.use('/mongodb', require('./mongodb'));
server.use('/lifx', require('./lifx'));

server.listen(config.port, () => q_logger.info(`Started Q on port ${config.port}`));
