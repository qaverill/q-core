/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import { dashboardQTheme } from '@q/colors';
import { Page } from '@q/core';

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
