import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';
import { getTransactions, runTransactionTagger } from '../../../api/money';
import { useStore } from '../../../store';
import { selectMoneyStore } from '../../../store/selectors';
import { moneyTheme } from '../../../packages/colors';
import { Button, Slate, DROP_SIZE, GAP_SIZE } from '../../../packages/core';
import WaitSpinner from '../../../components/WaitSpinner';
import Transaction from './Transaction';
// ----------------------------------
// HELPERS
// ----------------------------------
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
// ----------------------------------
// COMPONENTS
// ----------------------------------
const Audit = () => {
  const { state } = useStore();
  const { start, end, filter } = selectMoneyStore(state);
  const [transactions, setTransactions] = React.useState(null);
  const [isTaggingTransactions, setIsTaggingTransactions] = React.useState(false);
  async function fetchTransactions() {
    setTransactions(null);
    setTransactions(await getTransactions({ start, end, filter }));
  }
  React.useEffect(fetchTransactions, [start, end, filter]);
  async function tagTransactions() {
    setIsTaggingTransactions(true);
    const updatedTransactions = await runTransactionTagger(transactions);
    if (updatedTransactions.length > 0) {
      fetchTransactions();
      NotificationManager.success(`Updated the tags of ${updatedTransactions.length} transactions`, '👍');
    } else {
      NotificationManager.info('No transactions were updated');
    }
    setIsTaggingTransactions(false);
  }
  return (
    <AuditSlate rimColor={moneyTheme.secondary}>
      <AuditHeader>
        {transactions && !isTaggingTransactions && <Button onClick={tagTransactions}>Run Auto Tag on All</Button>}
        {transactions && isTaggingTransactions && <WaitSpinner color={moneyTheme.tertiary} />}
      </AuditHeader>
      {!transactions && <WaitSpinner />}
      {transactions && transactions.map((transaction, idx) => (
        <Transaction transaction={transaction} idx={idx} />
      ))}
    </AuditSlate>
  );
};

export default Audit;
