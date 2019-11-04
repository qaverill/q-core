import styled from 'styled-components';
import { Header, Page, FullDiv } from '@q/core';
import { red } from '@q/theme';
import { spotifyIcon } from '@q/images';

const globals = require('../globals');

const SpotifyErrorPageContainer = styled(Page)`
  border: 5px solid ${red};
`;

const SpotifyErrorPage = () => {
  const { url } = globals.server;
  return (
    <SpotifyErrorPageContainer>
      <FullDiv>
        <a href={`${url}/spotify/auth/login`}>
          <img src={spotifyIcon} alt="spotify" />
        </a>
        <Header>Connect to Spotify API</Header>
      </FullDiv>
    </SpotifyErrorPageContainer>
  );
}

export default SpotifyErrorPage;
