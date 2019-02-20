
export const capitolFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const stringToDate = (string) => {
  const list =  string.split('/');
  return new Date(`${list[2]}-${list[0]}-${list[1]}T00:00:00Z`).getTime()/1000;
};

export const epochToString = (epoch) => {
  if (epoch != null) return dateToString(new Date(epoch * 1000))
};

export const dateToString = (date) => {
  return `${date.getMonth() + 1}/${date.getDate() + 1}/${date.getFullYear()}`
};
