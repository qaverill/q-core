import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';
import { getTransactions, runAutoTagOnTransactions } from '../../../api/money';
import { useStore } from '../../../store';
import { selectMoneyStore } from '../../../store/selectors';

import ManualTagger from './ManualTagger';
import { red, green, yellow, moneyTheme } from '../../../packages/colors';
import { epochToString, copyStringToClipboard, numberToPrice } from '../../../packages/utils';
import { Button, StyledPopup, H2, Slate, DROP_SIZE, GAP_SIZE } from '../../../packages/core';
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
const AuditSlate = styled(Slate)`
  overflow: auto;
`;
const AuditHeader = styled.div`
  height: ${DROP_SIZE - GAP_SIZE}px;
  width: 100%;
  background-color: ${moneyTheme.secondary};
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;
const TransactionFact = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background-color: ${props => (props.amount < 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)')};
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
  overflow: hidden;
  text-overflow: ellipsis;
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
      setTransactions(
        R.reverse(
          R.sortBy(
            R.prop('timestamp'),
            await getTransactions({ start, end, filter }),
          ),
        ),
      );
      setIsLoading(false);
    }
    fetchTransactions();
  }, [start, end, filter]);
  async function runAutoTagOnAllTransactions() {
    const updatedTransactions = await runAutoTagOnTransactions(transactions);
    console.log(updatedTransactions);
    setTransactions(updatedTransactions);
  }
  return (
    <AuditSlate rimColor={moneyTheme.secondary}>
      {isLoading && <LoadingSpinner message={LOADING_MESSAGE} />}
      <AuditHeader>
        <Button onClick={runAutoTagOnAllTransactions}>Run Auto Tag on All</Button>
      </AuditHeader>
      {transactions.map((transaction, idx) => (
        <Transaction transaction={transaction} idx={idx} />
      ))}
    </AuditSlate>
  );
};

export default Audit;
