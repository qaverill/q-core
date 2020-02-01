/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { NotificationManager } from 'react-notifications';
import { dataQTheme } from '@q/colors';
import { Page, Text, Button } from '@q/core';
import { getSettings, dateToEpoch } from '@q/utils';

import { collectors } from './collectors';
import AlbumCoverArray from './components/AlbumCoverArray';
import AccountingData from './components/AccountingData';
import LoadingSpinner from '../../components/loading-spinner';
import SpotifyAPIErrorPage from '../../components/spotify-error-page';
import ArraySelector from '../../components/array-selector';
import { getUnsavedListens, getUnsavedSaves } from '../../api/unsaved';
import { pushTracksOntoQPlaylist } from '../../api/spotify';

let ordinalStart;

const TRANSACTION_SOURCES = ['mvcu', 'venmo', 'citi'];

const DataQPage = styled(Page)`
  border: 5px solid ${dataQTheme.primary};
`;

const SaveButton = styled(Button)`
  min-width: 180px;
  width: ${props => props.width};
`;

const getUnsavedTransactionData = (items, mongoResults) => {
  let transactionFacts = items;
  TRANSACTION_SOURCES.forEach(source => {
    const sourceMaxTimestamp = Math.max(...mongoResults.data.filter(d => d.account.indexOf(source) > -1).map(d => d.timestamp));
    transactionFacts = transactionFacts
      .filter(f => (f.account.indexOf(source) > -1 ? f.timestamp > sourceMaxTimestamp : true));
  });
  const lastTimestamp = Math.max(...mongoResults.data.map(d => d.timestamp));
  const lastDataEntry = mongoResults.data.find(d => d.timestamp === lastTimestamp);
  ordinalStart = lastDataEntry != null ? lastDataEntry.ordinal + 1 : 1;
  return transactionFacts
    .reverse()
    .map((fact, n) => ({ ...fact, ordinal: ordinalStart + n, tags: [] }))
    .reverse();
};

const DataQ = ({ settings, setSettings }) => {
  const [unsaved, setUnsaved] = useState(null);
  console.log(settings)
  const { idx } = settings.dataQ;

  useEffect(() => {
    setSettings(null);
  }, [idx]);

  return (
    <h2>aight</h2>
  );
};

class DataQOLD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: getSettings().dataQSelectedIndex,
      unsaved: null,
    };
  }

  getData() {
    const { root } = this.props;
    const {
      mongodbPath,
      name,
    } = this.collector();
    switch (name) {
      case 'transactions':
        axios.get('/transactions').then(sourceResults => {
          const { items } = sourceResults.data;
          const mongoParams = {
            params: { start: dateToEpoch(items[items.length - 1].timestamp) },
          };
          axios.get(mongodbPath, mongoParams).then(mongoResults => {
            _this.setState({ unsaved: getUnsavedTransactionData(items, mongoResults) });
          });
        }).catch(() => {
          _this.setState({ unsaved: [] });
        });
        break;
      case 'saves':
        getUnsavedSaves({ root, _this: this }, (listens, _this) => {
          _this.setState({ unsaved: listens.data });
        });
        break;
      case 'listens':
        getUnsavedListens({ root, _this: this }, (saves, _this) => {
          _this.setState({ unsaved: saves.data });
        });
        break;
      default:
        break;
    }
  }

  collector() {
    const { selectedIndex } = this.state;
    return collectors[selectedIndex];
  }

  writeToMongo() {
    const _this = this;
    const { unsaved } = this.state;
    const { root } = this.props;
    const collector = this.collector();
    if (collector.name === 'transactions') {
      if (unsaved.filter(i => i.tags.indexOf('NEEDS ORDINAL') > -1).length > 0) {
        NotificationManager.error('A transaction is missing an ordinal!');
        return;
      }
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
      if (collector.name === 'saves') pushTracksOntoQPlaylist(data);
      sessionStorage.removeItem('dataQUnsaved');
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
    if (name === 'transactions' && unsaved.filter(i => i.tags == null || i.tags.length === 0).length !== 0) {
      return <Text>TAG SHIT FIRST</Text>;
    }
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
