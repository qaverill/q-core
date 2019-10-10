const { dataQTheme } = require('q-colors');

export const collectors = [
  {
    name: 'listens',
    sourcePath: '/spotify/recently-played',
    mongodbPath: '/mongodb/listens',
    timeParam: 'played_at',
    color: dataQTheme.secondary
  },
  {
    name: 'saves',
    sourcePath: '/spotify/saved-tracks',
    mongodbPath: '/mongodb/saves',
    timeParam: 'added_at',
    color: dataQTheme.tertiary
  },
  {
    name: 'accounting data',
    sourcePath: '/accounting',
    mongodbPath: '/mongodb/accounting',
    timeParam: '',
    color: dataQTheme.quaternary
  }
];