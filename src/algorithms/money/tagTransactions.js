const { listWithoutDuplicates } = require('@q/utils');
const logger = require('@q/logger');
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
const determineIfVenmoIncome = (description) => {
  const isFromVinylWilliams = description.includes('Venmo from Lionel Williams');
  const isSecurityDepositReturn = description.includes('from Evan Lanctot: Security deposit');
  const isCatSitting = description.includes('Eitan Romanoff: Waffle') || description.includes('Romanoff: Cat');
  const isLastMonthRentReturn = description.includes('Evan Lanctot: Rent for August');
  return isFromVinylWilliams || isSecurityDepositReturn || isCatSitting || isLastMonthRentReturn;
};
const checkForSpecialCases = (transaction) => {
  const { description, amount, account } = transaction;
  const normalizedDescription = description.toLowerCase();
  const isVenmoFrom = normalizedDescription.includes('venmo from');
  const isExcludedVenmoFrom = !ignoredVenmoFroms.every((s) => !normalizedDescription.includes(s));
  const isVenmoPayback = isVenmoFrom && !isExcludedVenmoFrom;
  const isCitiRefund = account === 'citi-credit' && amount > 0;
  const isVenmoIncome = determineIfVenmoIncome(description);
  if (isVenmoIncome) return null;
  if (isVenmoPayback || isCitiRefund) return ['payBack'];
  return null;
};
function getBankFactTags(bankFact, tagRoots) {
  const presetTags = checkForSpecialCases(bankFact);
  const tags = presetTags || determineTags(bankFact, tagRoots, null);
  return tags;
}
function tagTransactions(bankFacts) {
  const tagRoots = importTags();
  let totalTagged = 0;
  const taggedBankFacts = bankFacts.map((bankFact) => {
    const tags = getBankFactTags(bankFact, tagRoots);
    if (tags[0] != null) {
      totalTagged += 1;
    }
    return { tags, ...bankFact };
  });
  logger.info(`Tagged ${totalTagged} bankFacts`);
  return taggedBankFacts;
}
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  tagTransactions,
};
