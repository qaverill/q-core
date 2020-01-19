/* eslint-disable no-undef */
import React, { useState } from 'react';
import { lightOn, lightOff } from '@q/images';
import styled from 'styled-components';
import axios from 'axios';

const LightButton = styled.img
  .attrs(props => ({
    src: props.power ? lightOn : lightOff,
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

const Light = ({ light }) => {
  const { label, power: initPower } = light;
  const [power, setPower] = useState('off');

  const onClick = () => (
    axios.post('/lifx', { url: `https://api.lifx.com/v1/lights/label:${label}/toggle` })
      .then(res => res.data.results.status === 'ok' && setPower(initPower === 'off' ? 'on' : 'off'))
  );

  return (
    <LightButton onClick={onClick} power={power} />
  );
};

export default Light;
