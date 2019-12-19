/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { lightOn, lightOff } from '@q/images';
import { dashboardQTheme } from '@q/colors';
import { Page } from '@q/core';

import LoadingSpinner from '../../../../components/loading-spinner';

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
      on: null,
    };
  }

  componentDidMount() {
    const _this = this;
    axios.get('/lifx', { params: { url: 'https://api.lifx.com/v1/lights/label:Lamp' } })
      .then(res => {
        _this.setState({ on: res.data[0].power === 'on' });
      });
  }

  toggleLight() {
    const _this = this;
    const body = {
      url: 'https://api.lifx.com/v1/lights/label:Lamp/toggle',
      duration: 0.1,
    };
    axios.post('/lifx', body)
      .then(res => {
        _this.setState({ on: !_this.state.on });
      });
  }

  render() {
    const { on } = this.state;
    if (on != null) {
      return (
        <LightsContainer>
          <LightButton on={on} onClick={() => this.toggleLight()} />
        </LightsContainer>
      );
    }
    return <LoadingSpinner color={dashboardQTheme.tertiary} />
  }
}

export default Lights;
