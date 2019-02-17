import React from 'react'
import styled from 'styled-components'
import { Header, Page, PageBorder } from './styled-components'
import { RiseLoader } from 'react-spinners'
import { red } from "../colors";

const FullDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ErrorBorder = styled(PageBorder)`
  background-color: ${red};
`;

const SpotifyErrorBorder = styled(PageBorder)`
  background-color: ${red};
`;

export class ErrorPage extends React.PureComponent {
  render() {
    return (
      <ErrorBorder>
        <Page>
          <FullDiv>
            <img src={require('./Images/error-triangle.svg')} />
            <Header>{this.props.message}</Header>
          </FullDiv>
        </Page>
      </ErrorBorder>
    )
  }
}

export class SpotifyAPIErrorPage extends React.PureComponent {
  render() {
    return (
      <SpotifyErrorBorder>
        <Page>
          <FullDiv>
            <a href={`${require('../globals').server.url}/spotify/auth/login`}>
              <img src={require('./Images/Spotify_Icon_RGB_Green.svg')} />
            </a>
            <Header>Connect to Spotify API</Header>
          </FullDiv>
        </Page>
      </SpotifyErrorBorder>
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
        <Header>{this.props.message}</Header>
      </FullDiv>
    )
  }
};
