import styled from 'styled-components';
import { q_styledComponents, q_colors, q_images } from 'q-lib'

const globals = require('../globals');

const { Header, Page, FullDiv } = q_styledComponents;
const { red } = q_colors;
const { spotifyIcon } = q_images;

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
