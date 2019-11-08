/* eslint-disable no-undef */
import React from 'react';
import ExplorePage from '@q/explore-page';
import { ONE_EPOCH_DAY } from '@q/utils';
import { spotifyQTheme } from '@q/theme';
import Overview from './components/Overview';
import Detail from './components/Detail';

class SpotifyQ extends React.Component {
  constructor(props) {
    super(props);
    this.displays = [
      'Overview',
      'Detail',
    ];
    this.state = {
      start: Math.round(new Date().getTime() / 1000) - 3 * ONE_EPOCH_DAY,
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
        colorTheme={spotifyQTheme}
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
