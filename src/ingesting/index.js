const { ingestMoney } = require('./money');

module.exports = () => {
  // TODO: only do this when files changed
  ingestMoney();
};
