const server = require('express')();
const bodyParser = require('body-parser');

require('dotenv').load();

server.use(require('cors')());
server.use(require('./logRequests'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/aws', require('./aws'));
server.use('/spotify', require('./spotify'));
server.use('/mongodb', require('./mongodb'));

server.get('/', (req, res) => {
  res.status(200).json({ message: 'hey man' });
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}\n`)
});
