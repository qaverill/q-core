const q_utils = require('q-utils')

module.exports = { 
  parseAccountingData: (data, source) => {
    let splitData = data.split('\n');
    splitData.pop();
    splitData.shift();
    return splitData.map((line, i) => {
      const row = line.split(',');
      switch(source) {
        case 'mvcu':
          return { 
            account: row[0].indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
            timestamp: q_utils.dateToTimestamp(row[1]),
            amount: row[2].indexOf('(') > -1 ? parseFloat(`-${row[2].replace('$', '')}`) : parseFloat(row[2].replace('$', '')),
            description: row[5]
          }
        case 'citi':
          return {
            account: 'citi-credit',
            timestamp: q_utils.dateToTimestamp(row[1]),
            amount: row[3] != '' ? parseFloat(row[3]) : parseFloat(row[4]),
            description: row[2]
          }
      }
    })
  }
}