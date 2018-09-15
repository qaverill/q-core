import React, {Component} from "react";
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import { readQSave } from '../../../../utilities/DynamoDB/Readers';
import { writeQSaves } from '../../../../utilities/DynamoDB/Writers';
import { getLibrary } from '../../../../utilities/SpotifyAPI/Getters';
import { addToLibraryArchives } from '../../../../utilities/SpotifyAPI/Setters';

class LibraryCollector extends Component {
  constructor(props){
    super(props);
    this.state = {
      unsavedSaves: [],
      savesChecked: 0,
    }
    this.writeSavesToDB = this.writeSavesToDB.bind(this);
  }
  render() {
    (this.state.savesChecked == 50 ? console.log("Checked all saves") : null)
    if (this.state.unsavedSaves.length !== 0){
      return (
        <div className="collector dark">
          <button 
            className="collector blue" 
            onClick={this.writeSavesToDB} 
            style={{width: (this.state.unsavedSaves.length * 2) - 1 + "%" }} >
            Unsaved Saves: {this.state.unsavedSaves.length}/{this.state.savesChecked}
          </button>
        </div>
      );
    } return null;
  }

  componentWillMount(){
    const _this = this;
    getLibrary().then(function(res){
      _this.getUnsavedSaves(_this.spotifyLibraryToSaves(res.data.items))
    }).catch(function(e){
      console.log("ERROR:", e);
    })
  }

  spotifyLibraryToSaves(data){
    let saves = [];
    for (let i = 0; i < data.length; i++){
      let artistIDs = [];
      for (let a = 0; a < data[i].track.artists.length; a++){
        artistIDs.push(data[i].track.artists[a].id);
      }
      saves.push({
        timestamp: parseInt(new Date(data[i].played_at).getTime()/1000),
        trackID: data[i].track.id,
        artistIDs: JSON.stringify(artistIDs),
        albumID: data[i].track.album.id,
        duration: data[i].track.duration_ms,
        popularity: data[i].track.popularity
      });
    }
    return saves;
  }

  getUnsavedSaves(saves){
    const _this = this;
    for (let i = 0; i < saves.length; i++){
      readQSave(saves[i].trackID).then(function(res){
        if (res.data === ""){
          _this.state.unsavedSaves.push(saves[i]);
        }
        _this.setState({savesChecked: _this.state.savesChecked + 1});
      }).catch(function(e){
        console.log("ERROR:", e);
      });
    }
  }

  writeSavesToDB(){
    const _this = this;
    writeQSaves(_this.state.unsavedSaves).then(function(){
      _this.writeSavesToPlaylist();
    }).catch(function(e){
      console.log("ERROR: ", e)
    });
  }

  writeSavesToPlaylist(){
    let URIS = [];
    for (let i = 0; i < this.state.unsavedSaves.length; i++){
      URIS.push('spotify:track:' + this.state.unsavedSaves[i].trackID);
    }

    const _this = this;
    addToLibraryArchives(URIS).then(function(){
      _this.setState({unsavedSaves: []});
      _this.componentWillMount();
      NotificationManager.success('Synced Library');
    }).catch(function(e){
      console.log("ERROR: ", e)
    });
  }
}

export default LibraryCollector;