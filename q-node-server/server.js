const server = require('express')();
const bodyParser = require('body-parser');

require('dotenv').load();

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
  console.log('%s-%s: %s %s %s',
    timestamp.toLocaleDateString(),
    timestamp.toLocaleTimeString(),
    req.method,
    req.originalUrl,
    getRequestDataByMethod(req.method)
  );
  next();
});

server.use('/aws', require('./aws'));
server.use('/spotify', require('./spotify'));
server.use('/mongodb', require('./mongodb'));

server.get('/', (req, res) => {
  res.status(200).json({ message: 'hey man' });
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}\n`)
});
