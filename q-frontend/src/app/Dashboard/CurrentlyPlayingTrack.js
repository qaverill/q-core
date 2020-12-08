/* eslint-disable no-undef */
import * as React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import * as Vibrant from 'node-vibrant';
import { eventListenerHook } from '../../common/helpers';

import { setLightsCycle, setLightsDefault } from '../../api/lifx';
import { getCurrentlyPlayingTrack } from '../../api/spotify';
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// STYLES
// ----------------------------------
const AlbumCover = styled.div`
  filter: grayscale(${props => (props.isActive ? '0%' : '100%')});
`;
const ColorSwatch = styled.div`
  height: 15px;
  width: 15px;
  margin: 5px;
  background-color: ${props => props.color};
`;
const HorizontalDiv = styled.div`
  display: flex;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const CurrentlyPlayingTrack = ({ lights }) => {
  const [colors, setColors] = React.useState(null);
  const [isActive, setIsActive] = React.useState(false);
  const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = React.useState(null);
  const albumCover = currentlyPlayingTrack && currentlyPlayingTrack.item.album.images[0].url;
  // ----------------------------------
  // HOOKS
  // ----------------------------------
  React.useEffect(() => {
    async function calculateColors() {
      if (currentlyPlayingTrack) {
        const palette = await Vibrant.from(albumCover).getPalette();
        setColors(Object.keys(palette).map(key => palette[key].hex));
      }
    }
    calculateColors();
  }, [currentlyPlayingTrack, albumCover]);
  React.useEffect(() => {
    async function fetchData() {
      setCurrentlyPlayingTrack(await getCurrentlyPlayingTrack());
    }
    fetchData();
  }, []);
  React.useEffect(() => {
    async function checkForNewAlbumArt() {
      const newCurrentlyPlayingTrack = await getCurrentlyPlayingTrack();
      if (newCurrentlyPlayingTrack.item.album.id !== currentlyPlayingTrack.item.album.id) {
        setCurrentlyPlayingTrack(newCurrentlyPlayingTrack);
      }
    }
    return eventListenerHook(checkForNewAlbumArt);
  }, [currentlyPlayingTrack]);
  // ----------------------------------
  // HANDLERS
  // ----------------------------------
  function onClick() {
    if (isActive) setLightsDefault();
    else setLightsCycle({ colors, lights });
    setIsActive(!isActive);
  }
  // ----------------------------------
  // RETURN
  // ----------------------------------
  return (
    (currentlyPlayingTrack && colors && (
      <>
        <AlbumCover onClick={onClick} isActive={isActive} key="item">
          <img src={albumCover} alt={albumCover} data-tip data-for="albumColors" height="100%" width="100%" />
        </AlbumCover>
        <ReactTooltip id="albumColors" key="tool-tip">
          <HorizontalDiv>{colors.map(c => <ColorSwatch color={c} key={c} />)}</HorizontalDiv>
        </ReactTooltip>
      </>
    ))
  );
};

export default CurrentlyPlayingTrack;
