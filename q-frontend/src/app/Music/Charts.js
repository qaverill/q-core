import * as React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Slate } from '../../packages/core';
import { musicTheme } from '../../packages/colors';
import { useStore } from '../../store';
import WaitSpinner from '../../components/WaitSpinner';
import { selectMusicStore } from '../../store/selectors';
import { getDailyPlayTime } from '../../api/music';
// ----------------------------------
// HELPERS
// ----------------------------------
const listenToChartPoint = ({ date, playTime }) => ({ name: date, uv: playTime });
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
const Charts = () => {
  const { state } = useStore();
  const { start, end, filter } = selectMusicStore(state);
  const [chartData, setChartData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    async function fetchChartData() {
      const query = { start, end, filter };
      const listens = await getDailyPlayTime(query);
      setIsLoading(true);
      setChartData(listens.map(listenToChartPoint));
      setIsLoading(false);
    }
    fetchChartData();
  }, [start, end, filter]);
  return (
    <TopChartsSlate rimColor={musicTheme.secondary}>
      {isLoading && <WaitSpinner message="Loading Music..." />}
      {!isLoading && (
        <BarChart height={1000} width={1900} data={chartData}>
          <Bar dataKey="uv" fill={musicTheme.tertiary} />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </BarChart>
      )}
    </TopChartsSlate>
  );
};

export default Charts;
