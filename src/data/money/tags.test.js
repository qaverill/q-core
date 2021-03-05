const { importTags } = require('./tags');
// ----------------------------------
// TESTS
// ----------------------------------
it('successfully imports tags', () => {
  const tags = importTags();
  expect(tags).toHaveProperty('food');
});
