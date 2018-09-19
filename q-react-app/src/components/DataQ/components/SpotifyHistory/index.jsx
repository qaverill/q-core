import React, {Component} from 'react'
import axios from 'axios'
import 'react-notifications/lib/notifications.css'
import { NotificationManager } from 'react-notifications'

let serverUrl = require('../../../../globals').server.url;

class SpotifyHistory extends Component {
  constructor(props){
    super(props);
    this.state = {
      unsavedListens: [],
      listensChecked: 0,
    };
    this.writeListensToDB = this.writeListensToDB.bind(this);
  }
  render() {
    if (this.state.unsavedListens.length !== 0){
      return (
        <div className="collector dark">
          <button 
            className="collector purple" 
            onClick={this.writeListensToDB} 
            style={{width: (this.state.unsavedListens.length * 2) - 1 + "%" }} >
            Unsaved Listens: {this.state.unsavedListens.length}/{this.state.listensChecked}
          </button>
        </div>
      );
    } else return null;
  }

  componentWillMount(){
    const _this = this;
    axios.get(`${serverUrl}/spotify/recently-played`)
      .then(function(res) {
        _this.getUnsavedListens(_this.spotifyHistoryToListens(res.data.items));
      });
  }

  spotifyHistoryToListens(data){
    let listens = [];
    data.forEach(history_item => {
      let artistIDs = [];
      for (let a = 0; a < history_item.track.artists.length; a++){
        artistIDs.push(history_item.track.artists[a].id);
      }
      listens.push({
        timestamp: parseInt(new Date(history_item.played_at).getTime()/1000, 10),
        trackID: history_item.track.id,
        artistIDs: JSON.stringify(artistIDs),
        albumID: history_item.track.album.id,
        duration: history_item.track.duration_ms,
        popularity: history_item.track.popularity

      });
    });
    return listens;
  }

  getUnsavedListens(listens){
    const _this = this;
    listens.forEach(listen => {
      axios.get(`http://localhost:8888/aws/listens/${listen.timestamp}`)
        .then(function(res){
          if (res.data === ""){
            _this.state.unsavedListens.push(listen);
          }
          _this.setState({listensChecked: _this.state.listensChecked + 1});
        })
    });
  }

  writeListensToDB(){
    const _this = this;
    return axios.post('http://localhost:8888/aws/listens/', {
      listens: _this.state.unsavedListens
    }).then(function(){
        _this.setState({unsavedListens: []});
        _this.componentWillMount();
        NotificationManager.success('Synced History');
      });
  }
}

export default SpotifyHistory;