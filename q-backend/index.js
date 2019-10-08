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
  q_logger.apiIn(`${req.method} ${req.originalUrl}`, payload);
  next();
});

server.use('/spotify', require('./routes/spotify'));
server.use('/mongodb', require('./routes/mongodb'));
server.use('/lifx', require('./routes/lifx'));
server.use('/accounting', require('./routes/accounting'));

server.listen(config.port, () => q_logger.info(`Started Q on port ${config.port}`));
