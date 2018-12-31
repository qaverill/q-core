import React from 'react'
import styled from 'styled-components'

const SpotifyIcon = styled.img
  .attrs({
    src: require('./spotify-icon.png')
  })`
    height: 30px;
    width: 30px;
    ${props => props.active ? `` : `filter: grayscale(100%);`}
`;

const ApiAuthContainer = styled.div`
  cursor: pointer;
  float: right;
  margin-left: auto;
  margin-right: 10px;
`;

class ApiAuth extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      connectedToSpotify: false
    }
  }

  componentWillMount(){
    const pathParams = window.location.hash;
    const accessToken = pathParams.substring(pathParams.indexOf('#access_token=') + 1, pathParams.indexOf('&'));
    sessionStorage.setItem('spotify_access_token', accessToken);
    this.setState({connectedToSpotify: accessToken.length > 0});
  }

  render(){
    return(
      <ApiAuthContainer>
        <a href={`${require('../../globals').server.url}/spotify/auth/login`}>
          <SpotifyIcon active={this.state.connectedToSpotify} />
        </a>
      </ApiAuthContainer>
    )
  }
}

export default ApiAuth