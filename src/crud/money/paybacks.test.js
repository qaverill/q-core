const {
  createPaybacks,
  readPaybacks,
  updatePaybacks,
  deletePaybacks,
} = require('./paybacks');
const { mongoDelete } = require('../mongo');
// ----------------------------------
// HELPERS
// ----------------------------------
const actuallyDeletePaybacks = () => mongoDelete(null, 'mock_newPaybacks');
const data = [
  { from: '1', to: '2', amount: 11 },
  { from: '2', to: '3', amount: 22 },
  { from: '3', to: '4', amount: 33 },
  { from: '4', to: '5', amount: 44 },
  { from: '5', to: '1', amount: 55 },
];
// ----------------------------------
// TESTS
// ----------------------------------
describe('CREATE', () => {
  test('successfully creates all paybacks', async () => {
    await actuallyDeletePaybacks();
    const afterDelete = await readPaybacks(true);
    expect(afterDelete).toEqual([]);
    const result = await createPaybacks(data, true);
    expect(result).toEqual(5);
    const afterCreate = await readPaybacks(true);
    expect(afterCreate).toEqual(data);
  });
});
describe('READ', () => {
  test('successfully returns all paybacks', async () => {
    await actuallyDeletePaybacks();
    await createPaybacks(data, true);
    const result = await readPaybacks(true);
    expect(result).toEqual(data);
  });
});
describe('UPDATE', () => {
  test('you can not update paybacks, all paybacks are final', () => {
    const result = updatePaybacks();
    expect(result).toEqual('YOU CANNOT UPDATE PAYBACKS, ALL PAYBACKS ARE FINAL');
  });
});
describe('DELETE', () => {
  test('you can not delete paybacks, all paybacks are final', async () => {
    const result = await deletePaybacks();
    expect(result).toEqual('YOU CANNOT DELETE PAYBACKS, ALL PAYBACKS ARE FINAL');
  });
});
