/* eslint-disable no-undef */
import * as React from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { dashboardTheme } from '../../common/colors';
import { Slate, H3 } from '../../common/elements';
import CurrentlyPlayingTrack from './CurrentlyPlayingTrack';
import LightChanger from './LightChanger';
import WaitSpinner from '../../components/WaitSpinner';
import { getLights } from '../../api/lifx';
import { getDeskStatus, setDeskPower } from '../../api/kasa';
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
  display: flex;
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
  const [deskIsOn, setDeskIsOn] = React.useState(false);
  const [lights, setLights] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      const { on_time } = await getDeskStatus();
      setDeskIsOn(on_time !== 0);
      if (on_time !== 0) {
        setLights(await getLights());
      }
    }
    fetchData();
  }, []);

  function handleDeskToggle() {
    setDeskPower(!deskIsOn);
    setDeskIsOn(!deskIsOn);
    if (!deskIsOn) {
      setTimeout(async () => { setLights(await getLights()) }, 2000);
    } else {
      setLights(null);
    }
  }

  return (
    <DashboardPage rimColor={dashboardTheme.primary}>
      <Widget>
        <H3>Power Desk</H3>
        <Switch checked={deskIsOn} onChange={handleDeskToggle} />
      </Widget>
      {deskIsOn && (
        <Widget>
          {lights ? <LightChanger lights={lights} /> : <WaitSpinner />}
        </Widget>
      )}
      <Widget>
        {lights ? <CurrentlyPlayingTrack lights={lights} /> : <WaitSpinner /> }
      </Widget>
    </DashboardPage>
  );
};

export default Dashboard;
