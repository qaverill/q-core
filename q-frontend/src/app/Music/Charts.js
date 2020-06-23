import * as React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Slate } from '../../packages/core';
import { musicTheme } from '../../packages/colors';
import { useStore } from '../../store';
import LoadingSpinner from '../../components/LoadingSpinner';
import { selectMusicStore } from '../../store/selectors';
import { getDailyPlayTime } from '../../api/music';
// ----------------------------------
// HELPERS
// ----------------------------------
const collection = 'listens';
const testData = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, { name: 'Page B', uv: 800, pv: 4800, amt: 4800 }];
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
      console.log(listens);
      setChartData(listens.map(listenToChartPoint));
      setIsLoading(false);
    }
    setIsLoading(true);
    fetchChartData();
  }, [start, end, filter]);
  return (
    <TopChartsSlate rimColor={musicTheme.secondary}>
      {isLoading && <LoadingSpinner message="Loading Music..." />}
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
