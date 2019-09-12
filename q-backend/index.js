const server = require('express')();
const bodyParser = require('body-parser');
const q_logger = require('q-logger');
try {
    const config = require("./config.json");
    global.config = config
} catch (error) {
    q_logger.error("Missing Config.js file in /q-backend");
    return
}

q_logger.info("Starting server...")

server.use(require('cors')());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
  q_logger.info(`${req.method} ${req.originalUrl}`, {query: req.query, body: req.body});
  next();
});

server.use((req, res, next) => {
    // TODO: log error when endpoint called does not exist
    next()
});

server.use('/spotify', require('./spotify'));
server.use('/mongodb', require('./mongodb'));

server.listen(global.config.port, () => {
  q_logger.info(`Started Q on port ${global.config.port}`)
});
