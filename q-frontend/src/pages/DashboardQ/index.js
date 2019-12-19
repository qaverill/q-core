/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import { dashboardQTheme } from '@q/colors';
import { Page } from '@q/core';

import Lights from './components/Lights';

const DashboardQPage = styled(Page)`
  border: 5px solid ${dashboardQTheme.primary};
  display: flex;
  justify-content: center;
`;

class DashboardQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <DashboardQPage>
        <Lights />
      </DashboardQPage>
    );
  }
}

export default DashboardQ;
