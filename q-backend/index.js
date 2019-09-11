const server = require('express')();
const bodyParser = require('body-parser');
const q_logger = require('q-logger');

server.use(require('cors')());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
  const getRequestDataByMethod = method => {
    switch (method) {
      case "GET":
        return JSON.stringify(req.query);
      case "POST":
        return (
          Array.isArray(req.body)
            ? JSON.stringify({"numberOfItems": req.body.length})
            : JSON.stringify(req.body)
        );
      default:
        return "The server does not know what to print for this HTTP method"
    }
  };

  const timestamp = new Date();
  q_logger.info('%s-%s: %s %s %s',
    timestamp.toLocaleDateString(),
    timestamp.toLocaleTimeString(),
    req.method,
    req.originalUrl,
    getRequestDataByMethod(req.method)
  );
  next();
});

q_logger.info("ok")


server.use('/spotify', require('./spotify'));
server.use('/mongodb', require('./mongodb'));

q_logger.warn("ahhh")
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
});
