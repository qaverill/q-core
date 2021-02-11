const R = require('ramda');
const { mongoFind, mongoInsert } = require('../mongo');
// ----------------------------------
// HELPERS
// ----------------------------------
const collection = 'newPaybacks';
// ----------------------------------
// CRUD
// ----------------------------------
module.exports = {
  createPaybacks: (paybacks, isTest) => new Promise((resolve) => {
    mongoInsert(paybacks, isTest ? `mock_${collection}` : collection)
      .then(R.compose(
        resolve,
        R.prop('insertedCount'),
      ));
  }),
  readPaybacks: (isTest) => mongoFind(null, isTest ? `mock_${collection}` : collection),
  updatePaybacks: () => 'YOU CANNOT UPDATE PAYBACKS, ALL PAYBACKS ARE FINAL',
  deletePaybacks: () => 'YOU CANNOT DELETE PAYBACKS, ALL PAYBACKS ARE FINAL',
};
