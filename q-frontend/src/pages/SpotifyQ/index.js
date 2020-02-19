/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';

import { ONE_EPOCH_DAY } from '@q/utils';
import { spotifyQTheme } from '@q/colors';

import Overview from './components/Overview';
import Detail from './components/Detail';
import ExplorePage from '../../components/explore-page';
import { fetchDocuments } from '../../api/mongodb';

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

const SpotifyQ = ({ settings }) => {
  const [start, setStart] = useState(Math.round(new Date().getTime() / 1000) - 3 * ONE_EPOCH_DAY);
  const [end, setEnd] = useState(Math.round(new Date().getTime() / 1000));
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const query = { start, end, filter };
      const listens = await fetchDocuments({ collection: 'listens', query });
      const saves = await fetchDocuments({ collection: 'saves', query });
      const combinedData = listens.concat(saves).sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
      setData(combinedData);
    }

    fetchData();
  }, [start, end, filter])

  return (
    <ExplorePage
      dateControls={['D', 'W', 'M', 'Y']}
      source="listens"
      colorTheme={spotifyQTheme}

      results={this.displayResults()}
      displays={this.displays}
      start={start}
      end={end}
      data={data}
    />
  )
}

class SpotifyQ extends React.Component {
  displayResults() {
    const { root } = this.props;
    const {
      selectedIndex,
      data,
      end,
      start,
      filter,
    } = this.state;
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
      
    );
  }
}

export default SpotifyQ;
