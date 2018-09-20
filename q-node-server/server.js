const server = require('express')();
const routes = require('./routes');
const bodyParser = require('body-parser');
require('dotenv').load();

server.use(require('cors')());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/', routes);

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}\n`)
});
