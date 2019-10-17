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
        // No other query params for this... yet
        break;
      default:
        q_logger.error('Tried to craft a query for an unknown collection: ', collection);
        return null;
    }
    if (requestQuery.start || requestQuery.end) {
      query._id = {};
      if (requestQuery.start) query._id.$gte = parseInt(requestQuery.start, 10);
      if (requestQuery.end) query._id.$lte = parseInt(requestQuery.end, 10);
    }
    return query;
  },
}
