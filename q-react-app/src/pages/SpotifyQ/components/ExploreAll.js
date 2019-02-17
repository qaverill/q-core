import React from 'react'
import { Text, Header } from "../../../components/styled-components";
import styled from 'styled-components'

const TopChartsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

const TopChart = styled.div`
  display: flex;
  flex-direction: column;
`;

class ExploreAll extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      totalDuration: null,
      rankedTracks: null,
      rankedArtists: null,
      rankedAlbums: null
    }
  }

  componentWillMount(){
    this.analyzeResults()
  }

  render() {
    return (
      <TopChartsContainer>
        <TopChart>
          <Header>Top Tracks:</Header>
          {this.getTopN(this.state.rankedTracks, 5)}
        </TopChart>
        <TopChart>
          <Header>Top Artists:</Header>
          {this.getTopN(this.state.rankedArtists, 5)}
        </TopChart>
        <TopChart>
          <Header>Top Albums:</Header>
          {this.getTopN(this.state.rankedAlbums, 5)}
        </TopChart>
      </TopChartsContainer>
    )
  }

  analyzeResults(){
    let totalDuration = 0;
    let trackPlays = {}, artistPlays = {}, albumPlays = {};
    this.props.data.forEach(listen => {
      totalDuration += listen.duration;
      trackPlays[listen.track] == null ? trackPlays[listen.track] = 1 : trackPlays[listen.track] += 1;
      listen.artists.forEach(artist => { artistPlays[artist] == null ? artistPlays[artist] = 1 : artistPlays[artist] += 1 });
      albumPlays[listen.album] == null ? albumPlays[listen.album] = 1 : albumPlays[listen.album] += 1
    });

    this.setState({
      totalDuration: totalDuration,
      rankedTracks: this.playsToSortedList(trackPlays),
      rankedArtists: this.playsToSortedList(artistPlays),
      rankedAlbums: this.playsToSortedList(albumPlays)
    })
  }

  playsToSortedList(plays){
    return Object.keys(plays).map(key => ({
      item: key,
      count: plays[key]
    })).sort(ExploreAll.sortByCount)
  }

  getTopN(list, N){
    return list.splice(0, N).map((item, i) =>
      <Text>{i + 1}. {item.item} ({item.count})</Text>
    )
  }

  static sortByCount(a, b){
    if (a.count < b.count) {
      return 1;
    } else if (a.count > b.count){
      return -1;
    } else return 0;
  }
}

export default ExploreAll