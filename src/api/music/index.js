const { response } = require('express');
const R = require('ramda');
const { makeGetEndpointAsync } = require('../gates');
const { analyzeMusic } = require('./analyze');
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/analyze/music';
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    /**
     * GET /analyze/music
     * @params start (optional) TIMESTAMP default:null
     * @params end (optional only if start exists) TIMESTAMP default:now
     * @note If both start and end is null, will return the current timeframe (last 3 days)
     * @returns Analysis of music data over a period of time (specified, or current)
     */
    makeGetEndpointAsync({ routes, path }, ({ request, respond }) => {
      const { start, end } = request.query;
      if (end && R.isNil(start)) respond('Cannot provide end but no start!');
      else if (start > end) respond('Start cannot be greater than end!');
      else {
        const timeframe = (start == null && end == null)
          ? null
          : { start: parseInt(start, 10), end: parseInt(end, 10) };
        analyzeMusic(timeframe).then(respond);
      }
    });
  },
};
