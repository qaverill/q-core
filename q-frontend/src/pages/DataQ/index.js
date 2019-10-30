import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { NotificationManager } from 'react-notifications';

import ArraySelector from '../../components/ArraySelector';
import AlbumCoverArray from './components/AlbumCoverArray';
import AccountingData from './components/AccountingData/index';
import { collectors } from './collectors';
import { Page, Text, Button } from '../../components/styled-components';
import { LoadingSpinner, SpotifyAPIErrorPage } from '../../components/components';

const q_settings = require('q-settings');
const { dateToEpoch } = require('q-utils');
const { dataQTheme } = require('q-colors');

const Q_PLAYLIST_ID = '6d2V7fQS4CV0XvZr1iOVXJ';

const DataQPage = styled(Page)`
  border: 5px solid ${dataQTheme.primary};
`;

const SaveButton = styled(Button)`
  min-width: 180px;
  width: ${props => props.width};
`;

const addSavesToQPlaylist = data => {
  const requestBody = {
    playlistId: Q_PLAYLIST_ID,
    uris: data.map(d => `spotify:track:${d.track}`),
    position: 0,
  };
  axios.post('/spotify/playlists', requestBody).then((response) => {
    console.log(response);
    NotificationManager.success('Wrote saves to Q playlist');
  });
};

class DataQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: q_settings.get().dataQSelectedIndex,
      unsaved: null,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem('dataQUnsaved')) {
      this.setState({ unsaved: JSON.parse(sessionStorage.getItem('dataQUnsaved')) });
      console.log('Got unsaved from settings!');
    } else {
      this.getData();
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    const { selectedIndex } = this.state;
    if (prevState.selectedIndex !== selectedIndex) {
      this.getData();
      this.setState({ unsaved: null });
    }
  }

  getData() {
    const _this = this;
    const { root } = this.props;
    const { sourcePath, mongodbPath, timeParam, name } = this.collector();
    axios.get(sourcePath).then(sourceResults => {
      let { items } = sourceResults.data;
      const mongoParams = { params: { start: dateToEpoch(items[items.length - 1][timeParam]) } };
      axios.get(mongodbPath, mongoParams).then(mongoResults => {
        const maxTimestamp = Math.max(...mongoResults.data.map(d => d.timestamp));
        items = items.filter(i => dateToEpoch(i[timeParam]) > maxTimestamp);
        if (name === 'transactions') {
          const lastDataEntry = mongoResults.data.find(d => d.timestamp === maxTimestamp);
          const nextOrdinal = lastDataEntry != null ? lastDataEntry.ordinal + 1 : 1;
          items = items
            .reverse()
            .map((item, n) => ({ ...item, ordinal: nextOrdinal + n, tags: [] }))
            .reverse();
        }
        _this.setState({ unsaved: items });
      });
    }).catch(error => {
      if (error.response.status === 401) root.setState({ error: <SpotifyAPIErrorPage /> });
    });
  }

  collector() {
    const { selectedIndex } = this.state;
    return collectors[selectedIndex];
  }

  writeToMongo() {
    const _this = this;
    const { unsaved } = this.state;
    const collector = this.collector()
    if (collector.name === 'transactions') {
      if (unsaved.filter(i => i.tags.length > 0).length !== unsaved.length) {
        NotificationManager.error('Missing tags for a transaction!');
        return;
      }
    }
    const data = collector.name === 'transactions' ? unsaved : this.transformSpotifyDataForMongo(unsaved);
    axios.post(collector.mongodbPath, data).then(() => {
      _this.setState({ unsaved: null });
      _this.getData();
      NotificationManager.success(`Synced ${collector.name}`);
      if (collector.name === 'saves') addSavesToQPlaylist(data);
    });
  }

  transformSpotifyDataForMongo(items) {
    return items.map(item => ({
      timestamp: dateToEpoch(item[this.collector().timeParam]),
      track: item.track.id,
      artists: item.track.artists.map(artist => artist.id),
      album: item.track.album.id,
      duration: item.track.duration_ms,
      popularity: item.track.popularity,
    }));
  }

  SaveButton(props) {
    const { unsaved, name, color } = props;
    if (unsaved.length !== 0) {
      return (
        <SaveButton
          onClick={() => this.writeToMongo()}
          width={`calc(${unsaved.length * 2}% - 56px)`}
          color={color}
        >
          {`Document ${unsaved.length} ${name}`}
        </SaveButton>
      );
    }
    return (
      <Text>{`No undocumented ${name}`}</Text>
    );
  }

  render() {
    const { unsaved } = this.state;
    const { name, color, sourcePath } = this.collector();
    console.log(unsaved)
    if (unsaved === null) {
      return (
        <DataQPage>
          <LoadingSpinner message={`Loading ${name}...`} color={color} />
        </DataQPage>
      );
    }
    return (
      <DataQPage>
        <ReactTooltip />
        <ArraySelector
          array={collectors}
          parent={this}
          title={this.SaveButton({ unsaved, name, color })}
          settingsKey="dataQSelectedIndex"
        />
        {sourcePath.indexOf('spotify') > -1
          ? <AlbumCoverArray items={unsaved} parent={this} />
          : <AccountingData items={unsaved} parent={this} />}
      </DataQPage>
    );
  }
}

export default DataQ;
