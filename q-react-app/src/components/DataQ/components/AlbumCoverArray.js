import React, {Component} from 'react'
import styled from 'styled-components'

const AlbumCover = styled.img`
  margin: 5px;
  cursor: pointer;
  width: 150px;
  height: 150px;
  :hover {
    opacity:0.5;
  }
`;

class AlbumCoverArray extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return this.props.items.map(item => (
      <AlbumCover
        src={item.track.album.images[0].url}
        key={item.played_at}
        onClick={() => this.removeAlbum(item)}
        data-tip={item.track.name}
      />
    ))
  }

  removeAlbum(item){
    this.props.parent.setState({
      unsaved: this.props.parent.state.unsaved.filter(listen => listen !== item)
    })
  }
}

export default AlbumCoverArray;