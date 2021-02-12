const {
  createTags,
  readTags,
  updateTags,
  deleteTags,
} = require('./tags');
const { mongoDelete } = require('../mongo');
// ----------------------------------
// TESTS
// ----------------------------------
describe('CREATE', () => {
  test('its callable', async () => {
    const result = await createTags(true);
    expect(result).toEqual(true);
  });
});
describe('READ', () => {
  test('its callable', async () => {
    const result = await readTags(true);
    expect(result).toEqual(true);
  });
});
describe('UPDATE', () => {
  test('you can not update tags, only edit bank fact files', async () => {
    const result = await updateTags(true);
    expect(result).toEqual('YOU CANNOT UPDATE TAGS, ONLY EDIT BANK FACT FILES');
  });
});
describe('DELETE', () => {
  test('its callable', async () => {
    const result = await deleteTags();
    expect(result).toEqual(true);
  });
});
