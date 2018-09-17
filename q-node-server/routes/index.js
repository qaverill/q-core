const routes = require('express').Router();
const aws = require('./aws');
const spotify = require('./spotify');

routes.use(function(req, res, next) {
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

routes.use('./aws', aws);
routes.use('./spotify', spotify);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'hey man' });
});

module.exports = routes;

