/* eslint-disable no-undef */
import * as React from 'react';
import styled from 'styled-components';
import { dashboardTheme } from '../../../packages/colors';
import { Slate } from '../../../packages/core';
import LightSwitch from './LightSwitch';
import SpotifyCycle from './SpotifyCycle';
import WaitSpinner from '../../../components/WaitSpinner';
import { getLights } from '../../../api/lifx';
import { getCurrentlyPlayingTrack } from '../../../api/spotify';
// ----------------------------------
// STYLES
// ----------------------------------
const LightsStyled = styled(Slate)`
  height: 50%;
  width: 50%;
  margin: 10px;
  border: 5px solid ${dashboardTheme.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  :hover {
    z-index: 10;
    outline: 9999px solid rgba(0,0,0,0.65);
  }
`;
const LightSwitches = styled.div`
  display: flex;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const LightHub = () => {
  const [lights, setLights] = React.useState(null);
  const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = React.useState(null);
  const albumCover = currentlyPlayingTrack && currentlyPlayingTrack.item.album.images[0].url;

  React.useEffect(() => {
    async function processLights() {
      setLights(await getLights());
    }
    processLights();
  }, []);

  React.useEffect(() => {
    async function processCurrentlyPlayingTrack() {
      setCurrentlyPlayingTrack(await getCurrentlyPlayingTrack());
    }
    processCurrentlyPlayingTrack();
  }, []);

  return (
    <LightsStyled>
      <LightSwitches>
        {lights
          ? lights.map(light => <LightSwitch light={light} key={light.label} />)
          : <WaitSpinner color={dashboardTheme.tertiary} />}
      </LightSwitches>
      {currentlyPlayingTrack
        ? <SpotifyCycle lights={lights} albumCover={albumCover} />
        : <WaitSpinner color={dashboardTheme.tertiary} />}
    </LightsStyled>
  );
};

export default LightHub;
