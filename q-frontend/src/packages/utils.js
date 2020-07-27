/* eslint-disable no-undef */
import axios from 'axios';

export const ONE_EPOCH_DAY = 86400;

export const capitolFirstLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const stringToEpoch = (s) => Math.round(new Date(`${s.split('/')[2]}-${s.split('/')[0]}-${s.split('/')[1]}T00:00:00Z`).getTime() / 1000);
export const dateToString = (d) => `${d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1}/${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}/${d.getFullYear()}`;
export const epochToString = (epoch) => epoch != null && dateToString(new Date(epoch * 1000));
export const epochToDate = (epoch) => new Date(epoch * 1000);
export const dateToEpoch = (date) => parseInt(new Date(date).getTime() / 1000, 10);
export const msToString = (durationInMs) => {
  const hours = parseInt(durationInMs / 3600000, 10);
  const minutes = parseInt(((durationInMs / 1000) % 3600) / 60, 10);
  const seconds = parseInt((durationInMs / 1000) % 60, 10);
  return `${hours < 10 ? `0${hours}` : hours}h ${minutes < 10 ? `0${minutes}` : minutes}m ${seconds < 10 ? `0${seconds}` : seconds}s`;
};
export const roundToTwoDecimalPlaces = num => Math.round(num * 100) / 100;
export const formatAsMoney = num => (num < 0 ? `-$${roundToTwoDecimalPlaces(num) * -1}` : `$${roundToTwoDecimalPlaces(num)}`);
export const averageArray = array => array.reduce((a, b) => a + b, 0) / array.length;

const timestampToDate = timestamp => new Date(timestamp * 1000);
export const times = {
  firstOfCurrentMonth: () => Math.round(new Date(new Date().getFullYear(), new Date().getMonth() - 7, 1) / 1000),
  now: () => Math.round(new Date().getTime() / 1000),
  timestampToDate,
  getNameOfMonth: timestamp => {
    const date = timestampToDate(timestamp);
    const month = date.toLocaleString('default', { month: 'long' });
    return month;
  },
};

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
