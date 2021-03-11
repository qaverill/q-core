const R = require('ramda');
const { executeSQL, timeframeToQuery } = require('../mssql');
// ----------------------------------
// HELPERS
// ----------------------------------
const parseTransactions = (resolve, justOne) => R.compose(
  resolve,
  (x) => (justOne ? x[0] : x),
  R.map(R.evolve({ tags: R.split(',') })),
  R.prop('recordset'),
);
const rowsAffected = (resolve) => R.compose(
  resolve,
  R.prop('rowsAffected'),
);
// ----------------------------------
// CRUD mssql
// ----------------------------------
module.exports = {
  createTransactions: (transactions) => new Promise((resolve) => {
    const values = transactions.map(
      (t) => `('${t.id}',${t.timestamp},${t.amount},'${t.description.replace(/'/g, "''")}','${t.account}','${t.tags.join(',')}')`,
    ).join(',');
    executeSQL(`INSERT INTO dbo.transactions (id, timestamp, amount, description, account, tags) VALUES ${values}`)
      .then(rowsAffected(resolve));
  }),
  readTransaction: (id) => new Promise((resolve) => {
    executeSQL(`SELECT * FROM dbo.transactions WHERE id='${id}'`)
      .then(parseTransactions(resolve, true));
  }),
  readTransactions: (timeframe) => new Promise((resolve) => {
    executeSQL(`SELECT * FROM dbo.transactions ${timeframeToQuery(timeframe)}`)
      .then(parseTransactions(resolve));
  }),
  updateTransaction: ({ id, amount }) => new Promise((resolve) => {
    executeSQL(`UPDATE dbo.transactions SET amount=${amount} WHERE id='${id}'`)
      .then(rowsAffected(resolve));
  }),
  deleteTransaction: (id) => new Promise((resolve) => {
    executeSQL(`DELETE FROM dbo.transactions WHERE id='${id}'`)
      .then(rowsAffected(resolve));
  }),
  deleteTransactions: () => new Promise((resolve) => {
    executeSQL('DELETE FROM dbo.transactions')
      .then(rowsAffected(resolve));
  }),
};
