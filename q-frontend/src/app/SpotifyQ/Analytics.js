import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { Header } from '../../packages/core';
import { capitolFirstLetter } from '../../packages/utils';
import { useStore } from '../../store';
import { selectSpotifyQStore } from '../../store/selectors';
// ----------------------------------
// HELPERS
// ----------------------------------
const getItemImage = (item, type) => {
  switch (type) {
    case 'tracks':
      return item.album.images[0];
    case 'artists':
      return item.images[0];
    case 'albums':
      return item.images[0];
    default:
      return null;
  }
};
const sortByCount = (a, b) => {
  if (a.count < b.count) {
    return 1;
  } if (a.count > b.count) {
    return -1;
  } return 0;
};
const playsToSortedList = plays => (
  Object.keys(plays)
    .map(key => ({ id: key, count: plays[key] }))
    .sort(sortByCount)
);
const getSpotifyData = (list, type) => {
  const chunk = list.splice(0, 5);
  axios.get('/spotify', { params: { url: `https://api.spotify.com/v1/${type}?ids=${chunk.map(i => i.id).join()}` } })
    .then(res => {
      const topItems = res.data[type].map(item => (
        <Item key={item.id} data-tip={`${item.name} ::: ${chunk.find(e => e.id === item.id).count}`} image={getItemImage(item, type)} />
      ));
      _this.setState({ [`top${capitolFirstLetter(type)}`]: topItems });
      ReactTooltip.rebuild();
    });
};
const analyzeResults = (data, setCharts) => {
  if (data.length > 0) {
    const trackPlays = {};
    const artistPlays = {};
    const albumPlays = {};
    data.forEach(({ track, artists, album }) => {
      trackPlays[track] = 1 + (trackPlays[track] || 0);
      artists.forEach(artist => { artistPlays[artist] = 1 + (artistPlays[artist] || 0); });
      albumPlays[album] = 1 + (albumPlays[album] || 0);
    });
    setCharts({
      tracks: ,
      artists: ,
      albums: ,
    })
    this.getSpotifyData(playsToSortedList(trackPlays), 'tracks');
    this.getSpotifyData(playsToSortedList(artistPlays), 'artists');
    this.getSpotifyData(playsToSortedList(albumPlays), 'albums');
  } else {
    setCharts(null);
  }
};
// ----------------------------------
// STYLES
// ----------------------------------
const TopChartsContainer = styled.div`
  display: flex;
  width: 100%;
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
const Analytics = () => {
  const { state } = useStore();
  const { data } = selectSpotifyQStore(state);
  const [charts, setCharts] = useState([]);
  const { tracks, artists, albums } = charts;
  useEffect(() => analyzeResults(data, setCharts), [data]);

  function getToolTopContent(dataTip) {
    return (
      <ToolTip>
        <h2>{dataTip != null ? dataTip.split(':::')[0] : null}</h2>
        <h3>{dataTip != null ? dataTip.split(':::')[1] : null}</h3>
      </ToolTip>
    );
  }

  if (charts == null) {
    return <Header>No results, check the filter</Header>;
  }
  return (
    <TopChartsContainer>
      <ReactTooltip getContent={getToolTopContent} />
      <TopChart>
        <Header>Top Tracks:</Header>
        {tracks}
      </TopChart>
      <TopChart>
        <Header>Top Artists:</Header>
        {artists}
      </TopChart>
      <TopChart>
        <Header>Top Albums:</Header>
        {albums}
      </TopChart>
    </TopChartsContainer>
  );
}

export default Analytics;
