import React from 'react'
import styled from 'styled-components'
import ArraySelector from '../../components/ArraySelector';
import axios from 'axios';
import AlbumCoverArray from './components/AlbumCoverArray';
import AccountingData from './components/AccountingData';
import ReactTooltip from 'react-tooltip';

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
    this.collectors = [
      {
        name: 'listens',
        sourcePath: '/spotify/recently-played',
        mongodbPath: '/mongodb/listens',
        timeParam: 'played_at',
        color: dataQTheme.secondary
      },
      {
        name: 'saves',
        sourcePath: '/spotify/saved-tracks',
        mongodbPath: '/mongodb/saves',
        timeParam: 'added_at',
        color: dataQTheme.tertiary
      },
      {
        name: 'accounting data',
        sourcePath: '/accounting',
        mongodbPath: '/mongodb/accounting',
        color: dataQTheme.quaternary
      }
    ];
    this.state = {
      selectedIndex: q_settings.get().dataQSelectedIndex,
      unsaved: null,
      results: null
    };
  }

  componentWillMount() {
    this.getData();
  }

  render() {
    if (this.state.unsaved === null) {
      return (
        <DataQPage>
          <LoadingSpinner message={`Loading ${this.collectors[this.state.selectedIndex].name}...`}
                          color={this.collectors[this.state.selectedIndex].color} />
        </DataQPage>
      )
    } else {
      return (
        <DataQPage>
          <ReactTooltip />
          <ArraySelector array={this.collectors} parent={this} title={this.saveButton()} settingsKey="dataQSelectedIndex"/>
          <UnsavedContainer>
            {this.collectors[this.state.selectedIndex].sourcePath.indexOf('spotify') > -1
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
    axios.get(this.collectors[this.state.selectedIndex].sourcePath).then(res => {
      const items = res.data.items;
      const params = {params: {start: items[items.length - 1].timestamp}}
      axios.get(this.collectors[this.state.selectedIndex].mongodbPath, params).then(res => {
        const maxTimestamp = _this.getMaxTimestamp(res.data);
        _this.setState({
          unsaved: items.filter(item => (
            dateToEpoch(item[_this.collectors[_this.state.selectedIndex].timeParam]) > maxTimestamp)
          )
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

  getMaxTimestamp(items) {
    let maxTimestamp = 0;
    items.forEach(item => {
      if (item.timestamp > maxTimestamp){
        maxTimestamp = item.timestamp
      }
    });
    return maxTimestamp
  }

  transformDataForMongo(items) {
    return items.map(item => {
      return {
        timestamp: dateToEpoch(item[this.collectors[this.state.selectedIndex].timeParam]),
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
          color={this.collectors[this.state.selectedIndex].color}>
          Document {this.state.unsaved.length} {this.collectors[this.state.selectedIndex].name}
        </SaveButton>
      )
    } else {
      return (
        <Text>No undocumented {this.collectors[this.state.selectedIndex].name}</Text>
      )
    }
  }

  writeToMongo(){
    const _this = this;
    axios.post(this.collectors[this.state.selectedIndex].mongodbPath, this.transformDataForMongo(_this.state.unsaved))
      .then(() => {
        _this.setState({unsaved: null});
        _this.componentWillMount();
        NotificationManager.success(`Synced ${this.collectors[this.state.selectedIndex].name}`);
      })
  }
}

export default DataQ