const discreteTags = {
  food: ['lunch', 'groceries'],
  drugs: ['booze'],
  travel: ['uber'],
  living: ['rent', 'utilities'],
};

module.exports = {
  tagTransaction: transaction => {
    const { tags } = transaction;
    const description = transaction.description.toLowerCase();
    const { amount } = transaction;
    if (description.indexOf('venmo from') > -1) {
      return ['NEEDS ORDINAL'];
    }
    Object.keys(discreteTags).forEach(tagKey => {
      if (new RegExp(discreteTags[tagKey].join('|')).test(description)) {
        tags.push(tagKey);
      }
    });
    if (description.indexOf('venmo') > -1) tags.push('venmo');
    if (description.indexOf('check deposit') > -1 && amount === 1150) tags.push('rent');
    return [...new Set(tags)];
  },
};
