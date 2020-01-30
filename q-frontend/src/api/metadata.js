import axios from 'axios';

export const readSettings = async () => (await axios.get('/mongodb/metadata/settings')).data;

export const writeSettings = (settings) => {
  axios.put('/mongodb/metadata/settings', settings);
};
