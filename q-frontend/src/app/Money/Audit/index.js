import * as React from 'react';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';
import { getTransactions } from '../../../api/money';
import { useStore } from '../../../store';
import { selectMoneyStore } from '../../../store/selectors';

import ManualTagger from './ManualTagger';
import { red, green, yellow, moneyTheme } from '../../../packages/colors';
import { epochToString, copyStringToClipboard, numberToPrice } from '../../../packages/utils';
import { Button, StyledPopup, H2 } from '../../../packages/core';
import { refreshIcon } from '../../../packages/images';
import LoadingSpinner from '../../../components/LoadingSpinner';
// ----------------------------------
// HELPERS
// ----------------------------------
const LOADING_MESSAGE = 'Loading transactions...';
const copyIdToClipboard = _id => {
  copyStringToClipboard(_id);
  NotificationManager.success('Copied transaction to clipboard', _id);
};
// ----------------------------------
// STYLES
// ----------------------------------
const Viewer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;
const TransactionFact = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background-color: ${props => (props.amount < 0 ? `rgba(255, 0, 0, 0.1)` : `rgba(0, 255, 0, 0.1)`)};
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
  white-space: pre;
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
const Transaction = ({ transaction, idx }) => {
  const { _id, timestamp, amount, description, tags } = transaction;
  function craftTagButton() {
    let color = tags.length === 0 ? red : green;
    let label = tags.length === 0 ? 'TAG ME' : tags.join(' | ');
    if (tags.includes('payBack')) {
      color = yellow;
      label = 'payBack';
    }
    return <Button color={color} data-tip={tags.join(' | ')}>{label}</Button>;
  }

  return (
    <TransactionFact amount={amount}>
      <Button color={moneyTheme.tertiary} onClick={() => copyIdToClipboard(_id)}>_id</Button>
      <DateColumn><H2>{epochToString(timestamp)}</H2></DateColumn>
      <AmountColumn><H2>{numberToPrice(amount)}</H2></AmountColumn>
      <DescriptionColumn><H2>{description}</H2></DescriptionColumn>
      <TagsColumn>
        <H2>{tags.length}</H2>
        <StyledPopup modal trigger={craftTagButton(transaction)}>
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

const Audit = () => {
  const { state } = useStore();
  const { start, end, filter } = selectMoneyStore(state);
  const [transactions, setTransactions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true);
      setTransactions(await getTransactions({ start, end, filter }));
      setIsLoading(false);
    }
    fetchTransactions();
  }, [start, end, filter]);
  return (
    <Viewer>
      {isLoading && <LoadingSpinner message={LOADING_MESSAGE} />}
      {transactions.map((transaction, idx) => (
        <Transaction transaction={transaction} idx={idx} />
      ))}
    </Viewer>
  );
};

export default Audit;
