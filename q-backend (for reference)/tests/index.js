const { q_logger } = require('../q-lib/q-logger');
const tagTransaction = require('./taggingTransactions_test');
const compileTransaction = require('./compilingTransactions_test');
const analyzeTransaction = require('./analyzingTransactions_test');
// ----------------------------------
// HELPERS
// ----------------------------------
const runTests = ({ tests, algorithm, path }) => {
  const failedTests = tests
    .map((test, idx) => ({ ...test, actual: algorithm(idx) }))
    .filter(({ actual, expected }) => JSON.stringify(actual) !== JSON.stringify(expected));
  if (failedTests.length !== 0) {
    q_logger.error(`❌ ${path} failed ${failedTests.length} tests:`);
    failedTests.forEach(test => q_logger.error('\n', test));
    return false;
  }
  q_logger.info(`✅ ${path} passed ${tests.length} tests `);
  return true;
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = [
  () => runTests(tagTransaction),
  () => runTests(compileTransaction),
  () => runTests(analyzeTransaction),
];
