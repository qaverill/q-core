import React, {Component} from "react";
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import { getHistory } from '../Getters';
import { writeQListens } from '../../DynamoDB/Writers';
import { readQListen } from '../../DynamoDB/Readers';
import './Collector.css';

class HistoryCollector extends Component {
  constructor(props){
    super(props);
    this.state = {
      unsavedListens: [],
      listensChecked: 0,
    }
    this.writeListensToDB = this.writeListensToDB.bind(this);
  }
  render() {
    (this.state.listensChecked == 50 ? console.log("Checked all listens") : null)
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
    getHistory().then(function(res){
      _this.getUnsavedListens(_this.spotifyHistoryToListens(res.data.items));
    })
  }

  spotifyHistoryToListens(data){
    let listens = [];
    for (let i = 0; i < data.length; i++){
      let artistIDs = [];
      for (let a = 0; a < data[i].track.artists.length; a++){
        artistIDs.push(data[i].track.artists[a].id);
      }
      listens.push({
        timestamp: parseInt(new Date(data[i].played_at).getTime()/1000),
        trackID: data[i].track.id,
        artistIDs: JSON.stringify(artistIDs),
        albumID: data[i].track.album.id,
        duration: data[i].track.duration_ms,
        popularity: data[i].track.popularity

      });
    }
    return listens;
  }

  getUnsavedListens(listens){
    const _this = this;
    for (let i = 0; i < listens.length; i++){
      readQListen(listens[i].timestamp).then(function(res){
        if (res.data === ""){
          _this.state.unsavedListens.push(listens[i]);
        }
        _this.setState({listensChecked: _this.state.listensChecked + 1});
      }).catch(function(e){
        console.log("ERROR:", e);
      })
    }
  }

  writeListensToDB(){
    const _this = this;
    writeQListens(_this.state.unsavedListens).then(function(){
      _this.setState({unsavedListens: []});
      _this.componentWillMount();
      NotificationManager.success('Synced History');
    }).catch(function(e){
      console.log("ERROR: ", e)
    });
  }
}

export default HistoryCollector;