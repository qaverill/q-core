const { currentTimeframe, requestToTimeframe } = require('@q/time');
const { makeGetEndpointAsync } = require('../gates');
const { analyzeMusic } = require('./analyze');
const { readListens } = require('../../crud/music');

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
      const timeframe = (start == null && end == null)
        ? currentTimeframe()
        : requestToTimeframe(request);
      readListens(timeframe).then((listens) => {
        analyzeMusic(listens).then(respond);
      });
    });
  },
};
