import React, { Component } from 'react';
import HistoryCollector from './SpotifyAPI/Collectors/History';
import LibraryCollector from './SpotifyAPI/Collectors/Library';
import Explorer from './Explorer/Explorer';
import { NotificationContainer } from 'react-notifications';

class SpotifyQ extends Component {
  constructor(props){
    super(props);
    this.copyAuthTokenToClipboard = this.copyAuthTokenToClipboard.bind(this);
  }

  copyAuthTokenToClipboard() {
    const el = document.createElement('textarea');
    el.value = sessionStorage.getItem('auth_token');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  render() {
    return (
      <div className="App">
        <NotificationContainer/>
        <div className="App-header black" onClick={this.copyAuthTokenToClipboard}>Spotify Q</div>
        <HistoryCollector />
        <LibraryCollector />
        <Explorer />
      </div>
    );
  }

  
}

export default SpotifyQ;
