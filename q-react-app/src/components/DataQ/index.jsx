import React from 'react'
import SpotifyHistory from './components/SpotifyHistory'
import SpotifyLibrary from './components/SpotifyLibrary'

import './dataQ.css'

class DataQ extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    const spotifyAuthToken = sessionStorage.getItem('spotify_access_token')
    if (spotifyAuthToken != null && spotifyAuthToken.length > 0){
      return (
        <div id="dataQ" className="page-border">
          <div className="page">
            <SpotifyHistory />
          </div>
        </div>
      )
    } else {
      return (
        <div id="dataQ" className="page-border">
          <div className="page">
            <h2>Missing Spotify Auth</h2>
          </div>
        </div>
      )
    }
  }
}

export default DataQ