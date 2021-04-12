const sql = require('mssql');
const R = require('ramda');
const logger = require('@q/logger');
const { SQL_CONFIG } = require('../config');
// ----------------------------------
// HELPERS
// ----------------------------------
const CHUNK_SIZE = 1000;
const executeSQL = (query) => new Promise((resolve) => {
  sql.connect(SQL_CONFIG, (connectError) => {
    if (connectError) logger.error('Failed connecting to SQL', connectError);
    const request = new sql.Request();
    request.query(query, (queryError, results) => {
      if (queryError) logger.error('Failed querying SQL', queryError);
      resolve(results);
      sql.close();
    });
  });
});
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  executeSQL,
  executeInsertSQL: (insertStatement, values) => {
    const chunks = R.splitEvery(CHUNK_SIZE, values);
    return R.compose(
      R.reduce((p, fn) => p.then(fn), Promise.resolve(0)),
      R.map((chunk) => (valuesInserted) => new Promise((resolve) => {
        executeSQL(`${insertStatement} ${chunk.join(',')}`)
          .then(({ rowsAffected }) => { resolve(valuesInserted + rowsAffected[0]); });
      })),
    )(chunks);
  },
  timeframeToQuery: (timeframe = {}) => {
    const { start, end, filter } = timeframe;
    if (!start && !end && !filter) return '';
    const criteria = [];
    if (start) criteria.push(`timestamp >= ${start}`);
    if (end) criteria.push(`timestamp <= ${end}`);
    if (filter) criteria.push(`tags LIKE '%${filter}%'`);
    return `WHERE ${criteria.join(' AND ')}`;
  },
};
