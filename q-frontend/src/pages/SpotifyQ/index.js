/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChronologicalSearchBar from '../../sharedComponents/ChronologicalSearchBar';
import { fetchDocuments, saveSettings } from '../../api/mongodb';
import { spotifyQTheme } from '../../packages/colors';
import { ONE_EPOCH_DAY } from '../../packages/utils';
import { Page } from '../../packages/core';
import Analytics from './Analytics';
import ArraySelector from '../../sharedComponents/ArraySelector';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Albums from './Albums';

const SpotifyQPage = styled(Page)`
  border: 5px solid ${spotifyQTheme.primary};
`;

const Title = styled.h2`
  margin: 0 10px;
`;

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
    <SpotifyQPage>
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
    </SpotifyQPage>
  );
};

export default SpotifyQ;
