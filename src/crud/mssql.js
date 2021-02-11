const sql = require('mssql');
const logger = require('@q/logger');
const { SQL_CONFIG } = require('../config');

module.exports = {
  executeSQL: (query) => new Promise((resolve) => {
    sql.connect(SQL_CONFIG, (connectError) => {
      if (connectError) logger.error('Failed connecting to SQL', connectError);
      const request = new sql.Request();
      request.query(query, (queryError, results) => {
        if (queryError) logger.error('Failed querying SQL', queryError);
        resolve(results);
        sql.close();
      });
    });
  }),
  timeframeToQuery: (timeframe = {}) => {
    const { start, end } = timeframe;
    if (start && end) return `WHERE timestamp >= ${start} AND timestamp <= ${end}`;
    if (start && end == null) return `WHERE timestamp >= ${start}`;
    return '';
  },
};
