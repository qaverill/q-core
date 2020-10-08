/* eslint-disable no-undef */
import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { dashboardTheme } from '../../../packages/colors';
import { Slate } from '../../../packages/core';
import SpotifyCycle from './SpotifyCycle';
import WaitSpinner from '../../../components/WaitSpinner';
import { getLights } from '../../../api/lifx';
import { getCurrentlyPlayingTrack } from '../../../api/spotify';
import ModeSelector from './ModeSelector';
// ----------------------------------
// STYLES
// ----------------------------------
const LightsStyled = styled(Slate)`
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
  if (R.isNil(lights)) return null;
  return (
    <LightsStyled>
      {currentlyPlayingTrack
        ? <SpotifyCycle lights={lights} albumCover={albumCover} />
        : <WaitSpinner color={dashboardTheme.tertiary} />}
      {lights && <ModeSelector lights={lights} />}
    </LightsStyled>
  );
};

export default LightHub;
