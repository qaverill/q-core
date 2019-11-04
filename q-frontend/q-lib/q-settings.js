/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import axios from 'axios';

export const get = () => {
  if (sessionStorage.getItem('settings') != null) {
    return JSON.parse(sessionStorage.getItem('settings'));
  }
  return null;
};

export const set = (key, value) => {
  if (sessionStorage.getItem('settings') != null) {
    const updatedSettings = JSON.parse(sessionStorage.getItem('settings'));
    updatedSettings[key] = value;
    axios.post('/mongodb/settings', { [key]: value })
      .then(() => {
        sessionStorage.setItem('settings', JSON.stringify(updatedSettings));
      }).catch((e) => {
        console.log('Error settting settings...', e);
      });
  }
};
