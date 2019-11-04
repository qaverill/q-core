/* eslint-disable import/prefer-default-export */
import { q_colors } from 'q-lib';

const { dataQTheme } = q_colors;

export const collectors = [
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
];
