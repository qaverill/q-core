import * as React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { Slate, SlateContent, Title, H2, H3, DROP_SIZE, GAP_SIZE } from '../../packages/core';
import { useStore } from '../../store';
import WaitSpinner from '../../components/WaitSpinner';
import { selectMusicStore } from '../../store/selectors';
import { musicTheme } from '../../packages/colors';
import { getTopPlays } from '../../api/music';
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// STYLES
// ----------------------------------
const TopPlaysSlate = styled(Slate)`
  display: flex;
  flex-direction: column;
`;
const TopPlays = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  transition: all 300ms ease-in;
  :hover {
    flex-grow: 3;
  }
`;
const ListTitle = styled(Title)`
  height: ${DROP_SIZE - GAP_SIZE}px;
  width: 100%;
  background-color: ${musicTheme.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const TopPlaysContent = styled(SlateContent)`
  display: flex;
`;
const Item = styled.div`
  display: flex;
  align-self: stretch;
  flex-shrink: 1;
  flex-grow: 1;
  margin: 2.5px;
  border: none;
  
  background-image: ${props => `url(${props.image.url})`};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;

  transition: all 300ms ease-in;
  
  :hover {
    flex-grow: 10;
    padding-top: ${props => props.image.width / props.image.height}%;
  }
`;
const ToolTip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const TopN = ({ id, name, album, images, count, type }) => (
  <Item
    key={id}
    data-tip={[name, count]}
    image={type === 'tracks' ? album.images[0] : images[0]}
  />
);
const Overview = () => {
  const { state } = useStore();
  const { start, end, filter } = selectMusicStore(state);
  const [topPlays, setTopPlays] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    async function fetchTopPlays() {
      const { tracks, artists, albums } = await getTopPlays({ start, end, filter });
      setIsLoading(true);
      setTopPlays({
        tracks: tracks.map(track => TopN(track)),
        artists: artists.map(artist => TopN(artist)),
        albums: albums.map(album => TopN(album)),
      });
      setIsLoading(false);
    }
    fetchTopPlays();
  }, [start, end, filter]);
  React.useEffect(() => ReactTooltip.rebuild());

  function getToolTipContent(dataTip) {
    if (dataTip) {
      return (
        <ToolTip>
          <H2>{dataTip.split(',')[0]}</H2>
          <H3>{dataTip.split(',')[1]}</H3>
        </ToolTip>
      );
    }
  }

  if (topPlays == null) {
    return <Title>No results, check the filter</Title>;
  }

  const { tracks, artists, albums } = topPlays;
  return (
    <TopPlaysSlate rimColor={musicTheme.tertiary}>
      <ReactTooltip getContent={getToolTipContent} />
      {isLoading && <WaitSpinner message="Loading Music..." />}
      {!isLoading && (
        <TopPlaysContent drops={0}>
          <TopPlays>
            <ListTitle>TRACKS</ListTitle>
            {tracks}
          </TopPlays>
          <TopPlays>
            <ListTitle>ARTISTS</ListTitle>
            {artists}
          </TopPlays>
          <TopPlays>
            <ListTitle>ALBUMS</ListTitle>
            {albums}
          </TopPlays>
        </TopPlaysContent>
      )}
    </TopPlaysSlate>
  );
};

export default Overview;
