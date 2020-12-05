import axios from 'axios';

export const getDeskStatus = async () => (await axios.get('/kasa')).data;

export const setDeskPower = power => { axios.put(`/kasa?power=${power ? 'on' : 'off'}`); };
