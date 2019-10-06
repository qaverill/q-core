import React from 'react'
import { Text } from "../../../components/styled-components";
import styled from 'styled-components'

const { msToString } = require('q-utils');

const DetailContainer = styled.div`
  width: 100%;
  height: 100%;
`;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalDurationMs: 0,
      uniqueNumberOfArtists: 0,
      uniqueNUmberOfTracks: 0,
      uniqueNumberOfAlbums: 0
    }
  }

  render() {
    return (
      <DetailContainer>
        <h2>Detail</h2>
        <Text>Total Listening Time: {msToString(this.state.totalDurationMs)}</Text>
        <Text>Percent of time Listening: {parseInt((this.state.totalDurationMs / this.props.totalTimeMs) * 100)}%</Text>
        <Text>Total Unique Tracks: {this.state.uniqueNUmberOfTracks}</Text>
        <Text>Total Unique Artists: {this.state.uniqueNumberOfArtists}</Text>
        <Text>Total Unique Albums: {this.state.uniqueNumberOfAlbums}</Text>
      </DetailContainer>
    )
  }

  componentWillMount() {
    this.setState({
      totalDurationMs: this.getTotalDuration(),
      uniqueNumberOfArtists: this.getUniqueNumberOfArtists(),
      uniqueNUmberOfTracks: this.getUniqueNumberOfTracks(),
      uniqueNumberOfAlbums: this.getUniqeuNumberOfAlbums()
    })
  }

  getTotalDuration() {
    return this.props.data.map(listen => listen.duration).reduce((total, num) => total + num)
  }

  getUniqueNumberOfArtists() {
    return [...new Set(this.props.data.map(listen => listen.artists).flat())].length
  }

  getUniqueNumberOfTracks() {
    return [...new Set(this.props.data.map(listen => listen.track))].length
  }

  getUniqeuNumberOfAlbums() {
    return [...new Set(this.props.data.map(listen => listen.album))].length
  }

}

export default Detail