import axios from 'axios';

export const getTokenStatus = async () => (await axios.get('/tokens/spotify')).data;

export const getTracks = () => {

};
