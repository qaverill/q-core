const { dataQTheme } = require('q-colors');

module.exports = {
  collectors: [
    {
      name: 'listens',
      sourcePath: '/spotify/recently-played',
      mongodbPath: '/mongodb/listens',
      timeParam: 'played_at',
      color: dataQTheme.secondary,
    },
    {
      name: 'saves',
      sourcePath: '/spotify/saved-tracks',
      mongodbPath: '/mongodb/saves',
      timeParam: 'added_at',
      color: dataQTheme.tertiary,
    },
    {
      name: 'transactions',
      sourcePath: '/transactions',
      mongodbPath: '/mongodb/transactions',
      timeParam: 'timestamp',
      color: dataQTheme.quaternary,
    },
  ],
};
