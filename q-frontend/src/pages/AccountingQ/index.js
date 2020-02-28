/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Analyzer from './Analyzer';
import Viewer from './Viewer';
import ArraySelector from '../../sharedComponents/ArraySelector';
import ChronologicalSearchBar from '../../sharedComponents/ChronologicalSearchBar';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';

import { fetchDocuments, saveSettings } from '../../api/mongodb';
import { accountingQTheme } from '../../packages/colors';
import { Page, Title } from '../../packages/core';
import { times } from '../../packages/utils';

const Feature = styled.div`
  width: 100%;
  height: calc(100% - 90px);
`;

const AccountingQ = ({ settings, setSettings }) => {
  const [start, setStart] = useState(times.firstOfCurrentMonth());
  const [end, setEnd] = useState(times.now());
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);
  const [feature, setFeature] = useState(<LoadingSpinner message="Loading AccountingQ..." />);

  const features = (newData) => [
    <Analyzer title="Analytics" data={newData} />,
    <Viewer title="Data" data={newData} />,
  ];

  const getData = () => {
    const fetchData = async () => {
      const query = { start, end, filter };
      const transactions = await fetchDocuments({ collection: 'transactions', query });
      transactions.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
      setData(transactions);
      setFeature(features(transactions)[settings.accountingQ.idx]);
    };

    setFeature(<LoadingSpinner message="Loading AccountingQ..." />);
    fetchData();
  };

  useEffect(getData, [start, end, filter]);

  const saveIdx = (idx) => {
    const newSettings = settings;
    newSettings.accountingQ.idx = idx;
    saveSettings(newSettings);
    setSettings(newSettings);
    setFeature(getFeatures(data));
  };

  const dateControls = ['M', 'W'];

  return (
    <Page rimColor={accountingQTheme.primary}>
      <ChronologicalSearchBar
        start={start}
        end={end}
        setStart={setStart}
        setEnd={setEnd}
        setFilter={setFilter} // TODO: hook this set filter up yo
        dateControls={dateControls}
        colorTheme={accountingQTheme}
      />
      <ArraySelector
        array={features()}
        idx={settings.spotifyQ.idx}
        title={<Title>{feature.props.title}</Title>}
        saveIdx={saveIdx}
      />
      <Feature>{feature}</Feature>
    </Page>
  );
};

export default AccountingQ;
