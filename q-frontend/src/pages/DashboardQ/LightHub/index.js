/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dashboardQTheme } from '@q/colors';
import { Page } from '@q/core';

import Light from './Light';
import LoadingSpinner from '../../../components/loading-spinner';
import { getLights } from '../../../api/lifx';

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

  useEffect(() => getLights(lifxResponse => setLights(lifxResponse)), []);

  return (
    <LightsStyled>
      <LightSwitches>
        {lights === null
          ? <LoadingSpinner message="Loading Lights" color={dashboardQTheme.primary} />
          : lights.map(light => <Light light={light} />)}
      </LightSwitches>
    </LightsStyled>
  );
};

export default LightHub;
