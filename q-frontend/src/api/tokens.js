import axios from 'axios';

export const getTokenStatus = then => {
  axios.get('/tokens/spotify')
    .then(response => then(response.data));
};

export const getTracks = () => {

};
