import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as Vibrant from 'node-vibrant';

import { setLightsCycle, setLightsDefault } from '../../../api/lifx';

const AlbumCover = styled.div`
  height: 300px;
  width: 300px;
  opacity: ${props => (props.isActive ? '1.0' : '0.5')};
`;

// TODO: move this function into @q/utils;
const summarizeImageColors = url => {
  // TODO: transform pallette into colors obj needed for setLightsCycle
  Vibrant.from(url).getPalette()
    .then((palette) => console.log(palette));
};

const SpotifyCycle = ({ lights, albumCover }) => {
  const [colors, setColors] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => setColors(summarizeImageColors(albumCover)), [albumCover]);

  const onClick = () => {
    if (isActive) {
      setLightsDefault();
    } else {
      setLightsCycle({ colors, lights });
    }
    setIsActive(!isActive);
  };

  return (
    <AlbumCover onClick={onClick} data-tip={colors} isActive={isActive}>
      <img src={albumCover} alt={albumCover} height="100%" width="100%" />
    </AlbumCover>
  );
};

export default SpotifyCycle;
