import React, { Component } from 'react';
import styled from 'styled-components';

const AlbumCoverArrayContainer = styled.div`
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

class AlbumCoverArray extends Component {
  removeAlbum(item) {
    const { parent } = this.props;
    parent.setState({ unsaved: parent.state.unsaved.filter(listen => listen !== item) });
  }

  render() {
    const { items } = this.props;
    return (
      <AlbumCoverArrayContainer>
        {items.map(item => (
          <AlbumCover
            key={item.played_at}
            onClick={() => this.removeAlbum(item)}
            data-tip={item.track.name}
          >
            <img
              src={item.track.album.images[0].url}
              height="100%"
              width="100%"
              alt={item.track.album.images[0].url}
            />
          </AlbumCover>
        ))}
      </AlbumCoverArrayContainer>
    );
  }
}

export default AlbumCoverArray;