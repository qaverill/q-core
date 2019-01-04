export const capitolFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const stringToDate = (string) => {
  const list =  string.split('/');
  return new Date(`${list[2]}-${list[0]}-${list[1]}T00:00:00Z`).getTime()/1000;
};
