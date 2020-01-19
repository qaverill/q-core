/* eslint-disable no-undef */
import React, { useState } from 'react';
import { lightOn, lightOff } from '@q/images';
import styled from 'styled-components';

import { toggleLightPower } from '../../../api/lifx';

const LightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LightButton = styled.img
  .attrs(props => ({
    src: props.power === 'on' ? lightOn : lightOff,
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
  const [power, setPower] = useState(initPower);

  const onClick = () => toggleLightPower(label, () => setPower(power === 'off' ? 'on' : 'off'));

  return (
    <LightContainer>
      <LightButton onClick={onClick} power={power} />
      <h2>{label}</h2>
    </LightContainer>
  );
};

export default Light;
