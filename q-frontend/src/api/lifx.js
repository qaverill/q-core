import axios from 'axios';

export const getLights = async () => {
  const url = 'https://api.lifx.com/v1/lights/all';
  return (await axios.get('/lifx', { params: { url } })).data;
};

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
