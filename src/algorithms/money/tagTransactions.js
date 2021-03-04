const { importTags } = require('../../data/money/tags');
// ----------------------------------
// HELPERS
// ----------------------------------
const determineTags = (bankFact, tags, parentTag) => {
  const { description } = bankFact;
  const lowercaseDescription = description.toLowerCase();
  if (Array.isArray(tags)) {
    return [...new Set(
      tags.map((keyWord) => (
        lowercaseDescription.includes(keyWord.toLowerCase())
          ? parentTag
          : null
      )).filter((tag) => tag != null),
    )];
  }
  return [...new Set(Object.keys(tags).flatMap((subTag) => {
    const possibleTag = determineTags(bankFact, tags[subTag], subTag);
    return possibleTag.length > 0 ? [parentTag, ...possibleTag] : null;
  }).filter((tag) => tag != null))];
};
const checkForSpecialCases = ({ description, amount }) => {
  const caseInsensitiveDescription = description.toLowerCase();
  const excludeVenmoFrom = () => (![
    'Customer Data Security Breach',
    'this must have been an accident',
  ].every((str) => !caseInsensitiveDescription.includes(str.toLowerCase())));
  if (caseInsensitiveDescription.includes('venmo from') && !excludeVenmoFrom(description)) {
    return ['payBack'];
  }
  if (caseInsensitiveDescription.includes('check withdrawal') && amount === -1150) {
    return ['living', 'rent', 'butnam'];
  }
  return null;
};
// ----------------------------------
// LOGIC
// ----------------------------------
module.exports = {
  tagTransactions: (bankFacts) => {
    const tags = importTags();
    const isSingleTransaction = Array.isArray(bankFacts);
    const result = (isSingleTransaction ? bankFacts : [bankFacts]).map((bankFact) => {
      const presetTags = checkForSpecialCases(bankFact);
      return { ...bankFact, tags: presetTags || determineTags(bankFact, tags, null) };
    });
    return isSingleTransaction ? result : result[0];
  },
};
