/* eslint-disable no-undef */
import React from 'react';
import Summary from './components/Summary';
import Tagger from './components/Tagger';
import { q_colors, q_components } from 'q-lib';

const { accountingQTheme } = q_colors;
const { ExplorePage } = q_components;


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
    const { selectedIndex } = this.state;
    switch (this.displays[selectedIndex]) {
      case 'Summary':
        return <Summary />;
      case 'Tagger':
        return <Tagger />;
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
