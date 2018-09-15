import React, { Component } from 'react';
import { getTrack } from '../../../../utilities/SpotifyAPI/Getters'
import Artist from '../Artist/Artist';
import './Track.css';

class Track extends Component {
  constructor(props){
    super(props);
    this.state = {
      track: null
    }
  }

  render() {
    console.log(this.state.track);
    return (
      (this.state.track == null ? null 
        :
        <div className="track-inspector">
          <div className="track-info">
            <img alt="albumCover" src={this.state.track.album.images[1].url} width={300} height={300}/>
            <h2 className="track-name">{this.state.track.name}</h2>
            <div className="track-artists">
              {this.parseArtists(this.state.track.artists)}
            </div>
          </div>
          <div className="Qhistory-info">
          
          </div>
        </div>
      )
    );
  }
  
  componentDidMount(){
    const _this = this;
    getTrack(this.props.id).then(function(res){
      _this.setState({track: res.data});
    }).catch(function(e){
      console.log("ERROR", e);
    });
  }

  parseArtists(artists) {
    return artists.map((artist, i) =>
      <p className="artist-link" onClick={this.exploreArtist(artist)}>
        {artist.name}{i === artists.length - 1 ? "" : ","}
      </p>
    )
  }

  exploreArtist(artist){
    this.props.explorer.addNodeToPath(<Artist artist={artist} explorer={this.props.explorer}/>);
  }
}

export default Track;
