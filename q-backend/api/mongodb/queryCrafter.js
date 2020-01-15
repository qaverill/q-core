const { q_logger } = require('q-lib');

module.exports = {
  craftQueryForGet: (collection, requestQuery) => {
    const query = {};
    switch (collection) {
      case 'listens':
      case 'saves':
        if (requestQuery.trackID) query.track = requestQuery.trackID;
        if (requestQuery.artistID) query.artists = requestQuery.artistID;
        if (requestQuery.albumID) query.album = requestQuery.albumID;
        break;
      case 'transactions':
        if (requestQuery.ordinal) query.ordinal = parseInt(requestQuery.ordinal, 10);
        break;
      default:
        q_logger.error('Tried to craft a query for an unknown collection: ', collection);
        return null;
    }
    if (requestQuery.start || requestQuery.end) {
      query.timestamp = {};
      if (requestQuery.start) query.timestamp.$gte = parseInt(requestQuery.start, 10);
      if (requestQuery.end) query.timestamp.$lte = parseInt(requestQuery.end, 10);
    }
    return query;
  },
}
