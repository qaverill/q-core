import React, {Component} from 'react'
import styled from 'styled-components'

const AlbumCover = styled.div`
  margin: 2.5px;
  cursor: pointer;
  width: calc(20% - 5px);
  :hover {
    opacity:0.5;
  }
`;

class AlbumCoverArray extends Component {
  render() {
    return this.props.items.map(item => (
      <AlbumCover
        key={item.played_at}
        onClick={() => this.removeAlbum(item)}
        data-tip={item.track.name} >
        <img
          src={item.track.album.images[0].url} height="100%" width="100%"
          alt={item.track.album.images[0].url}/>
      </AlbumCover>
    ))
  }

  removeAlbum(item){
    this.props.parent.setState({
      unsaved: this.props.parent.state.unsaved.filter(listen => listen !== item)
    })
  }
}

export default AlbumCoverArray;