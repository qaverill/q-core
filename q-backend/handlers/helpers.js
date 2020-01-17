const isListOfStrings = list => (
  Array.isArray(list) && list.filter(item => typeof item === 'string').length === list.length
);

module.exports = {
  createQuery: req => {
    let query;
    if (req.params) {
      query = req.params;
      Object.keys(query).forEach(key => { query[key] = parseInt(query[key], 10) || query[key]; });
    } else {
      query = req.query;
      if (query.start) {
        query.timeline.$gte = parseInt(query.start, 10);
        delete query.start;
      }
      if (query.end) {
        query.timeline.$lte = parseInt(query.end, 10);
        delete query.end;
      }
    }
    return query;
  },
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
        return false;
    }
  },
};
