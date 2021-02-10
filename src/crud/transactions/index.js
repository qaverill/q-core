const sql = require('mssql');
const { SQL_CONFIG } = require('../../config');

module.exports = {
  createTransactions: (transactions) => new Promise((resolve) => {
    // TODO: write to SQL
    resolve(true);
  }),
  readTransactions: (timeframe) => new Promise((resolve) => {
    sql.connect(SQL_CONFIG, (connectError) => {
      // if (connectError) logger.error('Failed connecting to SQL', connectError);
      const request = new sql.Request();
      request.query('SELECT * FROM dbo.transactions', (queryError, results) => {
        // if (queryError) logger.error('Failed querying SQL', queryError);
        resolve(results.recordset);
        sql.close();
      });
    });
  }),
  updateTransactions: () => 'YOU CANNOT UPDATE TRANSACTIONS, ONLY ADD PAYBACK OR EDIT FILES',
  deleteTransactions: () => new Promise((resolve) => {
    // TODO: delete all transactions in SQL (it's ok, all the files/paybacks still exist)
    resolve(true);
  }),
};
