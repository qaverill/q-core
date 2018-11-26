import React, { Component } from 'react';

class AlbumInspector extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="">
        <p>{this.props.album.name}</p>
      </div>
    );
  }  
}

export default AlbumInspector;
