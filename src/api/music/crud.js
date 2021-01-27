// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readListens: ({ start, end }) => new Promise((resolve) => {
    console.log(start, end);
    resolve({ start, end });
  }),
};
