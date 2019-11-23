/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { lightOn, lightOff } from '@q/images';
import { dashboardQTheme } from '@q/theme';
import { Page, Text } from '@q/core';
import {  } from '@q/utils';

const LightsContainer = styled(Page)`
  height: 30%;
  width: 20%;
  margin: 10px;
  border: 5px solid ${dashboardQTheme.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  :hover {
    z-index: 10; /* keep on top of other elements on the page */
    outline: 9999px solid rgba(0,0,0,0.65);
  }
`;

export const LightButton = styled.img
  .attrs(props => ({
    src: props.on ? lightOn : lightOff,
  }))`
  cursor: pointer;
  height: 50%;
  width: 50%;
  margin: 2.5px;
  :hover {
    filter: brightness(1.25);
    height: 49%;
    width: 49%;
  }
`;

class Lights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      on: false,
    };
  }

  render() {
    return (
      <LightsContainer>
        <LightButton on={this.state.on} onClick={() => this.setState({ on: !this.state.on })} />
      </LightsContainer>
    );
  }
}

export default Lights;
