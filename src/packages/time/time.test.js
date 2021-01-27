const { currentTimeframe, getNDaysAgoTimestamp } = require('./index');

test('currentTimeFrame and getNDaysAgoTimestamp work as expected', () => {
  const twoDaysAgo = getNDaysAgoTimestamp(2);
  const fourDaysAgo = getNDaysAgoTimestamp(4);
  const { start, end } = currentTimeframe();
  expect(start).toBeGreaterThan(fourDaysAgo);
  expect(start).toBeLessThan(twoDaysAgo);
  expect(end).toBeNull();
})