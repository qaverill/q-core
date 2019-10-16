import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { NotificationManager } from 'react-notifications';
import ArraySelector from '../../components/ArraySelector';
import AlbumCoverArray from './components/AlbumCoverArray';
import AccountingData from './components/AccountingData';
import { collectors } from './collectors';

import { Page, Text, Button } from '../../components/styled-components';
import { LoadingSpinner, SpotifyAPIErrorPage } from '../../components/components';

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
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: q_settings.get().dataQSelectedIndex,
      unsaved: null,
    };
  }

  componentWillMount() {
    this.getData();
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
    const { sourcePath, mongodbPath, timeParam } = this.collector();
    axios.get(sourcePath).then(sourceResults => {
      const { items } = sourceResults.data;
      const mongoParams = { params: { start: dateToEpoch(items[items.length - 1][timeParam]) } };
      axios.get(mongodbPath, mongoParams).then(mongoResults => {
        const maxTimestamp = Math.max(...mongoResults.data.map(d => d.timestamp));
        _this.setState({ unsaved: items.filter(i => dateToEpoch(i[timeParam]) > maxTimestamp) });
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
    axios.post(this.collector().mongodbPath, this.transformDataForMongo(unsaved)).then(() => {
      _this.setState({ unsaved: null });
      _this.getData();
      NotificationManager.success(`Synced ${this.collector().name}`);
    });
  }

  transformDataForMongo(items) {
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
        <UnsavedContainer>
          {sourcePath.indexOf('spotify') > -1
            ? <AlbumCoverArray items={unsaved} parent={this} />
            : <AccountingData items={unsaved} />}
        </UnsavedContainer>
      </DataQPage>
    );
  }
}

export default DataQ;
