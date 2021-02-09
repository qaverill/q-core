const logger = require('@q/logger');
const sql = require('mssql');
const { SQL_CONFIG } = require('../../config');
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readTransactions: () => new Promise((resolve) => {
    sql.connect(SQL_CONFIG, (connectError) => {
      if (connectError) logger.error('Failed connecting to SQL', connectError);
      const request = new sql.Request();
      request.query('SELECT * FROM dbo.transactions', (queryError, results) => {
        if (queryError) logger.error('Failed querying SQL', queryError);
        resolve(results.recordset);
        sql.close();
      });
    });
  }),
};
