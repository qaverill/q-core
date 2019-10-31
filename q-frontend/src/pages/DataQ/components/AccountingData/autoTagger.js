const discreteTags = {
  food: ['lunch', 'groceries'],
  drugs: ['booze'],
  travel: ['uber'],
  living: ['rent', 'utilities'],
};

module.exports = {
  autoTagTransaction: transaction => {
    const { tags, amount } = transaction;
    const description = transaction.description.toLowerCase();
    if (description.indexOf('venmo from') > -1) {
      return ['NEEDS ORDINAL'];
    }
    Object.keys(discreteTags).forEach(tagKey => {
      discreteTags[tagKey].forEach(tag => {
        if (description.indexOf(tag) > -1) {
          tags.push(tagKey);
          tags.push(tag);
        }
      });
    });
    if (description.indexOf('venmo') > -1) tags.push('venmo');
    if (description.indexOf('check withdrawal') > -1 && amount === -1150) tags.push('rent');
    return [...new Set(tags)];
  },
};
