import axios from 'axios';

export const getLights = then => (
  axios.get('/lifx', { params: { url: 'https://api.lifx.com/v1/lights/all' } })
    .then(res => then(res.data))
);

export const toggleLightPower = ({ label, then }) => (
  axios.post('/lifx', { url: `https://api.lifx.com/v1/lights/label:${label}/toggle` })
    .then(res => then(res.data.results))
);

export const setLightsCycle = ({ colors, lights }) => {
  // TODO: set both lights to cycle through the colors param, each starting on different colors
};

export const setLightsDefault = () => {
  // TODO: set all lights to that warm default color that I like
};
