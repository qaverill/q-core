/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';

import Analytics from './Analytics';
import Albums from './Albums';
import ArraySelector from '../../sharedComponents/ArraySelector';
import ChronologicalSearchBar from '../../sharedComponents/ChronologicalSearchBar';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';

import { fetchDocuments, saveSettings } from '../../api/mongodb';
import { spotifyQTheme } from '../../packages/colors';
import { Page, Title } from '../../packages/core';
import { ONE_EPOCH_DAY } from '../../packages/utils';

const SpotifyQ = ({ settings, setSettings }) => {
  const [start, setStart] = useState(Math.round(new Date().getTime() / 1000) - 3 * ONE_EPOCH_DAY);
  const [end, setEnd] = useState(Math.round(new Date().getTime() / 1000));
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);
  const [feature, setFeature] = useState(<LoadingSpinner message="Loading SpotifyQ..." />);

  const features = (newData) => [
    <Analytics title="Analytics" data={newData} />,
    <Albums title="Data" data={newData} />,
  ];

  const getFeatures = (newData) => features(newData)[settings.spotifyQ.idx];

  useEffect(() => {
    const fetchData = async () => {
      const query = { start, end, filter };
      const listens = await fetchDocuments({ collection: 'listens', query });
      const saves = await fetchDocuments({ collection: 'saves', query });
      const combinedData = listens.concat(saves).sort((a, b) => a.timestamp - b.timestamp);
      setData(combinedData);
      setFeature(getFeatures(combinedData));
    };

    setFeature(<LoadingSpinner message="Loading SpotifyQ..." />);
    fetchData();
  }, [start, end, filter]);

  const saveIdx = (idx) => {
    const newSettings = settings;
    newSettings.spotifyQ.idx = idx;
    saveSettings(newSettings);
    setSettings(newSettings);
    setFeature(getFeatures(data));
  };

  const dateControls = ['Y', 'M', 'W', 'D'];

  return (
    <Page rimColor={spotifyQTheme.primary}>
      <ChronologicalSearchBar
        start={start}
        end={end}
        setStart={setStart}
        setEnd={setEnd}
        setFilter={setFilter}
        dateControls={dateControls}
        colorTheme={spotifyQTheme}
      />
      <ArraySelector
        array={features()}
        idx={settings.spotifyQ.idx}
        title={<Title>{feature.props.title}</Title>}
        saveIdx={saveIdx}
      />
      {feature}
    </Page>
  );
};

export default SpotifyQ;
