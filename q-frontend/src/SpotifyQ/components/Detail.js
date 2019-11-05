import React from 'react';
import styled from 'styled-components';
import { msToString } from '@q/utils';
import { Text } from '@q/core';

const DetailContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const getTotalDuration = data => data.map(l => l.duration).reduce((total, num) => total + num);

const getUniqueNumberOfArtists = data => [...new Set(data.map(l => l.artists).flat())].length;

const getUniqueNumberOfTracks = data => [...new Set(data.map(l => l.track))].length;

const getUniqueNumberOfAlbums = data => [...new Set(data.map(l => l.album))].length;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalDurationMs: 0,
      uniqueNumberOfArtists: 0,
      uniqueNUmberOfTracks: 0,
      uniqueNumberOfAlbums: 0,
    }
  }

  componentWillMount() {
    const { data } = this.props;
    this.setState({
      totalDurationMs: getTotalDuration(data),
      uniqueNumberOfArtists: getUniqueNumberOfArtists(data),
      uniqueNUmberOfTracks: getUniqueNumberOfTracks(data),
      uniqueNumberOfAlbums: getUniqueNumberOfAlbums(data),
    });
  }

  render() {
    const { totalTimeMs } = this.props;
    const {
      totalDurationMs,
      uniqueNUmberOfTracks,
      uniqueNumberOfArtists,
      uniqueNumberOfAlbums,
    } = this.state;
    return (
      <DetailContainer>
        <h2>Detail</h2>
        <Text>{`Total Listening Time: ${msToString(totalDurationMs)}`}</Text>
        <Text>{`Percent of time Listening: ${parseInt((totalDurationMs / totalTimeMs) * 100, 10)}%`}</Text>
        <Text>{`Total Unique Tracks: ${uniqueNUmberOfTracks}`}</Text>
        <Text>{`Total Unique Artists: ${uniqueNumberOfArtists}`}</Text>
        <Text>{`Total Unique Albums: ${uniqueNumberOfAlbums}`}</Text>
      </DetailContainer>
    );
  }
}

export default Detail;
