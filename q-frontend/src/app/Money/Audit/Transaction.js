import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';
import ManualTagger from './ManualTagger';
import { red, green, yellow } from '../../../packages/colors';
import { epochToString, copyStringToClipboard, numberToPrice } from '../../../packages/utils';
import { Button, StyledPopup, H2 } from '../../../packages/core';
import { refreshIcon } from '../../../packages/images';
// ----------------------------------
// HELPERS
// ----------------------------------
const PAYBACK_TAG = 'payBack';
const copyIdToClipboard = _id => {
  copyStringToClipboard(_id);
  NotificationManager.success('Copied transaction to clipboard', _id);
};
const determineColorOfTransaction = ({ tags }) => {
  if (tags.includes(PAYBACK_TAG)) {
    return 'rgba(255, 255, 0, 0.5)';
  }
  return tags.length === 0 ? 'rgba(255, 0, 0, 0.2)' : `rgba(0, 255, 0, ${0.1 * tags.length})`
}
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
const AmountColumn = styled.div`
  display: flex;
  width: 100px;
  flex-direction: row-reverse;
  flex-shrink: 0;
`;
const DescriptionColumn = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  overflow: auto;
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
const RefreshTagsButton = styled.img
  .attrs({
    src: refreshIcon,
  })`
  height: 25px;
  width: 25px;
  :hover {
    filter: brightness(1.25);
  };
  margin-right: 5px;
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
    <Button color={tags.length === 0 ? red : green} data-tip={tagString}>
      {tags.length === 0 ? 'TAG ME' : tagString}
    </Button>
  );
};

const Transaction = ({ transaction, idx }) => {
  const { _id, timestamp, amount, description, automaticTags, customTags } = transaction;
  const tags = R.concat(automaticTags, customTags);
  return (
    <TransactionFact tags={tags}>
      <DateColumn><H2>{epochToString(timestamp)}</H2></DateColumn>
      <AmountColumn>
        <Button color={amount > 1 ? green : red} onClick={() => copyIdToClipboard(_id)}>
          {numberToPrice(amount)}
        </Button>
      </AmountColumn>
      <DescriptionColumn><H2>{description}</H2></DescriptionColumn>
      <TagsColumn>
        <H2>{tags.length}</H2>
        <StyledPopup modal trigger={<TagButton tags={tags} />}>
          {closeModal => (
            <ManualTagger
              idx={idx}
              transaction={transaction}
              closeModal={closeModal}
            />
          )}
        </StyledPopup>
      </TagsColumn>
      <RefreshTagsButton />
    </TransactionFact>
  );
};

export default Transaction;
