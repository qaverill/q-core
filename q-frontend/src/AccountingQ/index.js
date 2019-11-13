/* eslint-disable no-undef */
import React from 'react';
import { accountingQTheme } from '@q/theme';
import ExplorePage from '@q/explore-page';
import Summary from './components/Summary';
import Tagger from './components/Tagger';

class SpotifyQ extends React.Component {
  constructor(props) {
    super(props);
    this.displays = [
      'Summary',
      'Tagger',
    ];
    this.state = {
      start: Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), 1) / 1000),
      end: Math.round(new Date().getTime() / 1000),
      data: null,
      selectedIndex: 0,
    };
  }

  displayResults() {
    const { selectedIndex, data, start, end } = this.state;
    switch (this.displays[selectedIndex]) {
      case 'Summary':
        return <Summary start={start} end={end} />
      case 'Tagger':
        return <Tagger data={data ? data.sort((a, b) => b.ordinal - a.ordinal) : null} />;
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
      />
    );
  }
}

export default SpotifyQ;
