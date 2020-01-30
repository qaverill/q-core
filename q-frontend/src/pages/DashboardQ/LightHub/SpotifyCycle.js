import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import * as Vibrant from 'node-vibrant';

import { setLightsCycle, setLightsDefault } from '../../../api/lifx';
import { HorizontalDiv } from '../../../elements';

const AlbumCover = styled.div`
  height: 300px;
  width: 300px;
  filter: grayscale(${props => (props.isActive ? '0%' : '100%')});
`;

const ColorSwatch = styled.div`
  height: 15px;
  width: 15px;
  margin: 5px;
  background-color: ${props => props.color};
`;

const SpotifyCycle = ({ lights, albumCover }) => {
  const [colors, setColors] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const getAlbumCoverColors = async () => {
      const palette = await Vibrant.from(albumCover).getPalette();
      setColors(Object.keys(palette).map(key => palette[key].hex));
    };
    getAlbumCoverColors();
  }, [albumCover]);

  const onClick = () => {
    if (isActive) {
      setLightsDefault();
    } else {
      setLightsCycle({ colors, lights });
    }
    setIsActive(!isActive);
  };

  return [
    <AlbumCover onClick={onClick} isActive={isActive}>
      <img src={albumCover} alt={albumCover} data-tip data-for="albumColors" height="100%" width="100%" />
    </AlbumCover>,
    <ReactTooltip id="albumColors">
      <HorizontalDiv>{colors.map(color => <ColorSwatch color={color} />)}</HorizontalDiv>
    </ReactTooltip>,
  ];
};

export default SpotifyCycle;
