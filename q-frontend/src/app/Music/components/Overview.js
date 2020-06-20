import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';

import { Header, H2, H3 } from '../../../packages/core';
import { capitolFirstLetter } from '@q/utils';

import SpotifyErrorPage from '../../../components/spotify-error-page';

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

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topTracks: [],
      topArtists: [],
      topAlbums: [],
    };
  }

  componentDidMount() {
    this.analyzeResults();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.analyzeResults();
    }
  }

  getSpotifyData(list, type) {
    const _this = this;
    const { root } = this.props;
    const chunk = list.splice(0, 5);
    axios.get('/spotify', { params: { url: `https://api.spotify.com/v1/${type}?ids=${chunk.map(i => i.id).join()}` } })
      .then(res => {
        const topItems = res.data[type].map(item => (
          <Item key={item.id} data-tip={`${item.name} ::: ${chunk.find(e => e.id === item.id).count}`} image={getItemImage(item, type)} />
        ));
        _this.setState({ [`top${capitolFirstLetter(type)}`]: topItems });
        ReactTooltip.rebuild();
      }).catch(error => {
        if (error.response.status === 401) {
          root.setState({ error: <SpotifyErrorPage /> });
        }
      });
  }

  analyzeResults() {
    const { data } = this.props;
    if (data.length > 0) {
      const trackPlays = {};
      const artistPlays = {};
      const albumPlays = {};
      data.forEach(listen => {
        const { track, artists, album } = listen;
        trackPlays[track] = 1 + (trackPlays[track] || 0);
        artists.forEach(artist => { artistPlays[artist] = 1 + (artistPlays[artist] || 0); });
        albumPlays[album] = 1 + (albumPlays[album] || 0);
      });
      this.getSpotifyData(playsToSortedList(trackPlays), 'tracks');
      this.getSpotifyData(playsToSortedList(artistPlays), 'artists');
      this.getSpotifyData(playsToSortedList(albumPlays), 'albums');
    } else {
      this.setState({
        topTracks: null,
        topArtists: null,
        topAlbums: null,
      });
    }
  }

  render() {
    const { topTracks, topArtists, topAlbums } = this.state;
    if (topTracks == null && topArtists == null && topAlbums == null) {
      return <Header>No results, check the filter</Header>;
    }
    return (
      <TopChartsContainer>
        <ReactTooltip
          getContent={dataTip => (
            <ToolTip>
              <H2>{dataTip != null ? dataTip.split(':::')[0] : null}</H2>
              <H3>{dataTip != null ? dataTip.split(':::')[1] : null}</H3>
            </ToolTip>
          )}
        />
        <TopChart>
          <Header>Top Tracks:</Header>
          {topTracks}
        </TopChart>
        <TopChart>
          <Header>Top Artists:</Header>
          {topArtists}
        </TopChart>
        <TopChart>
          <Header>Top Albums:</Header>
          {topAlbums}
        </TopChart>
      </TopChartsContainer>
    );
  }
}

export default Overview;
