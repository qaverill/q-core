/* eslint-disable no-undef */
import React, {useState, useEffect} from 'react';

import { accountingQTheme } from '@q/colors';
import { getSettings, times } from '@q/utils';

import Analyzer from './Analyzer';
import Viewer from './Viewer';
import ExplorePage from '../../components/ChronologicalSearchBar';

const AccountingQ = ({ settings, setSettings }) => {
  console.log(settings);
  const [start, setStart] = useState(times.firstOfCurrentMonth());
  const [end, setEnd] = useState(times.now());
  const [data, setData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(settings.accountingQSelectedIndex);
  const [filter, setFilter] = useState(null);
  const displays = [
    'Analytics',
    'Data',
  ];

  const results = () => [
    <Analyzer data={data} start={start} end={end} />,
    <Viewer data={data} filter={filter} parent={this} />,
  ][selectedIndex];

  return (
    <ExplorePage
      source="transactions"
      colorTheme={accountingQTheme}
      results={results()}
      displays={displays}
      start={start}
      end={end}
      data={data}
      dateControls={['W', 'M']}
      settingsKey="accountingQSelectedIndex"
    />
  );
};

export default AccountingQ;
