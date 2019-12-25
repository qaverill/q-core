import React from 'react';
import styled from 'styled-components';
import { msToString } from '@q/utils';
import { Text } from '@q/core';
import { Chart } from 'react-charts';


const DetailContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Details = styled.div`
  width: 30%;  
`;

const Visuals = styled.div`
  width: 70%;
`;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  calculateStats() {
    const { data } = this.props;
    let totalDurationMs = 0;
    const uniques = {
      tracks: [],
      artists: [],
      albums: [],
    };
    data.forEach(listen => {
      totalDurationMs += listen.duration;
      uniques.tracks.push(listen.track);
      uniques.artists = uniques.artists.concat(listen.artists);
      uniques.albums.push(listen.album);
    });
    return {
      totalDurationMs,
      uniqueNumberOfTracks: [...new Set(uniques.tracks)].length,
      uniqueNumberOfArtists: [...new Set(uniques.artists)].length,
      uniqueNumberOfAlbums: [...new Set(uniques.albums)].length,
    };
  }

  createChartData() {
    const { data } = this.props;
    return {
      chartData: data.map(listen => {

      }),
      chartAxes: [
        { primary: true, type: 'ordinal', position: 'bottom' },
        { position: 'left', type: 'linear', stacked: false }
      ],
    }
  }

  render() {
    const { totalTimeMs } = this.props;
    const {
      totalDurationMs,
      uniqueNumberOfTracks,
      uniqueNumberOfArtists,
      uniqueNumberOfAlbums,
    } = this.calculateStats();
    const {
      chartData,
      chartAxes
    } = this.createChartData();
    return (
      <DetailContainer>
        <Details>
          <Text>{`Total Listening Time: ${msToString(totalDurationMs)}`}</Text>
          <Text>{`Percent of time Listening: ${parseInt((totalDurationMs / totalTimeMs) * 100, 10)}%`}</Text>
          <Text>{`Total Unique Tracks: ${uniqueNumberOfTracks}`}</Text>
          <Text>{`Total Unique Artists: ${uniqueNumberOfArtists}`}</Text>
          <Text>{`Total Unique Albums: ${uniqueNumberOfAlbums}`}</Text>
        </Details>
        <Visuals>
          <Chart />
        </Visuals>
      </DetailContainer>
    );
  }
}

export default Detail;
