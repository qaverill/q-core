import * as React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import * as Vibrant from 'node-vibrant';

import { setLightsCycle, setLightsDefault } from '../../api/lifx';
import { HorizontalDiv } from '../../elements';
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// STYLES
// ----------------------------------
const AlbumCover = styled.div`
  /* filter: grayscale(${props => (props.isActive ? '0%' : '100%')}); */
`;
const ColorSwatch = styled.div`
  height: 15px;
  width: 15px;
  margin: 5px;
  background-color: ${props => props.color};
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const CurrentlyPlayingTrack = ({ lights, currentlyPlayingTrack }) => {
  const [colors, setColors] = React.useState([]);
  const [isActive, setIsActive] = React.useState(false);
  const albumCover = currentlyPlayingTrack && currentlyPlayingTrack.item.album.images[0].url;

  React.useEffect(() => {
    async function calculateColors() {
      const palette = await Vibrant.from(albumCover).getPalette();
      setColors(Object.keys(palette).map(key => palette[key].hex));
    }
    calculateColors();
  }, [currentlyPlayingTrack]);

  function onClick() {
    if (isActive) setLightsDefault();
    else setLightsCycle({ colors, lights });
    setIsActive(!isActive);
  }

  return [
    <AlbumCover onClick={onClick} isActive={isActive} key="item">
      <img src={albumCover} alt={albumCover} data-tip data-for="albumColors" height="100%" width="100%" />
    </AlbumCover>,
    <ReactTooltip id="albumColors" key="tool-tip">
      <HorizontalDiv>{colors.map(color => <ColorSwatch color={color} key={color} />)}</HorizontalDiv>
    </ReactTooltip>,
  ];
};

export default CurrentlyPlayingTrack;
