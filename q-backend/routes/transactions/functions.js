const { q_utils, q_logger } = require('q-lib');

const parseRow = (row, source) => {
  // TODO: When description has comma in it, this all get fucks up
  switch (source) {
    case 'mvcu':
      return {
        account: row[0].indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
        timestamp: q_utils.dateToTimestamp(row[1]),
        amount: row[2].indexOf('(') > -1 ? parseFloat(row[2].replace(/[)$(]/g, '')) * -1 : parseFloat(row[2].replace('$', '')),
        description: row[5],
      };
    case 'citi':
      return {
        account: 'citi-credit',
        timestamp: q_utils.dateToTimestamp(row[1]),
        amount: row[3] !== '' ? parseFloat(row[3]) * -1 : parseFloat(row[4]) * -1,
        description: row[2].replace(/"/g, ''),
      };
    case 'venmo':
      if (typeof parseInt(row[1], 10) === 'number' && row[3] !== 'Standard Transfer' && row[8] != null) {
        const type = row[8].indexOf('+') > -1 ? 'from' : 'to';
        return {
          account: 'venmo',
          timestamp: q_utils.dateToTimestamp(row[2]),
          amount: parseFloat(row[8].replace(/[ $+]/g, '')),
          description: `Venmo ${type} ${row[6] === 'Quinn Averill' ? row[7] : row[6]}: ${row[5]}`,
        };
      }
      return null;
    default:
      return null;
  }
};

module.exports = {
  parseTransactionsData: (data, source) => {
    const parsedData = data
      .split('\n')
      .slice(1, -1)
      .map(line => parseRow(line.split(','), source))
      .filter(d => d != null);
    if (parsedData.length === 0) q_logger.error(`Unknown data source found in transactions data: ${source}`);
    return parsedData;
  },
};
