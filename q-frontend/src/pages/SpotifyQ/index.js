/* eslint-disable no-undef */
import React from 'react';

import { ONE_EPOCH_DAY } from '@q/utils';
import { spotifyQTheme } from '@q/colors';

import Overview from './components/Overview';
import Detail from './components/Detail';
import ExplorePage from '../../components/explore-page';

const filterData = (data, filter) => {
  const dataOfArtist = data.filter(listen => listen.artists.includes(filter));
  if (dataOfArtist.length > 0) {
    return dataOfArtist;
  }
  const dataOfAlbum = data.filter(listen => listen.album === filter);
  if (dataOfAlbum.length > 0) {
    return dataOfAlbum;
  }
  return data.filter(listen => listen.track === filter);
};

class SpotifyQ extends React.Component {
  constructor(props) {
    super(props);
    this.displays = [
      'Overview',
      'Detail',
    ];
    this.state = {
      start: Math.round(new Date().getTime() / 1000) - 300 * ONE_EPOCH_DAY,
      end: Math.round(new Date().getTime() / 1000),
      filter: null,
      data: null,
      selectedIndex: 0,
    };
  }

  displayResults() {
    const { root } = this.props;
    const {
      selectedIndex,
      data,
      end,
      start,
      filter,
    } = this.state;
    console.log(filter)
    const filteredData = filter && data ? filterData(data, filter) : data;
    switch (this.displays[selectedIndex]) {
      case 'Overview':
        return <Overview data={filteredData} root={root} />;
      case 'Detail':
        return <Detail data={filteredData} totalTimeMs={(end - start) * 1000} />;
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
        dateControls={['D', 'W', 'M', 'Y']}
      />
    );
  }
}

export default SpotifyQ;
