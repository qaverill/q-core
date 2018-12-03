import React, {Component} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import AlbumCoverArray from '../AlbumCoverArray'
import { Button } from "../../../styled-components";
import { dark, purple } from "../../../../colors";
import 'react-notifications/lib/notifications.css'
import { NotificationManager } from 'react-notifications'

const SpotifyHistoryContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: ${dark};
`;

const UnsavedListensContainer = styled.div`
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

class SpotifyHistory extends Component {
  constructor(props){
    super(props);
    this.state = {
      unsavedListens: []
    };
    this.writeListensToMongo = this.writeListensToMongo.bind(this);
  }

  render() {
    if (this.state.unsavedListens.length !== 0){
      return (
        <SpotifyHistoryContainer>
          <SaveButton onClick={this.writeListensToMongo} width={(this.state.unsavedListens.length * 2) - 1 + "%" }>
            Unsaved Listens: {this.state.unsavedListens.length}/50
          </SaveButton>
          <UnsavedListensContainer>
            <AlbumCoverArray items={(this.state.unsavedListens)} parent={this}/>
          </UnsavedListensContainer>
        </SpotifyHistoryContainer>
      );
    } else return null;
  }

  componentWillMount(){
    const _this = this;
    axios.get('/spotify/recently-played')
      .then(res => {
        const listens = res.data.items;
        axios.get('/mongodb/listens', {params: {start: listens[49].timestamp}})
          .then(res => {
            const alreadySavedTimestamps = res.data.map(listen => listen.timestamp);
            _this.setState({
              unsavedListens: listens.filter(listen => {
                return !alreadySavedTimestamps.includes(parseInt(new Date(listen.played_at).getTime()/1000, 10))
              }),
            });
          });
      });
  }

  parseSpotifyRecentlyPlayedToListens(recentlyPlayed) {
    return recentlyPlayed.map(play => {
      return {
        timestamp: parseInt(new Date(play.played_at).getTime()/1000, 10),
        track: play.track.id,
        artists: play.track.artists.map(artist => artist.id),
        album: play.track.album.id,
        duration: play.track.duration_ms,
        popularity: play.track.popularity
      }
    })
  }

  writeListensToMongo(){
    const _this = this;
    axios.post('/mongodb/listens', _this.parseSpotifyRecentlyPlayedToListens(_this.state.unsavedListens))
      .then(() => {
        _this.setState({unsavedListens: []});
        _this.componentWillMount();
        NotificationManager.success('Synced History');
      })
  }
}

export default SpotifyHistory;