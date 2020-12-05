import axios from 'axios';
// ----------------------------------
// HELPERS
// ----------------------------------
const ME = 'Q';
const FULL_ON = {
  power: 'on',
  brightness: 1,
  fast: true,
};
const LEFT_ID = 'd073d53ce830';
const RIGHT_ID = 'd073d53cf1d9';
// ----------------------------------
// REQUESTS
// ----------------------------------
export const getLights = async () => (
  (await axios.get('/lifx', {
    params: {
      url: `https://api.lifx.com/v1/lights/group:${ME}` },
  })).data
);
export const toggleLightPower = (label) => {
  axios.post('/lifx', { url: `https://api.lifx.com/v1/lights/label:${label}/toggle` });
};
export const setLightsCycle = ({ colors, lights }) => {
  lights.forEach(({ label }, i) => {
    axios.post('/lifx', {
      url: `https://api.lifx.com/v1/lights/label:${label}/cycle`,
      body: {
        states: colors.map(color => ({ color })),
        defaults: {
          power: 'on', // all states default to on
          duration: 15, // all transitions will be applied over 2 seconds
          brightness: 1.0,
          fast: true,
        },
        direction: i % 2 === 0 ? 'forward' : 'backward',
      },
    });
  });
};
export const setLightsDefault = () => {
  // TODO: set all lights to that warm default color that I like
  axios.put('/lifx', {
    url: 'https://api.lifx.com/v1/lights/all/state',
    body: {
      power: 'on',
      color: {
        hue: 5.998626688029297,
        saturation: 0,
        kelvin: 2000,
      },
      duration: 0,
      fast: true,
    },
  });
};
export const turnAllLightsOff = () => {
  axios.put('/lifx', {
    url: 'https://api.lifx.com/v1/lights/states',
    body: {
      states: [
        {
          selector: `id:${LEFT_ID}`,
          power: 'off',
        },
        {
          selector: `id:${RIGHT_ID}`,
          power: 'off',
        },
      ],
    },
  });
};
export const setAllLightsToColor = colors => {
  if (colors[0] === 'OFF' && colors[0] === 'OFF') {
    turnAllLightsOff();
    return;
  }
  axios.put('/lifx', {
    url: 'https://api.lifx.com/v1/lights/states',
    body: {
      states: [
        {
          selector: `id:${LEFT_ID}`,
          color: colors[0],
        },
        {
          selector: `id:${RIGHT_ID}`,
          color: colors[1],
        },
      ],
      defaults: FULL_ON,
    },
  });
};
