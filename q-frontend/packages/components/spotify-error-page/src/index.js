import React from 'react';
import styled from 'styled-components';
import { Header, Page, FullDiv } from '@q/core';
import { red } from '@q/theme';
import { spotifyIcon } from '@q/images';

const SpotifyErrorPageContainer = styled(Page)`
  border: 5px solid ${red};
`;

const SpotifyErrorPage = () => {
  return (
    <SpotifyErrorPageContainer>
      <FullDiv>
        <a href="http://localhost:8888/spotify/auth/login">
          <img src={spotifyIcon} alt="spotify" />
        </a>
        <Header>Connect to Spotify API</Header>
      </FullDiv>
    </SpotifyErrorPageContainer>
  );
}

export default SpotifyErrorPage;
