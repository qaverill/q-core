import React, {Component} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import AlbumCoverArray from './AlbumCoverArray'
import { Button } from "../../../components/styled-components";
import { dark, purple } from "../../../colors";
import 'react-notifications/lib/notifications.css'
import { NotificationManager } from 'react-notifications'
import { loadingSpinner } from "../../../components/components";
import ReactTooltip from "react-tooltip";

const SpotifyCollectorContainer = styled.div`
  width: 100%;
  height: calc(100% - 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  background-color: ${dark};
`;

const UnsavedContainer = styled.div`
  max-height: 100%;
  width: calc(100% - 10px);
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  align-content: stretch;
`;

const SaveButton = styled(Button)`
  min-width: 180px;
  width: ${props => props.width};
`;

class SpotifyCollector extends Component {
  constructor(props){
    super(props);
    this.state = {
      unsaved: [],
      loading: true
    };
  }

  render() {
    if (this.state.unsaved.length !== 0){
      return (
        <SpotifyCollectorContainer>
          <SaveButton onClick={() => this.writeToMongo()} width={(this.state.unsaved.length * 2) - 1 + "%" } color={purple}>
            Write {this.state.unsaved.length} {this.props.collector.name}
          </SaveButton>
          <UnsavedContainer>
            <ReactTooltip />
            <AlbumCoverArray items={(this.state.unsaved)} parent={this}/>
          </UnsavedContainer>
        </SpotifyCollectorContainer>
      );
    } else if (this.state.loading) {
      return loadingSpinner(`Loading ${this.props.collector.name}...`);
    } else return <h1>No unsaved {this.props.collector.name}</h1>
  }

  componentWillMount(){
    this.getSpotifyData()
  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props){
      this.getSpotifyData();
      this.setState({
        unsaved: [],
        loading: true
      })
    }
  }

  getSpotifyData(){
    const _this = this;
    axios.get(this.props.collector.spotifyPath)
      .then(res => {
        const items = res.data.items;
        axios.get(this.props.collector.mongodbPath, {params: {start: items[49].timestamp}})
          .then(res => {
            const youngestTimestamp = _this.getYoungestTimestamp(res.data);
            _this.setState({
              unsaved: items.filter(item => {
                return parseInt(new Date(item[_this.props.collector.timeParam]).getTime()/1000, 10) > youngestTimestamp
              }),
              loading: false
            })
          })
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
        timestamp: parseInt(new Date(item[this.props.collector.timeParam]).getTime()/1000, 10),
        track: item.track.id,
        artists: item.track.artists.map(artist => artist.id),
        album: item.track.album.id,
        duration: item.track.duration_ms,
        popularity: item.track.popularity
      }
    })
  }

  writeToMongo(){
    const _this = this;
    axios.post(this.props.collector.mongodbPath, this.makeMongodbFriendly(_this.state.unsaved))
      .then(() => {
        _this.setState({unsaved: []});
        _this.componentWillMount();
        NotificationManager.success(`Synced ${this.props.collector.name}`);
      })
  }
}

export default SpotifyCollector;