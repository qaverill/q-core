import React from 'react'
import { Page, Text, Button } from "../../components/styled-components";
import styled from 'styled-components'
import { LoadingSpinner, SpotifyAPIErrorPage} from "../../components/components";
import { dataQTheme } from "../../colors";
import ArraySelector from "../../components/ArraySelector/index";
import axios from "axios";
import {NotificationManager} from "react-notifications";
import AlbumCoverArray from "./components/AlbumCoverArray";
import ReactTooltip from "react-tooltip";

const DataQPage = styled(Page)`
  border: 5px solid ${dataQTheme.primary}
`;

const SaveButton = styled(Button)`
  min-width: 180px;
  width: ${props => props.width};
`;

const UnsavedContainer = styled.div`
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  align-content: stretch;
  margin-top: 2.5px;
`;

class DataQ extends React.Component {
  constructor(props){
    super(props);
    this.collectors = [
      {
        name: "listens",
        spotifyPath: "/spotify/recently-played",
        mongodbPath: "/mongodb/listens",
        timeParam: "played_at",
        color: dataQTheme.secondary
      },
      {
        name: "saves",
        spotifyPath: "/spotify/saved-tracks",
        mongodbPath: "/mongodb/saves",
        timeParam: "added_at",
        color: dataQTheme.tertiary
      }
    ];
    this.state = {
      selectedItem: this.collectors[1],
      unsaved: null,
      results: null
    };
  }

  componentWillMount(){
    this.getSpotifyData()
  }

  render() {
    if (this.state.unsaved === null) {
      return (
        <DataQPage>
          <LoadingSpinner message={`Loading ${this.state.selectedItem.name}...`} color={this.state.selectedItem.color}/>
        </DataQPage>
      )
    } else {
      return (
        <DataQPage>
          <ReactTooltip />
          <ArraySelector array={this.collectors} parent={this} title={this.saveButton()} />
          <UnsavedContainer>
            <AlbumCoverArray items={this.state.unsaved} parent={this}/>
          </UnsavedContainer>
        </DataQPage>
      )
    }
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState.selectedItem !== this.state.selectedItem){
      this.getSpotifyData();
      this.setState({
        unsaved: null
      })
    }
  }

  getSpotifyData(){
    const _this = this;
    axios.get(this.state.selectedItem.spotifyPath).then(res => {
      const items = res.data.items;
      axios.get(this.state.selectedItem.mongodbPath, {params: {start: items[49].timestamp}}).then(res => {
        const youngestTimestamp = _this.getYoungestTimestamp(res.data);
        _this.setState({
          unsaved: items.filter(item => {
            return parseInt(new Date(item[_this.state.selectedItem.timeParam]).getTime() / 1000, 10) > youngestTimestamp
          })
        })
      })
    }).catch(error => {
      if (error.response.status === 401) {
        this.props.root.setState({
          error: <SpotifyAPIErrorPage />
        })
      }
    })
  }

  getYoungestTimestamp(items){
    let youngestTimestamp = 0;
    items.forEach(item => {
      if (item.timestamp > youngestTimestamp){
        youngestTimestamp = item.timestamp
      }
    });
    return youngestTimestamp
  }

  makeMongodbFriendly(items){
    return items.map(item => {
      return {
        timestamp: parseInt(new Date(item[this.state.selectedItem.timeParam]).getTime()/1000, 10),
        track: item.track.id,
        artists: item.track.artists.map(artist => artist.id),
        album: item.track.album.id,
        duration: item.track.duration_ms,
        popularity: item.track.popularity
      }
    })
  }

  saveButton() {
    if (this.state.unsaved.length !== 0) {
      return (
        <SaveButton
          onClick={() => this.writeToMongo()}
          width={`calc(${this.state.unsaved.length * 2}% - 56px)`}
          color={this.state.selectedItem.color}>
          Document {this.state.unsaved.length} {this.state.selectedItem.name}
        </SaveButton>
      )
    } else {
      return (
        <Text>No undocumented {this.state.selectedItem.name}</Text>
      )
    }
  }

  writeToMongo(){
    const _this = this;
    axios.post(this.state.selectedItem.mongodbPath, this.makeMongodbFriendly(_this.state.unsaved))
      .then(() => {
        _this.setState({unsaved: null});
        _this.componentWillMount();
        NotificationManager.success(`Synced ${this.state.selectedItem.name}`);
      })
  }
}

export default DataQ