const isListOfStrings = list => (
  Array.isArray(list) && list.filter(item => typeof item === 'string').length === list.length
);

module.exports = {
  validateListens: (listens) => (
    listens.length > 0 && listens.filter(listen => (
      typeof listen.timestamp === 'number'
      && typeof listen.track === 'string'
      && typeof listen.album === 'string'
      && isListOfStrings(listen.artists)
      && typeof listen.popularity === 'number'
      && typeof listen.duration === 'number'
    )).length === listens.length
  ),
  validateSaves: (saves) => (
    saves.length > 0 && saves.filter(save => (
      typeof save.timestamp === 'number'
      && typeof save.track === 'string'
      && typeof save.album === 'string'
      && isListOfStrings(save.artists)
      && typeof save.popularity === 'number'
      && typeof save.duration === 'number'
    )).length === saves.length
  ),
};
