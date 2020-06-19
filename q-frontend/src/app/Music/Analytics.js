import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { Slate, SlateContent, Title } from '../../packages/core';
import { useStore } from '../../store';
import { selectMusicStore } from '../../store/selectors';
import { getSpotifyDataByType } from '../../api/spotify';
import { musicTheme } from '../../packages/colors';
// ----------------------------------
// HELPERS
// ----------------------------------
const N = 5;
const spliceTopN = counts => {
  const topN = {};
  Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .splice(0, N)
    .forEach(key => { topN[key] = counts[key]; });
  return topN;
};
const topNResults = data => {
  const tracks = {};
  const artists = {};
  const albums = {};
  const currentAmount = amount => (R.isNil(amount) ? 0 : amount);
  data.forEach(({ track, artists: as, album }) => {
    tracks[track] = 1 + currentAmount(tracks[track]);
    as.forEach(artist => { artists[artist] = 1 + currentAmount(artists[artist]); });
    albums[album] = 1 + currentAmount(albums[album]);
  });
  return {
    tracks: spliceTopN(tracks),
    artists: spliceTopN(artists),
    albums: spliceTopN(albums),
  };
};
// ----------------------------------
// STYLES
// ----------------------------------
const TopChartsSlate = styled(Slate)`
  display: flex;
  flex-direction: column;
`;
const TopChart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  transition: all 300ms ease-in;
  :hover {
    flex-grow: 3;
  }
`;
const ChartHeader = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${musicTheme.tertiary};
`;
const ChartContent = styled(SlateContent)`
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
    data-tip={`${name} ::: ${count}`}
    image={type === 'tracks' ? album.images[0] : images[0]}
  />
);
const Analytics = () => {
  const { state } = useStore();
  const { data } = selectMusicStore(state);
  const [charts, setCharts] = useState([]);
  useEffect(() => {
    async function fetchAndSetChartData() {
      const { tracks, artists, albums } = topNResults(data);
      const trackData = await getSpotifyDataByType('tracks', Object.keys(tracks));
      const artistData = await getSpotifyDataByType('artists', Object.keys(artists));
      const albumData = await getSpotifyDataByType('albums', Object.keys(albums));
      setCharts({
        tracks: trackData.map(td => TopN({ ...td, count: tracks[td.id], type: 'tracks' })),
        artists: artistData.map(ad => TopN({ ...ad, count: artists[ad.id], type: 'artists' })),
        albums: albumData.map(ad => TopN({ ...ad, count: albums[ad.id], type: 'albums' })),
      });
    }
    if (data.length > 0) {
      fetchAndSetChartData();
    }
  }, [data]);

  function getToolTipContent(dataTip) {
    return (
      <ToolTip>
        <h2>{dataTip != null ? dataTip.split(':::')[0] : null}</h2>
        <h3>{dataTip != null ? dataTip.split(':::')[1] : null}</h3>
      </ToolTip>
    );
  }

  if (charts == null) {
    return <Title>No results, check the filter</Title>;
  }

  const { tracks, artists, albums } = charts;
  return (
    <TopChartsSlate rimColor={musicTheme.tertiary}>
      <ReactTooltip getContent={getToolTipContent} />
      <ChartHeader>
        <Title>TRACKS</Title>
        <Title>ARTISTS</Title>
        <Title>ALBUMS</Title>
      </ChartHeader>
      <ChartContent>
        <TopChart>
          {tracks}
        </TopChart>
        <TopChart>
          {artists}
        </TopChart>
        <TopChart>
          {albums}
        </TopChart>
      </ChartContent>
    </TopChartsSlate>
  );
};

export default Analytics;
