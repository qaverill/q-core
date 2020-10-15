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
const BY_TIME = 'byTime';
const initKeysForRanks = {
  tracksKey: BY_COUNT,
  artistsKey: BY_COUNT,
  albumsKey: BY_COUNT,
};
const flipKey = key => (key === BY_COUNT ? BY_TIME : BY_COUNT);
// ----------------------------------
// STYLES
// ----------------------------------
const TopPlaysSlate = styled(Slate)`
  display: flex;
  flex-direction: column;
`;
const TopPlaysContent = styled(SlateContent)`
  display: flex;
  flex-direction: column;
`;
const Headers = styled.div`
  background-color: ${musicTheme.tertiary};
  width: 100%;
  display: flex;
`;
const ListTitle = styled(Title)`
  height: ${DROP_SIZE - GAP_SIZE}px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const Body = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;
const TopPlays = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  transition: all 250ms ease-in;
  :hover {
    flex-grow: 5;
  }
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
  const [keysForRanks, setkeysForRanks] = React.useState(initKeysForRanks);
  console.log(keysForRanks)
  const { tracksKey, artistsKey, albumsKey } = keysForRanks;
  function processData(freshData) {
    const dataToProcess = freshData || data;
    if (dataToProcess) {
      const { topTracks, topArtists, topAlbums } = dataToProcess;
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
  React.useEffect(processData, [keysForRanks]);
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

  const ListHeader = ({ keyForRank, title }) => (
    <ListTitle
      key={keyForRank}
      data-tip={keyForRank}
      onClick={() => setkeysForRanks({ ...keysForRanks, [`${title}Key`]: flipKey(keyForRank) })}
    >
      {title.toUpperCase()}
    </ListTitle>
  );

  const { tracks, artists, albums } = topPlays;
  return (
    <TopPlaysSlate rimColor={musicTheme.tertiary}>
      <ReactTooltip getContent={getToolTipContent} />
      {!data && <WaitSpinner message="Loading Music..." />}
      {data && (
        <TopPlaysContent drops={0}>
          <Headers>
            <ListHeader keyForRank={tracksKey} title="tracks" />
            <ListHeader keyForRank={artistsKey} title="artists" />
            <ListHeader keyForRank={albumsKey} title="albums" />
          </Headers>
          <Body>
            <TopPlays>{tracks}</TopPlays>
            <TopPlays>{artists}</TopPlays>
            <TopPlays>{albums}</TopPlays>
          </Body>
        </TopPlaysContent>
      )}
    </TopPlaysSlate>
  );
};

export default Overview;
