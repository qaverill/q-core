import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Slate } from '../../packages/core';
import { moneyTheme } from '../../packages/colors';
import { useStore } from '../../store';
import WaitSpinner from '../../components/WaitSpinner';
import { selectMoneyStore } from '../../store/selectors';
import { getBinnedNetAmounts, BIN_SIZES } from '../../api/money';
// ----------------------------------
// HELPERS
// ----------------------------------
const netAmountToGraphPoint = ({ date, netAmount }) => ({ name: date, uv: netAmount });
// ----------------------------------
// STYLES
// ----------------------------------
const TopChartsSlate = styled(Slate)`
  display: flex;
  flex-direction: column;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const Graphs = () => {
  const { state } = useStore();
  const { start, end, filter } = selectMoneyStore(state);
  const [graphData, setGraphData] = React.useState([]);
  React.useEffect(() => {
    async function fetchGraphData() {
      setGraphData([]);
      const query = { start, end, filter, binSize: BIN_SIZES.BI_MONTHLY };
      const listens = await getBinnedNetAmounts(query);
      setGraphData(listens.map(netAmountToGraphPoint));
    }
    fetchGraphData();
  }, [start, end, filter]);
  return (
    <TopChartsSlate rimColor={moneyTheme.secondary}>
      {R.isEmpty(graphData) && <WaitSpinner message="Loading Money..." />}
      {graphData && (
        <BarChart height={1000} width={1900} data={graphData}>
          <Bar dataKey="uv" fill={moneyTheme.tertiary} />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </BarChart>
      )}
    </TopChartsSlate>
  );
};

export default Graphs;
