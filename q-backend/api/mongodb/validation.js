const { q_logger } = require('q-lib');

const isListOfStrings = list => (
  Array.isArray(list) && list.filter(item => typeof item === 'string').length === list.length
);

module.exports = {
  validateDataForPost: (collection, items) => {
    switch (collection) {
      case 'listens':
      case 'saves':
        return items.length > 0 && items.filter(save => (
          typeof save.timestamp === 'number'
          && typeof save.track === 'string'
          && typeof save.album === 'string'
          && isListOfStrings(save.artists)
          && typeof save.popularity === 'number'
          && typeof save.duration === 'number'
        )).length === items.length;
      case 'transactions':
        return items.length > 0 && items.filter(transaction => (
          typeof transaction.account === 'string'
          && typeof transaction.timestamp === 'number'
          && typeof transaction.amount === 'number'
          && typeof transaction.description === 'string'
          && Array.isArray(transaction.tags) && transaction.tags.length > 0
        )).length === items.length;
      default:
        q_logger.error('Tried to validate items in an unknown collection: ', collection);
        return false;
    }
  },
}
