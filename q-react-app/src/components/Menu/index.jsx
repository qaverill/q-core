import React from 'react'
import SpotifyQ from '../SpotifyQ'
import DataQ from '../DataQ'
import './menu.css'

class Menu extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div id="menu" className="dark">
        <button
          className="menu-item"
          onClick={() => this.props.setPage(<SpotifyQ title="SpotifyQ"/>)}
          id="spotifyQ-menu-item"
        >
          SpotifyQ
        </button>
        <button
          className="menu-item"
          onClick={() => this.props.setPage(<DataQ title="DataQ"/>)}
          id="dataQ-menu-item"
        >
          DataQ
        </button>
      </div>
    )
  }
}

export default Menu