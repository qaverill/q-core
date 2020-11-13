const fs = require('fs')
const path = require('path')
// ----------------------------------
// HELPERS
// ----------------------------------
const RENT_AMOUNT = -1150;
// TODO: this should really be saved in a file and read into memory only when needed
function excludeVenmoFrom(description) {
  const venmoFromExcludes = [
    'Customer Data Security Breach',
    'this must have been an accident',
  ];
  return !venmoFromExcludes.every(str => !description.toLowerCase().includes(str.toLowerCase()));
}
// ----------------------------------
// LOGIC
// ----------------------------------
const generateTags = (fact, tags, parentTag) => {
  const lowercaseDescription = fact.description.toLowerCase();
  if (Array.isArray(tags)) {
    return [...new Set(
      tags.map(keyWord => (
        lowercaseDescription.includes(keyWord.toLowerCase())
          ? parentTag
          : null
      )).filter(tag => tag != null),
    )];
  }
  return [...new Set(Object.keys(tags).flatMap(subTag => {
    const possibleTag = generateTags(fact, tags[subTag], subTag);
    return possibleTag.length > 0 ? [parentTag, ...possibleTag] : null;
  }).filter(tag => tag != null))];
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  tagTransaction: fact => {
    const { description, amount } = fact;
    if (description.toLowerCase().includes('venmo from') && !excludeVenmoFrom(description)) {
      return ['payBack'];
    }
    if (description.includes('Check Withdrawal') && amount === RENT_AMOUNT) {
      return ['living', 'rent'];
    }
    const tags = JSON.parse(fs.readFileSync(path.join(__dirname, './tags.json'), 'utf-8'))
    return generateTags(fact, tags, null);
  },
  testTagTransaction: (fact, tags, label) => generateTags(fact, tags, label),
};
