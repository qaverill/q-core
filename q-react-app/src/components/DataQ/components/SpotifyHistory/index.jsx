import React, {Component} from 'react'
import axios from 'axios'
import 'react-notifications/lib/notifications.css'
import { NotificationManager } from 'react-notifications'

class SpotifyHistory extends Component {
  constructor(props){
    super(props);
    this.state = {
      unsavedListens: []
    };
    this.writeListensToMongo = this.writeListensToMongo.bind(this);
  }
  render() {
    console.log(this.state.unsavedListens)
    if (this.state.unsavedListens.length !== 0){
      return (
        <div className="collector dark">
          <button 
            className="collector purple" 
            onClick={this.writeListensToMongo}
            style={{width: (this.state.unsavedListens.length * 2) - 1 + "%" }}
          >
            Unsaved Listens: {this.state.unsavedListens.length}/50
          </button>
        </div>
      );
    } else return null;
  }

  componentWillMount(){
    const _this = this;
    axios.get('/spotify/recently-played')
      .then(res => {
        const listens = this.parseSpotifyRecentlyPlayedToListens(res.data.items);
        axios.get('/mongodb/listens', {params: {start: listens[49].timestamp}})
          .then(res => {
            const alreadySavedTimestamps = res.data.map(listen => listen.timestamp);
            _this.setState({
              unsavedListens: listens.filter(listen => {
                return !alreadySavedTimestamps.includes(listen.timestamp)
              })
            });
          });
      });
  }

  parseSpotifyRecentlyPlayedToListens(recentlyPlayed) {
    return recentlyPlayed.map(play => {
      return {
        timestamp: parseInt(new Date(play.played_at).getTime()/1000, 10),
        track: play.track.id,
        artists: play.track.artists.map(artist => artist.id),
        album: play.track.album.id,
        duration: play.track.duration_ms,
        popularity: play.track.popularity
      }
    })
  }

  writeListensToMongo(){
    const _this = this;
    axios.post('/mongodb/listens', _this.state.unsavedListens)
      .then(() => {
        _this.setState({unsavedListens: []});
        _this.componentWillMount();
        NotificationManager.success('Synced History');
      })
  }
}

export default SpotifyHistory;