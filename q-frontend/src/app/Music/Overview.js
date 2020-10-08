import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { Slate, SlateContent, Title, H2, H3, DROP_SIZE, GAP_SIZE } from '../../packages/core';
import { useStore } from '../../store';
import WaitSpinner from '../../components/WaitSpinner';
import { selectMusicStore } from '../../store/selectors';
import { musicTheme } from '../../packages/colors';
import { getTopPlays } from '../../api/music';
import { msToString } from '../../packages/utils';
// ----------------------------------
// HELPERS
// ----------------------------------
const BY_COUNT = 'byCount';
const initKeysForRanks = {
  tracksKey: BY_COUNT,
  artistsKey: BY_COUNT,
  albumsKey: BY_COUNT,
};
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
const TopN = ({ id, name, album, images, count, time, type }) => (
  <Item
    key={id}
    data-tip={[name, `${count}plays - ${msToString(time)}`]}
    image={type === 'tracks' ? album.images[0] : images[0]}
  />
);
const Overview = () => {
  const { state } = useStore();
  const { start, end, filter } = selectMusicStore(state);
  const [data, setData] = React.useState();
  const [topPlays, setTopPlays] = React.useState([]);
  const [keyForRanks, setKeyForRanks] = React.useState(initKeysForRanks);
  function processData(freshData) {
    const dataToProcess = freshData || data;
    if (dataToProcess) {
      const { topTracks, topArtists, topAlbums } = dataToProcess;
      const { tracksKey, artistsKey, albumsKey } = keyForRanks;
      setTopPlays({
        tracks: R.prop(tracksKey, topTracks).map(TopN),
        artists: R.prop(artistsKey, topArtists).map(TopN),
        albums: R.prop(albumsKey, topAlbums).map(TopN),
      });
    }
  }
  React.useEffect(() => {
    async function fetchTopPlays() {
      setData(null);
      const freshData = await getTopPlays({ start, end, filter });
      setData(freshData);
      processData(freshData);
    }
    fetchTopPlays();
  }, [start, end, filter]);
  React.useEffect(processData, [keyForRanks]);
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
      {!data && <WaitSpinner message="Loading Music..." />}
      {data && (
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
