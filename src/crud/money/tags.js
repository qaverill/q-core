// ----------------------------------
// CRUD
// ----------------------------------
module.exports = {
  createTags: (tags) => new Promise((resolve) => {
    // TODO: write tags wherever I'm going to store it (mssql, mong, redis)
    resolve(true);
  }),
  readTags: () => new Promise((resolve) => {
    // TODO: read tags from wherever they are being stored
    // return as object
    resolve(true);
  }),
  updateTags: () => 'YOU CANNOT UPDATE TAGS, ONLY EDIT BANK FACT FILES',
  deleteTags: () => new Promise((resolve) => {
    // TODO: delete all tags from wherever they are being stored
    resolve(true);
  }),
};
