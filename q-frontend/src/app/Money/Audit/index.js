import * as React from 'react';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';
import { getTransactions, reingestTransactions } from '../../../api/money';
import { useStore } from '../../../store';
import { selectMoneyStore } from '../../../store/selectors';
import { moneyTheme } from '../../../common/colors';
import { Button, Slate, DROP_SIZE, GAP_SIZE } from '../../../common/elements';
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
  const [paybackTransaction, setPaybackTransaction] = React.useState(null);
  async function fetchTransactions() {
    setTransactions(await getTransactions({ start, end, filter }));
  }
  React.useEffect(() => {
    async function callFetchTransactions() {
      setTransactions(null);
      setTransactions(await getTransactions({ start, end, filter }));
    }
    callFetchTransactions();
  }, [start, end, filter]);
  async function reingest() {
    setTransactions(null);
    const updatedTransactions = await reingestTransactions({ start, end, filter });
    const numNewTransactions = updatedTransactions.length - transactions.length;
    if (updatedTransactions.length > 0) {
      setTransactions(updatedTransactions);
      NotificationManager.success(`Ingestion found ${numNewTransactions} new transactions`, '👍');
    } else {
      NotificationManager.info('No transactions were updated', 'RESTART SERVER');
    }
  }
  return (
    <AuditSlate rimColor={moneyTheme.secondary}>
      <AuditHeader>
        {transactions && <Button onClick={reingest}>Reingest</Button>}
      </AuditHeader>
      {!transactions && <WaitSpinner color={moneyTheme.tertiary} />}
      {transactions && transactions.map(transaction => (
        <Transaction
          key={transaction._id}
          transaction={transaction}
          paybackTransaction={paybackTransaction}
          setPaybackTransaction={setPaybackTransaction}
          fetchTransactions={fetchTransactions}
        />
      ))}
    </AuditSlate>
  );
};

export default Audit;
