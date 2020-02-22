const { getDocs, postDocs, putDoc, deleteDoc } = require('../resources/methods/internal');

const createQuery = ({ path, params, query }) => {
  const _id = path.split('/')[3];
  if (_id) {
    return { _id };
  }
  const newQuery = {};
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach(key => {
      newQuery[key] = parseInt(params[key], 10) || params[key];
    });
    return newQuery;
  }
  const { start, end, filter } = query;
  newQuery.timestamp = {};
  if (start) {
    newQuery.timestamp.$gte = parseInt(start, 10);
  }
  if (end) {
    newQuery.timestamp.$lte = parseInt(end, 10);
  }
  if (filter && filter !== '') {
    const [type, id] = filter.split('=');
    newQuery[type] = id;
  }
  if (Object.keys(newQuery.timestamp).length === 0) {
    delete newQuery.timestamp;
  }
  return newQuery;
};

const createCollection = request => request.path.split('/')[2];

module.exports = {
  handleInternalGetRequest: async ({ request, response }) => {
    const collection = createCollection(request);
    const query = createQuery(request);
    getDocs({ collection, query })
      .then(data => response.status(200).json(data))
      .catch(() => response.status(400).send());
  },
  handleInternalPostRequest: async ({ request, response }) => {
    const { body: docs } = request;
    const collection = createCollection(request);
    postDocs({ collection, docs })
      .then(() => response.status(204).send())
      .catch(() => response.status(400).send());
  },
  handleInternalPutRequest: async ({ request, response }) => {
    const { body: doc } = request;
    const collection = createCollection(request);
    const query = createQuery(request);
    putDoc({ collection, query, doc })
      .then(() => response.status(204).send())
      .catch(() => response.status(400).send());
  },
  handleInternalDeleteRequest: async ({ request, response }) => {
    const collection = createCollection(request);
    const query = createQuery(request);
    deleteDoc({ collection, query })
      .then((deletedCount) => response.status(deletedCount === 1 ? 200 : 404).send())
      .catch(() => response.status(400).send());
  },
};
