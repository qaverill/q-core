const { getDocs, postDocs, putDoc, deleteDoc } = require('../resources/methods/internal');

const createQuery = request => {
  let query;
  const { path } = request;
  const _id = path.split('/')[3];
  if (_id) {
    return { _id };
  }
  if (request.params) {
    query = request.params;
    Object.keys(query).forEach(key => { query[key] = parseInt(query[key], 10) || query[key]; });
  } else {
    query = request.query;
    if (query.start) {
      query.timestamp.$gte = parseInt(query.start, 10);
      delete query.start;
    }
    if (query.end) {
      query.timestamp.$lte = parseInt(query.end, 10);
      delete query.end;
    }
  }
  return query;
};
// TODO: do we really need the `async`s here?
module.exports = {
  handleInternalGetRequest: async ({ request, response }) => {
    const collection = request.path.split('/')[2];
    const query = createQuery(request);
    getDocs({ collection, query })
      .then(data => response.status(200).json(data))
      .catch(() => response.status(400).send());
  },
  handleInternalPostRequest: async ({ request, response }) => {
    const { body: docs } = request;
    const collection = request.path;
    postDocs({ collection, docs })
      .then(() => response.status(204).send())
      .catch(() => response.status(400).send());
  },
  handleInternalPutRequest: async ({ request, response }) => {
    const { path: collection, body: doc } = request;
    const query = createQuery(request);
    putDoc({ collection, query, doc })
      .then(() => response.status(204).send())
      .catch(() => response.status(400).send());
  },
  handleInternalDeleteRequest: async ({ request, response }) => {
    const collection = request.path;
    const query = createQuery(request);
    deleteDoc({ collection, query })
      .then((deletedCount) => response.status(deletedCount === 1 ? 200 : 404).send())
      .catch(() => response.status(400).send());
  },
};
