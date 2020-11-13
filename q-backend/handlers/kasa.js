const { Client } = require('tplink-smarthome-api');
const kasaClient = new Client();

const host = '192.168.1.38';

module.exports = {
  handleKasaInfo: async ({ request, response }) => {
    kasaClient.getDevice({ host }).then(device => {
      device.getSysInfo().then(info => {
        response.status(200).send(info);
      });
    });
  },
  handleKasaPowerToggle: async ({ request, response }) => {
    kasaClient.getDevice({ host }).then(device => {
      device.setPowerState(request.query.power === 'on');
      response.status(200).send();
    });
  },
};