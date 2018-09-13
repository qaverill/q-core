import React, { Component } from 'react';
import axios from 'axios';

class ArtistInspector extends Component {
  constructor(props){
    super(props);
    this.state = {
      artist: null
    }
  }

  render() {
    return (
      (this.state.artist !== null 
        ? <img alt="artistPicture" src={this.state.artist.images[1].url} />
        : <p>Loading...</p>
      )
    );
  } 
  
  componentDidMount() {
    const _this = this;
    axios.get('https://api.spotify.com/v1/artists/' + this.props.id, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem("auth_token")
      }
    }).then(function(res){
      _this.setState({artist: res.data});
    }).catch(function(e){
      console.log("ERROR", e);
    })
  }
}

export default ArtistInspector;
