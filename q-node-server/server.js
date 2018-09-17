const server = require('express')();
const routes = require('./routes');
const PORT = 8888;

server.use(require('cors')());

const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/', routes);

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}\n`)
});
