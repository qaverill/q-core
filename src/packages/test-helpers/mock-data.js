/* eslint-disable object-curly-newline */
module.exports = {
  transactions: [
    { id: '8', account: 'h', timestamp: 8, amount: 1, description: '8', tags: ['1', '2', '3'] },
    { id: '7', account: 'g', timestamp: 7, amount: -7, description: '7', tags: ['1', '2', '3'] },
    { id: '6', account: 'f', timestamp: 6, amount: 6, description: '6', tags: ['1', '2', '3'] },
    { id: '5', account: 'e', timestamp: 5, amount: -5, description: '5', tags: ['1', '2', '3'] },
    { id: '4', account: 'd', timestamp: 4, amount: 4, description: '4', tags: ['1', '2', '3'] },
    { id: '3', account: 'c', timestamp: 3, amount: -3, description: '3', tags: ['1', '2', '3'] },
    { id: '2', account: 'b', timestamp: 2, amount: 2, description: '2', tags: ['1', '2', '3'] },
    { id: '1', account: 'a', timestamp: 1, amount: -1, description: "1's", tags: ['1', '2', '3'] },
    { id: '0', account: '0', timestamp: 0, amount: 1, description: "0's", tags: ['0'] },
  ],
  mockPaybacks: [
    { from: '2', to: '3' },
    { from: '4', to: '5' },
    { from: '6', to: '7' },
  ],
  mockBankFacts: [
    { id: '3', timestamp: 3, amount: 3, description: '3', account: 'c' },
    { id: '241c85ab49f466bea84226ef9059dbaa', timestamp: 3, amount: 1.77, description: 'this description should be it', account: 'mvcu-savings' },
    { id: '2', timestamp: 2, amount: 2, description: '2', account: 'b' },
    { id: '1', timestamp: 1, amount: 1, description: '1', account: 'a' },
  ],
};
