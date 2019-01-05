import React, {Component} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import AlbumCoverArray from './AlbumCoverArray'
import { Button, LeftArrow, RightArrow, Text } from "../../../components/styled-components";
import { dark, purple } from "../../../colors";
import 'react-notifications/lib/notifications.css'
import { NotificationManager } from 'react-notifications'
import { loadingSpinner } from "../../../components/components";
import ReactTooltip from "react-tooltip";

const SpotifyCollectorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  background-color: ${dark};
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const UnsavedContainer = styled.div`
  max-height: 100%;
  width: 100%;
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
      unsaved: null,
      results: null
    };
  }

  render() {
    if (this.state.unsaved === null) {
      return loadingSpinner(`Loading ${this.props.collector.name}...`, this.props.collector.color);
    } else if (this.state.unsaved.length !== 0){
      return (
        <SpotifyCollectorContainer>
          <Controls>
            <LeftArrow onClick={() => this.props.parent.decreaseCollectorIndex()} />
            <SaveButton
              onClick={() => this.writeToMongo()}
              width={`calc(${this.state.unsaved.length * 2}% - 56px)`}
              color={this.props.collector.color}>
              Document {this.state.unsaved.length} {this.props.collector.name}
            </SaveButton>
            <RightArrow onClick={() => this.props.parent.increaseCollectorIndex()} />
          </Controls>
          <UnsavedContainer>
            <ReactTooltip />
            <AlbumCoverArray items={(this.state.unsaved)} parent={this}/>
          </UnsavedContainer>
        </SpotifyCollectorContainer>
      );
    } else return (
      <SpotifyCollectorContainer>
        <Controls>
          <LeftArrow onClick={() => this.props.parent.decreaseCollectorIndex()} />
          <Text>No undocumented {this.props.collector.name}</Text>
          <RightArrow onClick={() => this.props.parent.increaseCollectorIndex()} />
        </Controls>
      </SpotifyCollectorContainer>
    )
  }

  componentWillMount(){
    this.getSpotifyData()
  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props){
      this.getSpotifyData();
      this.setState({
        unsaved: null
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
              })
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