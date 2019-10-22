
module.exports = {
  tagTransaction: transaction => {
    const tags = [];
    console.log(transaction);
    return [...new Set(tags)];
  },
};
