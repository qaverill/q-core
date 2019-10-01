const server = require('express')();
const bodyParser = require('body-parser');
const q_logger = require('q-logger');
const config = require('config');

q_logger.info("Starting server...");

config.validate();

server.use(require('cors')());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
  let payload = {};
  if (req.query.length > 0) payload.query = req.query;
  if (req.body.length > 0) {
    if (Array.isArray(req.body)) {
      payload.body = {numItems: req.body.length}
    } else {
      payload.body = req.body;
    }
  }
  q_logger.info(`${req.method} ${req.originalUrl}`, payload);
  next();
});

server.use('/spotify', require('./spotify'));server.use((req, res, next) => {
  // q_logger.info("req", req);
  // q_logger.info("res", res);
  // q_logger.info("next", next);
  q_logger.debug("HEYYYY")
});
server.use('/mongodb', require('./mongodb'));
server.use('/lifx', require('./lifx'));

server.listen(config.port, () => q_logger.info(`Started Q on port ${config.port}`));
