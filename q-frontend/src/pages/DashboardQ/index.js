/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import { dashboardQTheme } from '../../packages/colors';
import { Page } from '../../packages/core';

import LightHub from './LightHub';

const DashboardQPage = styled(Page)`
  border: 5px solid ${dashboardQTheme.primary};
  display: flex;
  justify-content: center;
`;

const DashboardQ = () => (
  <DashboardQPage>
    <LightHub />
  </DashboardQPage>
);

export default DashboardQ;
