import React from 'react'
import './apiAuth.css'

let serverUrl = require('../../globals').server.url;

class ApiAuth extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      spotifyAuth: false
    }
  }

  componentDidMount(){
    const pathParams = window.location.hash;
    const accessToken = pathParams.substring(pathParams.indexOf('#access_token=') + 1, pathParams.indexOf('&'));
    sessionStorage.setItem('spotify_access_token', accessToken);
    this.setState({spotifyAuth: accessToken.length > 0});
  }

  render(){
    return(
      <div id="api-status">
        <a href={`${serverUrl}/spotify/auth/login`}>
          <img
            id="spotify-icon"
            src={require('./spotify-icon.png')}
            className={this.state.spotifyAuth ? null : "disconnected"}
          />
        </a>
      </div>
    )
  }
}

export default ApiAuth