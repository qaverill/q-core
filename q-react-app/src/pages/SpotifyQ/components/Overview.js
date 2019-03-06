import React from 'react'
import { Header, Text } from "../../../components/styled-components";
import styled from 'styled-components'
import axios from 'axios'
import {SpotifyAPIErrorPage} from "../../../components/components";
import {capitolFirstLetter} from "../../../utils";
import ReactTooltip from "react-tooltip";

const TopChartsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const TopChart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% / 3);
  height: 100%;
`;

const Item = styled.div`
  align-self: stretch;
  margin: 2.5px;
  height: 20%;
  
  background-position: center;
  background-size: cover;

  transition: all 300ms ease-in;
  
  :hover {
    height: 100%;
  }
`;

const ToolTip = styled.div`
  display: flex;
  flex-direction: column
  align-items: center;
  justify-content: center;
`;

class Overview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      N: 5,
      totalDuration: null,
      topNTracks: null,
      topNArtists: null,
      topNAlbums: null
    }
  }

  componentWillMount(){
    this.analyzeResults()
  }

  render() {
    return (
      <TopChartsContainer>
        <ReactTooltip
          getContent={dataTip =>
            <ToolTip>
              <h2>{dataTip != null ? dataTip.split(':::')[0] : null}</h2>
              <h3>{dataTip != null ? dataTip.split(':::')[1] : null}</h3>
            </ToolTip>
          } />
        <TopChart>
          <Header>Top Tracks:</Header>
          {this.state.topNTracks}
        </TopChart>
        <TopChart>
          <Header>Top Artists:</Header>
          {this.state.topNArtists}
        </TopChart>
        <TopChart>
          <Header>Top Albums:</Header>
          {this.state.topNAlbums}
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

    this.getSpotifyData(this.playsToSortedList(trackPlays), "tracks");
    this.getSpotifyData(this.playsToSortedList(artistPlays), "artists");
    this.getSpotifyData(this.playsToSortedList(albumPlays), "albums");

    this.setState({ totalDuration: totalDuration })
  }

  playsToSortedList(plays){
    return Object.keys(plays).map(key => ({
      id: key,
      count: plays[key]
    })).sort(Overview.sortByCount)
  }

  getSpotifyData(list, type) {
    const _this = this;
    const topN = list.splice(0, this.state.N);
    axios.get(`/spotify/${type}?ids=${topN.map(item => item.id).join()}`)
      .then(res => {
        _this.setState({
          [`topN${capitolFirstLetter(type)}`]: res.data[type].map(item =>
            <Item
              key={item.id}
              style={{backgroundImage: `url(${_this.getItemImage(item, type)}`}}
              data-tip={`${item.name} ::: ${topN.find(e => e.id === item.id).count}`} />
          )
        });
        ReactTooltip.rebuild();
      }).catch(error => {
      console.log(error);
      if (error.response.status === 401) {
        this.props.root.setState({
          error: <SpotifyAPIErrorPage />
        })
      }
    })
  }

  getItemImage(item, type) {
    switch (type) {
      case "tracks":
        return item.album.images[0].url;
      case "artists":
        return item.images[0].url;
      case "albums":
        return item.images[0].url;
      default:
        return null;
    }
  }


  static sortByCount(a, b){
    if (a.count < b.count) {
      return 1;
    } else if (a.count > b.count){
      return -1;
    } else return 0;
  }
}

export default Overview