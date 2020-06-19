/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { dashboardTheme } from '../../../packages/colors';
import { Slate } from '../../../packages/core';

import LightSwitch from './LightSwitch';
import SpotifyCycle from './SpotifyCycle';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { getLights } from '../../../api/lifx';
import { getCPT } from '../../../api/spotify';

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

const LightHub = () => {
  const [lights, setLights] = useState(null);
  const [cpt, setCPT] = useState(null);

  useEffect(() => {
    const processLights = async () => setLights(await getLights());
    processLights();
  }, []);

  useEffect(() => {
    const processCPT = async () => setCPT(await getCPT());
    processCPT();
  }, []);

  return (
    <LightsStyled>
      <LightSwitches>
        {lights
          ? lights.map(light => <LightSwitch light={light} key={light.label} />)
          : <LoadingSpinner color={dashboardTheme.tertiary} />}
      </LightSwitches>
      {cpt
        ? <SpotifyCycle lights={lights} albumCover={cpt.item.album.images[0].url} />
        : <LoadingSpinner color={dashboardTheme.tertiary} />}
    </LightsStyled>
  );
};

export default LightHub;
