const { apiGet, apiPut } = require('@q/test-helpers');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/lifx';
const ON = 'on';
const OFF = 'off';
const PURPLEGREEN = 'purpleGreen';
const DEFAULT = 'default';
const setLights = async (preset) => {
  await apiPut(PATH, { preset });
  await new Promise(r => setTimeout(r, 1000));
  return await apiGet(PATH);
};
const assertResults = (results, preset) => {
  const power = preset === OFF ? OFF : ON;
  expect(results[0]).toHaveProperty('power', power);
  expect(results[1]).toHaveProperty('power', power);
  if (preset === PURPLEGREEN) {
    expect(results[0].preset).toMatch(/purple|green/);
    expect(results[1].preset).toMatch(/purple|green/);
  } else {
    expect(results[0].preset).toEqual(preset);
    expect(results[1].preset).toEqual(preset);
  }
}
// ----------------------------------
// TESTS
// ----------------------------------
describe(`GET ${PATH}`, () => {
  test('returns all the correct values and no more', async () => {
    const results = await apiGet(PATH);
    expect(results).toHaveLength(4);
    results.forEach((result) => {
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('uuid');
      expect(result).toHaveProperty('label');
      expect(result).toHaveProperty('connected');
      expect(result).toHaveProperty('power');
      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('brightness');
      expect(result).toHaveProperty('group.name', 'Q');
      expect(result).toHaveProperty('location.name', 'Q Palace');
      expect(result).toHaveProperty('product');
      expect(result).toHaveProperty('last_seen');
      expect(result).toHaveProperty('seconds_since_seen');
      expect(result).toHaveProperty('preset');
      expect(Object.keys(result)).toHaveLength(13);
    })
  })
});
describe(`PUT ${PATH}`, () => {
  test('each light set to its own', async () => {
    assertResults(await setLights(PURPLEGREEN), PURPLEGREEN);
  });
  test('"off" turns them off', async () => {
    assertResults(await setLights(OFF), OFF);
  });
  test('"on" turns them on but does not change color', async () => {
    assertResults(await setLights(ON), PURPLEGREEN);
  });
  test('both lights set to the same', async () => {
    assertResults(await setLights(DEFAULT), DEFAULT);
  });
  test('invalid preset returns error', async () => {
    const result = await apiPut(PATH, { preset: 'invalid' });
    expect(result).toEqual('Invalid state, possibleStates: on, off, default, purpleGreen');
  });
});