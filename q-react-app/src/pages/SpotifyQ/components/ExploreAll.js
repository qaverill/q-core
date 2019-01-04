import React from 'react'

class ExploreAll extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      totalDuration: null,
      topTracks: null,
      topArtists: null,
      topAlbums: null
    }
  }

  componentWillMount(){
    this.analyzeResults()
  }

  render() {
    return (
      <p>hi</p>
    )
  }

  analyzeResults(){
    let totalDuration = 0;
    let trackPlays = {};
    let artistPlays = {};
    let albumPlays = {};
    this.props.data.forEach(listen => {
      totalDuration += listen.duration;

      if (trackPlays[listen.track] == null){
        trackPlays[listen.track] = 1
      } else {
        trackPlays[listen.track] += 1
      }

      listen.artists.forEach(artist => {
        if (artistPlays[artist] == null){
          artistPlays[artist] = 1
        } else {
          artistPlays[artist] += 1
        }
      });

      if (albumPlays[listen.album] == null){
        albumPlays[listen.album] = 1
      } else {
        albumPlays[listen.album] += 1
      }
    });
    const tracks = Object.keys(trackPlays).map(key => ({
      track: key,
      count: trackPlays[key]
    }));
    tracks.sort(this.sortByCount);
    console.log(tracks)

  }

  sortByCount(a, b){
    if (a.count < b.count) {
      return 1;
    } else if (a.count > b.count){
      return -1;
    } else return 0;
  }
}

export default ExploreAll