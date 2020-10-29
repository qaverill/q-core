/* eslint-disable no-undef */
import axios from 'axios';


export const capitolFirstLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const roundToTwoDecimalPlaces = num => Math.round(num * 100) / 100;
export const formatAsMoney = num => (num < 0 ? `-$${roundToTwoDecimalPlaces(num) * -1}` : `$${roundToTwoDecimalPlaces(num)}`);
export const averageArray = array => array.reduce((a, b) => a + b, 0) / array.length;

export const getSettings = () => {
  if (sessionStorage.getItem('settings') != null) {
    return JSON.parse(sessionStorage.getItem('settings'));
  }
  return null;
};

export const setSettings = (key, value) => {
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

export const copyStringToClipboard = (string) => {
  const el = document.createElement('textarea');
  el.value = string;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const numberToPrice = (number) => {
  const polarity = number < 0 ? '-' : '';
  const amount = number < 0 ? number * -1 : number;
  const tail = number % 1 === 0 ? '.00' : '';
  return `${polarity}$${amount}${tail}`;
};
