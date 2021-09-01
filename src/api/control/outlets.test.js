const { apiGet, apiPut } = require('@q/test-helpers');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/control/outlets';
const PATH_LAVALAMP = '/control/outlets?outlet=Lavalamp';
const PATH_STERO_WALL = '/control/outlets?outlet=Stereowall';
// ----------------------------------
// TESTS
// ----------------------------------
describe.skip('outlets', () => {
  describe(`GET ${PATH}`, () => {
    test('getting the Lavalamp outlet', async () => {
      const outlets = await apiGet(PATH_LAVALAMP);
      expect(outlets).toHaveLength(1);
      const { alias, mac } = outlets[0];
      expect(alias).toEqual('Lavalamp');
      expect(mac).toEqual('B0:95:75:44:A5:D5');
      expect(outlets[0]).toHaveProperty('on_time');
    });
    test('getting the Stereo wall outlet', async () => {
      const outlets = await apiGet(PATH_STERO_WALL);
      expect(outlets).toHaveLength(1);
      const { alias, mac } = outlets[0];
      expect(alias).toEqual('Stereo wall');
      expect(mac).toEqual('B0:95:75:44:94:A8');
      expect(outlets[0]).toHaveProperty('on_time');
    });
    test('getting all outlets (no specified outlet in body)', async () => {
      const outlets = await apiGet(PATH);
      expect(outlets).toHaveLength(2);
      const { alias, mac } = outlets[0];
      expect(alias).toEqual('Stereo wall');
      expect(mac).toEqual('B0:95:75:44:94:A8');
      expect(outlets[0]).toHaveProperty('mac');
      expect(outlets[0]).toHaveProperty('alias');
      expect(outlets[0]).toHaveProperty('on_time');
      expect(outlets[1]).toHaveProperty('mac');
      expect(outlets[1]).toHaveProperty('alias');
      expect(outlets[1]).toHaveProperty('on_time');
    });
  });
  describe(`PUT ${PATH}`, () => {
    test('setting Lavalamp outlet state', async () => {
      const offResults = await apiPut(PATH_LAVALAMP, { state: 'off' });
      expect(offResults[0]).toEqual(true);
      await new Promise((r) => setTimeout(r, 1000));
      const offOutlets = await apiGet(PATH_LAVALAMP);
      expect(offOutlets[0].on_time).toEqual(0);
      const onResults = await apiPut(PATH_LAVALAMP, { state: 'on' });
      expect(onResults[0]).toEqual(true);
      await new Promise((r) => setTimeout(r, 1000));
      const onOutlets = await apiGet(PATH_LAVALAMP);
      expect(onOutlets[0].on_time).toBeGreaterThan(0);
    });
    test('setting stereowall outlet state', async () => {
      const offResults = await apiPut(PATH_STERO_WALL, { state: 'off' });
      expect(offResults[0]).toEqual(true);
      await new Promise((r) => setTimeout(r, 1000));
      const offOutlets = await apiGet(PATH_STERO_WALL);
      expect(offOutlets[0].on_time).toEqual(0);
      const onResults = await apiPut(PATH_STERO_WALL, { state: 'on' });
      expect(onResults[0]).toEqual(true);
      await new Promise((r) => setTimeout(r, 1000));
      const onOutlets = await apiGet(PATH_STERO_WALL);
      expect(onOutlets[0].on_time).toBeGreaterThan(0);
    });
    test('setting all outlets state', async () => {
      const offResults = await apiPut(PATH, { state: 'off' });
      expect(offResults[0]).toEqual(true);
      expect(offResults[1]).toEqual(true);
      await new Promise((r) => setTimeout(r, 1000));
      const offOutlets = await apiGet(PATH);
      expect(offOutlets[0].on_time).toEqual(0);
      expect(offOutlets[1].on_time).toEqual(0);
      const onResults = await apiPut(PATH, { state: 'on' });
      expect(onResults[0]).toEqual(true);
      expect(onResults[1]).toEqual(true);
      await new Promise((r) => setTimeout(r, 1000));
      const onOutlets = await apiGet(PATH);
      expect(onOutlets[0].on_time).toBeGreaterThan(0);
      expect(onOutlets[1].on_time).toBeGreaterThan(0);
    });
  });
});
