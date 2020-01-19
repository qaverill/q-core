/* eslint-disable no-undef */
import React, {useState, useEffect} from 'react';

import { accountingQTheme } from '@q/colors';
import { getSettings, times } from '@q/utils';

import Analyzer from './Analyzer';
import Viewer from './Viewer';
import ExplorePage from '../../components/explore-page';

const AccountingQ = () => {
  const [start, setStart] = useState(times.firstOfCurrentMonth());
  const [end, setEnd] = useState(times.now());
  const [data, setData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState()
}

class SpotifyQ extends React.Component {
  constructor(props) {
    super(props);
    this.displays = [
      'Analyzer',
      'Viewer',
    ];
    this.state = {
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
        return <Viewer data={data} filter={filter} parent={this} />;
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

export default AccountingQ;
