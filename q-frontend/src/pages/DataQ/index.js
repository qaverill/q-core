import React from 'react'
import styled from 'styled-components'
import ArraySelector from '../../components/ArraySelector';
import axios from 'axios';
import AlbumCoverArray from './components/AlbumCoverArray';
import AccountingData from './components/AccountingData';
import ReactTooltip from 'react-tooltip';
import { collectors } from './collectors';

import { Page, Text, Button } from '../../components/styled-components';
import { LoadingSpinner, SpotifyAPIErrorPage} from '../../components/components';
import { NotificationManager } from 'react-notifications';

const { dateToEpoch } = require('q-utils');
const q_settings = require('q-settings');
const { dataQTheme } = require('q-colors');

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
    this.state = {
      selectedIndex: q_settings.get().dataQSelectedIndex,
      unsaved: null,
      results: null
    };
  }

  componentWillMount() {
    this.getData();
  }

  collector() {
    return collectors[this.state.selectedIndex];
  }

  render() {
    if (this.state.unsaved === null) {
      return (
        <DataQPage>
          <LoadingSpinner 
            message={`Loading ${this.collector().name}...`}
            color={this.collector().color} 
          />
        </DataQPage>
      )
    } else {
      return (
        <DataQPage>
          <ReactTooltip />
          <ArraySelector 
            array={collectors} 
            parent={this} 
            title={this.saveButton()} 
            settingsKey="dataQSelectedIndex" 
          />
          <UnsavedContainer>
            {this.collector().sourcePath.indexOf('spotify') > -1
              ? <AlbumCoverArray items={this.state.unsaved} parent={this}/>
              : <AccountingData items={this.state.unsaved} />
            }
          </UnsavedContainer>
        </DataQPage>
      )
    }
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState.selectedIndex !== this.state.selectedIndex){
      this.getData();
      this.setState({
        unsaved: null
      })
    }
  }

  getData() {
    const _this = this;
    axios.get(this.collector().sourcePath).then(res => {
      const items = res.data.items;
      axios.get(this.collector().mongodbPath, { params: { start: items[items.length - 1].timestamp } }).then(res => {
        const maxTimestamp = Math.max(...res.data.map(d => d.timestamp))
        _this.setState({
          unsaved: items.filter(item => dateToEpoch(item[this.collector().timeParam]) > maxTimestamp)
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

  transformDataForMongo(items) {
    return items.map(item => {
      return {
        timestamp: dateToEpoch(item[this.collector().timeParam]),
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
          color={this.collector().color}>
          Document {this.state.unsaved.length} {this.collector().name}
        </SaveButton>
      )
    } else {
      return (
        <Text>No undocumented {this.collector().name}</Text>
      )
    }
  }

  writeToMongo(){
    const _this = this;
    axios.post(this.collector().mongodbPath, this.transformDataForMongo(_this.state.unsaved))
      .then(() => {
        _this.setState({unsaved: null});
        _this.componentWillMount();
        NotificationManager.success(`Synced ${this.collector().name}`);
      })
  }
}

export default DataQ