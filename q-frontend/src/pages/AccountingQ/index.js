/* eslint-disable no-undef */
import React from 'react';

import { accountingQTheme } from '@q/colors';
import { getSettings } from '@q/utils';

import Analyzer from './components/Analyzer';
import Viewer from './components/Viewer';
import ExplorePage from '../../components/explore-page';

class SpotifyQ extends React.Component {
  constructor(props) {
    super(props);
    this.displays = [
      'Analyzer',
      'Viewer',
    ];
    this.state = {
      start: Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), 1) / 1000),
      end: Math.round(new Date().getTime() / 1000),
      data: null,
      selectedIndex: getSettings().accountingQSelectedIndex,
      filter: null,
    };
  }

  displayResults() {
    const {
      selectedIndex,
      data,
      start,
      end,
      filter,
    } = this.state;
    switch (this.displays[selectedIndex]) {
      case 'Analyzer':
        return <Analyzer data={data} start={start} end={end} />;
      case 'Viewer':
        return <Viewer data={data} filter={filter} />;
      default: return null;
    }
  }

  render() {
    const { start, end, data } = this.state;
    return (
      <ExplorePage
        source="transactions"
        parent={this}
        colorTheme={accountingQTheme}
        results={this.displayResults()}
        displays={this.displays}
        start={start}
        end={end}
        data={data}
        dateControls={['W', 'M']}
        settingsKey="accountingQSelectedIndex"
      />
    );
  }
}

export default SpotifyQ;
