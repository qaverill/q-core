const R = require('ramda');
const { executeSQL, timeframeToQuery } = require('../mssql');
// ----------------------------------
// CRUD mssql
// ----------------------------------
module.exports = {
  createTransactions: (transactions) => new Promise((resolve) => {
    const values = transactions.map(
      (t) => `('${t.id}','${t.account}',${t.timestamp},${t.amount},'${t.description}','${t.tags.join(',')}')`,
    ).join(',');
    executeSQL(`INSERT INTO dbo.transactions (id, account, timestamp, amount, description, tags) VALUES ${values}`)
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
  updateTransactions: ({ id, amount }) => new Promise((resolve) => {
    executeSQL(`UPDATE dbo.transactions SET amount=${amount} WHERE id='${id}'`)
      .then(R.compose(
        resolve,
        R.prop('rowsAffected'),
      ));
  }),
  deleteTransactions: (id) => new Promise((resolve) => {
    if (id) {
      executeSQL(`DELETE FROM dbo.transactions WHERE id='${id}'`)
        .then(R.compose(
          resolve,
          R.prop('rowsAffected'),
        ));
    } else {
      executeSQL('DELETE FROM dbo.transactions')
        .then(R.compose(
          resolve,
          R.prop('rowsAffected'),
        ));
    }
  }),
};
