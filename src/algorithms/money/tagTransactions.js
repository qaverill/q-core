const R = require('ramda');
const { listWithoutDuplicates } = require('@q/utils');
const { importTags } = require('../../data/money/tags');
// ----------------------------------
// HELPERS
// ----------------------------------
// this must be in lower case
const ignoredVenmoFroms = [
  'customer data security breach',
  'this must have been an accident',
];
const seekTagsForFact = (tagKeys, tag, bankFact) => {
  const { id, description } = bankFact;
  function seekMatchingTagKey(tagKey) {
    const idMatch = id === tagKey;
    const lowercaseDescription = description.toLowerCase();
    const descriptionMatch = lowercaseDescription.includes(tagKey.toLowerCase());
    return idMatch || descriptionMatch ? tag : null;
  }
  const tags = tagKeys.map(seekMatchingTagKey).filter((t) => t != null);
  return listWithoutDuplicates(tags);
};
const determineTags = (bankFact, tagBranch, parentTag) => {
  const isTagLeaf = Array.isArray(tagBranch);
  function seekTagsRecursively(subBranch) {
    const possibleTag = determineTags(bankFact, tagBranch[subBranch], subBranch);
    return possibleTag.length > 0 ? [parentTag, ...possibleTag] : null;
  }
  // base case
  if (isTagLeaf) {
    return seekTagsForFact(tagBranch, parentTag, bankFact);
  }
  const tags = Object.keys(tagBranch)
    .flatMap(seekTagsRecursively)
    .filter((tag) => tag != null);
  return listWithoutDuplicates(tags);
};
const checkForSpecialCases = (transaction) => {
  const { description, amount, account } = transaction;
  const normalizedDescription = description.toLowerCase();
  const isVenmoFrom = normalizedDescription.includes('venmo from');
  const isExcludedVenmoFrom = !ignoredVenmoFroms.every((s) => !normalizedDescription.includes(s));
  const isVenmoPayback = isVenmoFrom && !isExcludedVenmoFrom;
  const isCitiRefund = account === 'citi-credit' && amount > 0;
  const isButnamRent = normalizedDescription.includes('check withdrawal') && amount === -1150;
  const isFromVinylWilliams = description.includes('Venmo from Lionel Williams');
  if (isFromVinylWilliams) return null;
  if (isVenmoPayback || isCitiRefund) return ['payBack'];
  if (isButnamRent) return ['living', 'rent', 'butnam'];
  return null;
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  tagTransactions: (bankFacts) => {
    const tagRoots = importTags();
    function bankFactToTaggedBankFact(bankFact) {
      const presetTags = checkForSpecialCases(bankFact);
      const tags = presetTags || determineTags(bankFact, tagRoots, null);
      return R.assoc('tags', tags, bankFact);
    }
    return R.map(bankFactToTaggedBankFact, bankFacts);
  },
};
