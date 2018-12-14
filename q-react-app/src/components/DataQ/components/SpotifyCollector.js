import React, {Component} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import AlbumCoverArray from './AlbumCoverArray'
import { Button } from "../../styled-components";
import { dark, purple } from "../../../colors";
import 'react-notifications/lib/notifications.css'
import { NotificationManager } from 'react-notifications'

const SpotifyCollectorContainer = styled.div`
  width: 100%;
  height: calc(100% - 68px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: ${dark};
`;

const UnsavedContainer = styled.div`
  height: 100%;
  width: calc(100% - 10px);
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  align-content: stretch;
`;

const SaveButton = styled(Button)`
  padding: 5px 5px;
  margin: 10px 10px;
  min-width: 180px;
  background-color: ${purple};
  width: ${props => props.width};
`;

class SpotifyCollector extends Component {
  constructor(props){
    super(props);
    this.state = {
      unsaved: [],
      total: null,
    };
    this.writeToMongo = this.writeToMongo.bind(this);
  }

  render() {
    if (this.state.unsaved.length !== 0){
      return (
        <SpotifyCollectorContainer>
          <SaveButton onClick={this.writeToMongo} width={(this.state.unsaved.length * 2) - 1 + "%" }>
            Unsaved {this.props.collector.name}: {this.state.unsaved.length}/50
          </SaveButton>
          <UnsavedContainer>
            <AlbumCoverArray items={(this.state.unsaved)} parent={this}/>
          </UnsavedContainer>
        </SpotifyCollectorContainer>
      );
    } else return null;
  }

  componentWillMount(){
    this.getSpotifyData()
  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props){
      this.getSpotifyData()
    }
  }

  getSpotifyData(){
    const _this = this;
    axios.get(this.props.collector.spotifyPath)
      .then(res => {
        const next = res.data.next;
        const items = res.data.items;
        axios.get(this.props.collector.mongodbPath, {params: {start: items[49].timestamp}})
          .then(res => {
            const youngestTimestamp = _this.getYoungestTimestamp(res.data);
            _this.setState({
              unsaved: items.filter(item => {
                return parseInt(new Date(item[_this.props.collector.timeParam]).getTime()/1000, 10) > youngestTimestamp
              }),
            });
            if (next != null){
              _this.getNextSpotifyData(next, youngestTimestamp)
            }
          });
      });
  }

  getNextSpotifyData(url, youngestTimestamp){
    const _this = this;
    axios.get(`/spotify?url=${url}`)
      .then(res => {
        const items = res.data.items;
        if (items.length > 0){
          // If the code reaches here, then it is guaranteed to be spotify/saved-tracks
          let newUnsaved = _this.state.unsaved;
          let allDone = false;
          items.forEach(item => {
            if (parseInt(new Date(item[_this.props.collector.timeParam]).getTime()/1000, 10) > youngestTimestamp){
              newUnsaved.push(item)
            } else {
              allDone = true
            }
          });
          _this.setState({
            unsaved: newUnsaved
          });
          if (!allDone && res.data.next != null){
            _this.getNextSpotifyData(res.data.next, youngestTimestamp)
          }
        }
      });
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