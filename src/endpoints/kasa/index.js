const { Client } = require('tplink-smarthome-api');
const { makeGetEndpoint, makePutEndpoint } = require('../gates');
const { readOutlet, updateOutlet } = require('./crud');

const kasaClient = new Client();

const myOutletMacAddress = 'B0:95:75:44:A5:D5';
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/kasa';
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  createEndpoints: (routes) => {
    kasaClient.startDiscovery().on('plug-new', (plug) => {
      const { _sysInfo, host } = plug;
      if (_sysInfo.mac === myOutletMacAddress) {
        // GET /kasa
        makeGetEndpoint({ routes, path }, async ({ response }) => {
          response.send(await readOutlet(kasaClient, host));
        });
        // PUT /kasa
        makePutEndpoint(({ routes, path }), async ({ request, response }) => {
          response.send(await updateOutlet(kasaClient, host, request.body.state));
        });
      }
    });
  },
};
