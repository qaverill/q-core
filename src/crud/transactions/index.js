const R = require('ramda');
const { executeSQL, timeframeToQuery } = require('../mssql');
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// CRUD
// ----------------------------------
module.exports = {
  createTransactions: (transactions) => new Promise((resolve) => {
    const values = transactions.map(
      (t) => `('${t._id}','${t.account}',${t.timestamp},${t.amount},'${t.description}','${t.tags.join(',')}')`,
    ).join(',');
    executeSQL(`INSERT INTO dbo.transactions (_id, account, timestamp, amount, description, tags) VALUES ${values}`)
      .then(R.compose(
        resolve,
        R.prop('rowsAffected'),
      ));
  }),
  readTransactions: (timeframe) => new Promise((resolve) => {
    executeSQL(`SELECT * FROM dbo.transactions ${timeframeToQuery(timeframe)}`)
      .then(R.compose(
        resolve,
        R.map(R.evolve({ tags: R.split(',') })),
        R.prop('recordset'),
      ));
  }),
  updateTransactions: () => 'YOU CANNOT UPDATE TRANSACTIONS, ONLY ADD PAYBACK OR EDIT FILES',
  deleteTransactions: () => new Promise((resolve) => {
    executeSQL('DELETE FROM dbo.transactions')
      .then(R.compose(
        resolve,
        R.prop('rowsAffected'),
      ));
  }),
};
