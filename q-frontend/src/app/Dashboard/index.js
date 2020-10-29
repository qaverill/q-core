/* eslint-disable no-undef */
import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { dashboardTheme } from '../../packages/colors';
import { Slate } from '../../packages/core';
import CurrentlyPlayingTrack from './CurrentlyPlayingTrack';
import LightChanger from './LightChanger';
import WaitSpinner from '../../components/WaitSpinner';
import { getLights } from '../../api/lifx';
// ----------------------------------
// STYLES
// ----------------------------------
const DashboardPage = styled(Slate)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
const Widget = styled.div`
  flex-shrink: 0;
  border: 3px solid ${dashboardTheme.secondary};
  border-radius: 15px;
  padding: 10px;
  :hover {
    z-index: 10;
    outline: 9999px solid rgba(0,0,0,0.65);
  }
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const Dashboard = () => {
  const [lights, setLights] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      setLights(await getLights());
    }
    fetchData();
  }, []);

  return (
    <DashboardPage rimColor={dashboardTheme.primary}>
      <Widget>
        {lights ? <LightChanger lights={lights} /> : <WaitSpinner />}
      </Widget>
      <Widget>
        {lights ? <CurrentlyPlayingTrack lights={lights} /> : <WaitSpinner /> }
      </Widget>
    </DashboardPage>
  );
};

export default Dashboard;
