const server = require('express')();
const bodyParser = require('body-parser');
const config = require('config');
const schedule = require('node-schedule');

const { q_logger } = require('q-lib');

q_logger.info('Starting server...');

config.validate();

server.use(require('cors')());

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
  const payload = {};
  if (req.query) payload.query = req.query;
  if (req.body) {
    if (Array.isArray(req.body)) {
      payload.body = { numItems: req.body.length };
    } else {
      payload.body = req.body;
    }
  }
  q_logger.apiIn(`${req.method} ${req.originalUrl}`, payload);
  next();
});

server.use('/spotify', require('./api/spotify'));
server.use('/mongodb', require('./api/mongodb'));
server.use('/lifx', require('./api/lifx'));
server.use('/transactions', require('./api/transactions'));

// schedule.scheduleJob('0 17 ? * 0,4-6', function(){
//   console.log('Today is recognized by Rebecca Black!');
// });

server.listen(config.port, () => q_logger.info(`Started Q on port ${config.port}`));
