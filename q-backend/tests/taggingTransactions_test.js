const { testTagTransaction } = require('../ingesting/money/tagging');
// ----------------------------------
// MOCK DATA
// ----------------------------------
const tags = {
  number: {
    even: ['2', '4', '6', '8'],
    odd: ['1', '3', '5', '7', '9'],
    negative: ['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9'],
  },
  bingo: ['bingo', 'lingo', 'dingo'],
  letters: {
    a: {
      ax1: ['a'],
      ax2: ['aa'],
      ax4: ['aaaa'],
    },
    b: {
      bx2: ['bb'],
      bx3: ['bbb'],
    },
  },
};
// ----------------------------------
// TESTS
// ----------------------------------
const tests = [
  { description: 'dingo21', expected: ['number', 'even', 'odd', 'bingo'] },
  { description: 'aabbb-', expected: ['letters', 'a', 'ax1', 'ax2', 'b', 'bx2', 'bx3'] },
  { description: '0bingo lingo   dingo', expected: ['bingo'] },
  { description: '-9', expected: ['number', 'odd', 'negative'] },
  { description: '', expected: [] },
  {
    description: '123456789-1-2-3-4-5-6-7-8-9bingolingo dingo a aa aaaa bb bbb bbbb',
    expected: ['number', 'even', 'odd', 'negative', 'bingo', 'letters', 'a', 'ax1', 'ax2', 'ax4', 'b', 'bx2', 'bx3'],
  },
  { description: 'nothing', expected: [] },
  { description: 'nothing', expected: [] },
];
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  path: '/resources/money::taggingTransactions',
  algorithm: (i) => testTagTransaction(tests[i], tags, null),
  tests,
};
