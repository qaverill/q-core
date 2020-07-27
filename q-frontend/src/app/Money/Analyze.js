import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Slate } from '../../packages/core';
import { moneyTheme } from '../../packages/colors';
import { times } from '../../packages/utils';
import { useStore } from '../../store';
import WaitSpinner from '../../components/WaitSpinner';
import { selectMoneyStore } from '../../store/selectors';
import { getBiMonthlyAnalysis } from '../../api/money';
// ----------------------------------
// HELPERS
// ----------------------------------
function formatGraphData(analyses) {
  const seconds = analyses.filter((_, idx) => idx % 2 === 1);
  const firsts = analyses.filter((_, idx) => idx % 2 === 0).splice(0, seconds.length);
  return firsts.map(({ date, netAmount }, idx) => ({
    name: times.getNameOfMonth(date),
    first: netAmount,
    second: seconds[idx].netAmount,
  }));
}
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
const Analyze = () => {
  const { state } = useStore();
  const { start, end, filter } = selectMoneyStore(state);
  const [graphData, setGraphData] = React.useState([]);
  React.useEffect(() => {
    async function fetchGraphData() {
      setGraphData([]);
      const query = { start, end, filter };
      const analyses = await getBiMonthlyAnalysis(query);
      setGraphData(formatGraphData(analyses));
    }
    fetchGraphData();
  }, [start, end, filter]);
  return (
    <TopChartsSlate rimColor={moneyTheme.secondary}>
      {R.isEmpty(graphData) && <WaitSpinner message="Loading Money..." />}
      {!R.isEmpty(graphData) && (
        <BarChart height={1000} width={1900} data={graphData}>
          <Bar dataKey="first" fill={moneyTheme.primary} />
          <Bar dataKey="second" fill={moneyTheme.tertiary} />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </BarChart>
      )}
    </TopChartsSlate>
  );
};

export default Analyze;
