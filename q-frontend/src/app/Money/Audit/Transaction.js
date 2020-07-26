import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';
import { red, green, yellow, moneyTheme } from '../../../packages/colors';
import { epochToString, numberToPrice } from '../../../packages/utils';
import { Button, H2 } from '../../../packages/core';
import { markPaybackTransaction } from '../../../api/money';
// ----------------------------------
// HELPERS
// ----------------------------------
const PAYBACK_TAG = 'payBack';
const determineColorOfTransaction = ({ tags }) => {
  if (tags.includes(PAYBACK_TAG)) {
    return 'rgba(255, 255, 0, 0.5)';
  }
  return tags.length === 0 ? 'rgba(255, 0, 0, 0.2)' : `rgba(0, 255, 0, ${0.1 * tags.length})`;
};
// ----------------------------------
// STYLES
// ----------------------------------
const TransactionFact = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background-color: ${determineColorOfTransaction};
  border-radius: 15px;
  margin: 5px;
`;
const DateColumn = styled.div`
  display: flex;
  flex-shrink: 0;
`;
const PaybackMarker = styled.div`
  display: flex;
  width: 40px;
  flex-shrink: 0;
  flex-direction: row-reverse;
`;
const AmountColumn = styled.div`
  display: flex;
  width: 101px;
  flex-direction: row-reverse;
  flex-shrink: 0;
`;
const DescriptionColumn = styled(H2)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  overflow: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;
const TagsColumn = styled.div`
  display: flex;
  width: 255px;
  align-items: center;
  flex-direction: row-reverse;
  flex-shrink: 1;
  white-space: nowrap;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const TagButton = ({ tags }) => {
  const tagString = tags.join(' | ');
  if (tags.includes(PAYBACK_TAG)) {
    return <Button color={yellow} data-tip={tagString}>{PAYBACK_TAG}</Button>;
  }
  return (
    <Button color={tags.length === 0 ? red : moneyTheme.tertiary} data-tip={tagString}>
      {tags.length === 0 ? 'TAG ME' : tagString}
    </Button>
  );
};

const Transaction = ({
  transaction,
  paybackTransaction,
  setPaybackTransaction,
  fetchTransactions,
}) => {
  const { _id, timestamp, amount, description, automaticTags, customTags } = transaction;
  const tags = R.concat(automaticTags, customTags);
  const canBeMarkedAsPaybackTo = R.isNil(paybackTransaction) && amount > 1;
  const canBeMarkedAsPaybackFrom = paybackTransaction && amount < 1;
  const isMarkedAsPayback = paybackTransaction === transaction;
  function handleTransactionPayback() {
    if (isMarkedAsPayback) {
      setPaybackTransaction(null);
    } else if (canBeMarkedAsPaybackTo) {
      setPaybackTransaction(transaction);
    } else if (canBeMarkedAsPaybackFrom) {
      const { _id: paybackId, amount: paybackAmount } = paybackTransaction;
      markPaybackTransaction({ from: paybackId, to: _id, amount: paybackAmount })
        .then(() => {
          NotificationManager.info(`Subtracted ${paybackAmount} from ${amount} (${amount + paybackAmount})`, description);
          setPaybackTransaction(null);
          fetchTransactions();
        });
    }
  }
  return (
    <TransactionFact tags={tags}>
      <DateColumn><H2>{epochToString(timestamp)}</H2></DateColumn>
      <PaybackMarker>{isMarkedAsPayback ? '💸' : ''}</PaybackMarker>
      <AmountColumn>
        <Button
          color={amount > 1 ? green : red}
          onClick={handleTransactionPayback}
          clickable={canBeMarkedAsPaybackTo || canBeMarkedAsPaybackFrom || isMarkedAsPayback}
        >
          {numberToPrice(amount)}
        </Button>
      </AmountColumn>
      <DescriptionColumn>{description}</DescriptionColumn>
      <TagsColumn>
        <H2>{tags.length}</H2>
        <TagButton tags={tags} />
      </TagsColumn>
    </TransactionFact>
  );
};

export default Transaction;
