/* eslint-disable no-undef */
import React from 'react';
import ExplorePage from '../sharedComponents/ExplorerPage';
import Overview from './components/Overview';
import Detail from './components/Detail';

const q_utils = require('q-utils');
const { spotifyQTheme } = require('q-colors');

class SpotifyQ extends React.Component {
  constructor(props) {
    super(props);
    this.displays = [
      'Overview',
      'Detail',
    ];
    this.state = {
      start: Math.round(new Date().getTime() / 1000) - 3 * q_utils.ONE_EPOCH_DAY,
      end: Math.round(new Date().getTime() / 1000),
      data: null,
      selectedIndex: 0,
    };
  }

  displayResults() {
    const { root } = this.props;
    const { selectedIndex, data, end, start } = this.state;
    switch (this.displays[selectedIndex]) {
      case 'Overview':
        return <Overview data={data} root={root} />;
      case 'Detail':
        return <Detail data={data} totalTimeMs={(end - start) * 1000} />;
      default: return null;
    }
  }

  render() {
    const { start, end, data } = this.state;
    return (
      <ExplorePage
        source="listens"
        parent={this}
        color={spotifyQTheme.primary}
        explore={this.explore}
        results={this.displayResults()}
        displays={this.displays}
        start={start}
        end={end}
        data={data}
      />
    );
  }
}

export default SpotifyQ;
