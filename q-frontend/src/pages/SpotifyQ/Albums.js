import React, { Component } from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';

const AlbumsContainer = styled.div`
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  align-content: stretch;
  margin-top: 2.5px;
`;

const AlbumCover = styled.div`
  margin: 2.5px;
  cursor: pointer;
  width: calc(20% - 5px);
  :hover {
    opacity:0.5;
  }
`;

const AlbumImg = styled.img`
  height: 100%;
  width: 100%;
`;

const Albums = ({ data }) => {
  const Album = ({ item }) => {
    console.log(item)
    const { timestamp, track } = item;
    const { url } = track.album.images[0];
    return (
      <AlbumCover key={timestamp} data-tip={track.name}>
        <AlbumImg src={url} alt={url} />
      </AlbumCover>
    );
  };

  return (
    <AlbumsContainer>
      {data.map(item => (
        <Popup trigger={<Album item={item} />} position="right center" key={item.timestamp}>
          <div>T/A/A</div>
        </Popup>
      ))}
    </AlbumsContainer>
  );
};

export default Albums;