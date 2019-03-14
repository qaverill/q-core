
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
  const day = date.getDate() + 1 < 10 ? `0${date.getDate() + 1}` : date.getDate() + 1;
  return `${month}/${day}/${date.getFullYear()}`
};

export const ONE_EPOCH_DAY = 86400;

