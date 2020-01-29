/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dashboardQTheme } from '@q/colors';
import { Page } from '@q/core';

import LightSwitch from './LightSwitch';
import SpotifyCycle from './SpotifyCycle';
import LoadingSpinner from '../../../components/loading-spinner';
import { getLights } from '../../../api/lifx';
import { getCurrentlyPlayingTrack } from '../../../api/spotify';

const LightsStyled = styled(Page)`
  height: 30%;
  width: 20%;
  margin: 10px;
  border: 5px solid ${dashboardQTheme.secondary};
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

const LightHub = () => {
  const [lights, setLights] = useState(null);
  const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState(null);

  useEffect(() => getLights(lifxResponse => setLights(lifxResponse)));
  useEffect(() => getCurrentlyPlayingTrack(track => {
    setCurrentlyPlayingTrack(track);
  }), []);

  return (
    <LightsStyled>
      <LightSwitches>
        {lights
          ? lights.map(light => <LightSwitch light={light} />)
          : <LoadingSpinner color={dashboardQTheme.tertiary} />}
      </LightSwitches>
      {currentlyPlayingTrack
        ? <SpotifyCycle lights={lights} albumCover={currentlyPlayingTrack.item.album.images[1].url} />
        : <LoadingSpinner color={dashboardQTheme.tertiary} />}
    </LightsStyled>
  );
};

export default LightHub;
