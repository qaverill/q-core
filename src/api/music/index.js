const R = require('ramda');
const { makeGetEndpointAsync } = require('../gates');
const { analyzeMusicTemporal, analyzeMusicCurrent } = require('./analyze');
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
      else if (start) analyzeMusicTemporal({ start, end }).then(respond);
      else analyzeMusicCurrent().then(respond);
    });
  },
};
