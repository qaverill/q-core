const server = require('express')();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const aws = require('./aws');
const spotify = require('./spotify');
const mongo = require('./mongo');

dotenv.load();

server.use(require('cors')());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(function(req, res, next) {
  const timestamp = new Date();
  console.log('%s-%s: %s %s %s',
    timestamp.toLocaleDateString(),
    timestamp.toLocaleTimeString(),
    req.method,
    req.originalUrl,
    req.method === "GET" ? JSON.stringify(req.query) : JSON.stringify(req.params)
  );
  next();
});

server.use('/aws', aws);
server.use('/spotify', spotify);
server.use('/mongo', mongo);

server.get('/', (req, res) => {
  res.status(200).json({ message: 'hey man' });
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}\n`)
});
