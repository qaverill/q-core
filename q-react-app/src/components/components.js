import React from 'react'
import styled from 'styled-components'
import {Button, Header, Page} from './styled-components'
import { RiseLoader } from 'react-spinners'
import {red, spotifyQTheme} from "../colors";

const FullDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center
  justify-content: center;
`;

const SpotifyErrorPage = styled(Page)`
  border: 5px solid ${red};
`;

export class SpotifyAPIErrorPage extends React.PureComponent {
  render() {
    return (
      <SpotifyErrorPage>
        <FullDiv>
          <a href={`${require('../globals').server.url}/spotify/auth/login`}>
            <img
              src={require('./Images/Spotify_Icon_RGB_Green.svg')}
              alt={"spotify"} />
          </a>
          <Header>Connect to Spotify API</Header>
        </FullDiv>
      </SpotifyErrorPage>
    )
  }
}

export class LoadingSpinner extends React.PureComponent {
  render() {
    return (
      <FullDiv>
        <RiseLoader
          sizeUnit={"px"}
          size={100}
          color={this.props.color} />
      </FullDiv>
    )
  }
};
