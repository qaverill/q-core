import axios from 'axios';

export const getLights = async () => {
  const url = 'https://api.lifx.com/v1/lights/all';
  return (await axios.get('/lifx', { params: { url } })).data;
};

export const toggleLightPower = (label) => {
  axios.post('/lifx', { url: `https://api.lifx.com/v1/lights/label:${label}/toggle` });
};

export const setLightsCycle = ({ colors, lights }) => {
  // TODO: set both lights to cycle through the colors param, each starting on different colors
};

export const setLightsDefault = () => {
  // TODO: set all lights to that warm default color that I like
};
