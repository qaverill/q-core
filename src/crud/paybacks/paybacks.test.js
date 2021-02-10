const {
  createPaybacks,
  readPaybacks,
  updatePaybacks,
  deletePaybacks,
} = require('.');

describe('CREATE', () => {
  test('is callable', async () => {
    const result = await createPaybacks();
    expect(result).toEqual(true);
  });
});
describe('READ', () => {
  test('is callable', async () => {
    const result = await readPaybacks();
    expect(result).toEqual(true);
  });
});
describe('UPDATE', () => {
  test('is callable', async () => {
    const result = await updatePaybacks();
    expect(result).toEqual(true);
  });
});
describe('DELETE', () => {
  test('is callable', async () => {
    const result = await deletePaybacks();
    expect(result).toEqual(true);
  });
});
