/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import { dashboardTheme } from '../../packages/colors';
import { Slate } from '../../packages/core';

import LightHub from './LightHub';

const DashboardPage = styled(Slate)`
  display: flex;
  justify-content: center;
`;

const Dashboard = () => (
  <DashboardPage rimColor={dashboardTheme.primary}>
    <LightHub />
  </DashboardPage>
);

export default Dashboard;
