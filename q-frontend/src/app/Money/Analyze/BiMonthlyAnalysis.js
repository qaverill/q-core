import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import {
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { yellow, random } from '../../../packages/colors';
import { times } from '../../../packages/utils';
import { useStore } from '../../../store';
import WaitSpinner from '../../../components/WaitSpinner';
import { selectMoneyStore } from '../../../store/selectors';
import { getBiMonthlyAnalysis } from '../../../api/money';
// ----------------------------------
// HELPERS
// ----------------------------------
const getKeyTags = ({ incomes, expenses }) => [...R.keys(incomes), ...R.keys(expenses)];
const formatGraphData = (analyses) => (
  analyses.map(({ timestamp, delta, incomes, expenses }, idx) => ({
    name: `${times.getMonthAndYear(timestamp)} ${idx % 2 === 0 ? 'A' : 'B'}`,
    delta,
    ...incomes,
    ...expenses,
  }))
);
const gradientOffset = (graphData) => {
  const dataMax = Math.max(...graphData.map(i => i.delta));
  const dataMin = Math.min(...graphData.map(i => i.delta));
  if (dataMax <= 0) return 0;
  if (dataMin >= 0) return 1;
  return dataMax / (dataMax - dataMin);
};
const roundDomainMin = dataMin => Math.floor(dataMin / 100) * 100;
const roundDomainMax = dataMax => Math.ceil(dataMax / 100) * 100;
// ----------------------------------
// STYLES
// ----------------------------------
const TopChartsDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const BiMonthlyAnalysis = () => {
  const { state } = useStore();
  const { start, end, filter } = selectMoneyStore(state);
  const [analyses, setAnalyses] = React.useState([]);
  React.useEffect(() => {
    async function fetchGraphData() {
      setAnalyses([]);
      const query = { start, end, filter };
      const data = await getBiMonthlyAnalysis(query);
      console.log(data);
      setAnalyses(data);
    }
    fetchGraphData();
  }, [start, end, filter]);
  const graphData = formatGraphData(analyses);
  const tagsInGraph = R.uniq(R.flatten(R.map(getKeyTags, analyses)));
  return (
    <TopChartsDiv>
      {R.isEmpty(analyses) && <WaitSpinner message="Loading Money..." />}
      {!R.isEmpty(analyses) && (
        <ResponsiveContainer>
          <ComposedChart data={graphData} stackOffset="sign">
            <CartesianGrid stroke="#ccc" />
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={gradientOffset(graphData)} stopColor="green" stopOpacity={1} />
                <stop offset={gradientOffset(graphData)} stopColor="red" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[roundDomainMin, roundDomainMax]} />
            <Tooltip />
            <ReferenceLine y={0} stroke="#000" />
            {tagsInGraph.map(tag => <Bar dataKey={tag} stackId="Q" fill={random()} key={tag} />)}
            <Area type="monotone" dataKey="delta" stroke={yellow} fill="url(#splitColor)" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </TopChartsDiv>
  );
};

export default BiMonthlyAnalysis;
