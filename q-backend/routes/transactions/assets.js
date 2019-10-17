const { q_utils, q_logger } = require('q-lib');

module.exports = {
  parseTransactionsData: (data, source) => (
    data.split('\n').slice(1, -1).map(line => {
      const row = line.split(',');
      switch (source) {
        case 'mvcu':
          return {
            account: row[0].indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
            timestamp: q_utils.dateToTimestamp(row[1]),
            amount: row[2].indexOf('(') > -1 ? parseFloat(`-${row[2].replace(/[)$(]/g, '')}`) : parseFloat(row[2].replace('$', '')),
            description: row[5],
          };
        case 'citi':
          return {
            account: 'citi-credit',
            timestamp: q_utils.dateToTimestamp(row[1]),
            amount: row[3] !== '' ? parseFloat(row[3]) * -1 : parseFloat(row[4]) * -1,
            description: row[2],
          };
        default:
          q_logger.error(`Unknown data source found in transactions data: ${source}`);
          return [];
      }
    })
  ),
};
