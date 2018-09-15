import React from 'react'
import SpotifyHistory from './components/SpotifyHistory'
import SpotifyLibrary from './components/SpotifyLibrary'

import './dataQ.css'

class DataQ extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div id="dataQ" className="page-border">
        <div className="page">
          <SpotifyHistory />
          <SpotifyLibrary />
        </div>
      </div>
    )
  }
}

export default DataQ