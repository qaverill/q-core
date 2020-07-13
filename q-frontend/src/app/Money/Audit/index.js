import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
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
  React.useEffect(() => {
    async function fetchTransactions() {
      setTransactions(null);
      setTransactions(await getTransactions({ start, end, filter }));
    }
    fetchTransactions();
  }, [start, end, filter]);
  async function tagTransactions() {
    setTransactions(null);
    setTransactions(await runTransactionTagger(transactions));
  }
  return (
    <AuditSlate rimColor={moneyTheme.secondary}>
      <AuditHeader>
        {transactions && <Button onClick={tagTransactions}>Run Auto Tag on All</Button>}
      </AuditHeader>
      {!transactions && <WaitSpinner />}
      {transactions && transactions.map((transaction, idx) => (
        <Transaction transaction={transaction} idx={idx} />
      ))}
    </AuditSlate>
  );
};

export default Audit;
