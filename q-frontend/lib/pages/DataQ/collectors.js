"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectors = void 0;

var _qLib = require("q-lib");

/* eslint-disable import/prefer-default-export */
var dataQTheme = _qLib.q_colors.dataQTheme;
var collectors = [{
  name: 'listens',
  sourcePath: '/spotify/recently-played',
  mongodbPath: '/mongodb/listens',
  timeParam: 'played_at',
  color: dataQTheme.secondary
}, {
  name: 'saves',
  sourcePath: '/spotify/saved-tracks',
  mongodbPath: '/mongodb/saves',
  timeParam: 'added_at',
  color: dataQTheme.tertiary
}, {
  name: 'transactions',
  sourcePath: '/transactions',
  mongodbPath: '/mongodb/transactions',
  timeParam: 'timestamp',
  color: dataQTheme.quaternary
}];
exports.collectors = collectors;