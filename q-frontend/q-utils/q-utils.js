export const ONE_EPOCH_DAY = 86400;

export const capitolFirstLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const stringToEpoch = (s) => Math.round(new Date(`${s.split('/')[2]}-${s.split('/')[0]}-${s.split('/')[1]}T00:00:00Z`).getTime() / 1000);
export const epochToString = (epoch) => epoch != null && dateToString(new Date(epoch * 1000));
export const epochToDate = (epoch) => new Date(epoch * 1000);
export const dateToEpoch = (date) => parseInt(new Date(date).getTime() / 1000, 10);
export const dateToString = (d) => `${d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1}/${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}/${d.getFullYear()}`;
export const msToString = (durationInMs) => {
    const hours = parseInt( durationInMs / 3600000);
    const minutes = parseInt( ((durationInMs / 1000) % 3600) / 60 );
    const seconds = parseInt((durationInMs / 1000) % 60);
    return (hours < 10 ? "0" + hours : hours) + 'h '
        + (minutes < 10 ? "0" + minutes : minutes) + 'm '
        + (seconds < 10 ? "0" + seconds : seconds) + 's';
};