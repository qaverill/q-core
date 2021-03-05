const R = require('ramda');
const { mockPaybacks } = require('@q/test-helpers');
const { mockImportPaybacks, mockExportPaybacks } = require('./paybacks');
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// TESTS
// ----------------------------------
describe('Mocked payback import/exports', () => {
  beforeEach(async () => {
    await mockExportPaybacks(mockPaybacks);
  });
  it('importPaybacks (mocked)', async () => {
    const paybacks = await mockImportPaybacks();
    expect(paybacks.length).toEqual(3);
    expect(paybacks.every(({ from, to }) => !R.isNil(from) && !R.isNil(to))).toEqual(true);
    expect(paybacks.every((payback) => R.keys(payback).length === 2)).toEqual(true);
  });
  it('exportPaybacks (mocked)', async () => {
    const paybacks = [...mockPaybacks, { from: '6', to: '4' }];
    await mockExportPaybacks(paybacks);
    const newPaybacks = await mockImportPaybacks();
    expect(newPaybacks).toEqual([
      { from: '2', to: '3' },
      { from: '6', to: '4' },
      { from: '4', to: '5' },
      { from: '6', to: '7' }, // yes this is illegal but it was the easiest way to test this
    ]);
  });
});
