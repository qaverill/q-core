
module.exports = {
  tagTransaction: transaction => {
    if (transaction.description.indexOf('Online Payment') > -1) {
      console.log(transaction)
    }
    const tags = ['AH', 'SHIT'];
    return [...new Set(tags)];
  },
};
