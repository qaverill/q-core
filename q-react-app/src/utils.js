import axios from "axios";

export const ONE_EPOCH_DAY = 86400;


export const capitolFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const stringToEpoch = (string) => {
  const list =  string.split('/');
  return Math.round(new Date(`${list[2]}-${list[0]}-${list[1]}T00:00:00Z`).getTime() / 1000);
};

export const epochToString = (epoch) => {
  if (epoch != null) return dateToString(new Date(epoch * 1000))
};

export const epochToDate = (epoch) => {
  return new Date(epoch * 1000)
};

export const dateToEpoch = (date) => {
  return Math.round(date.getTime() / 1000);
};

export const dateToString = (date) => {
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${month}/${day}/${date.getFullYear()}`
};

export const msToString = (durationInMs) => {
  const hours = parseInt( durationInMs / 3600000);
  const minutes = parseInt( ((durationInMs / 1000) % 3600) / 60 );
  const seconds = parseInt((durationInMs / 1000) % 60);
  return (hours < 10 ? "0" + hours : hours) + 'h '
       + (minutes < 10 ? "0" + minutes : minutes) + 'm '
       + (seconds < 10 ? "0" + seconds : seconds) + 's';
};

export const getSettings = () => {
  if (sessionStorage.getItem("settings") != null) {
    return JSON.parse(sessionStorage.getItem("settings"))
  }
};

export const setSettings = (key, value) => {
  if (sessionStorage.getItem("settings") != null) {
    let updatedSettings = JSON.parse(sessionStorage.getItem("settings"));
    updatedSettings[key] = value;
    axios.post('/mongodb/settings', updatedSettings)
      .then(() => {
        sessionStorage.setItem("settings", JSON.stringify(updatedSettings));
      })
  }
}

