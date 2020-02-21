/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChronologicalSearchBar from '../../components/ChronologicalSearchBar';
import { fetchDocuments, saveSettings } from '../../api/mongodb';
import { spotifyQTheme } from '../../packages/colors';
import { ONE_EPOCH_DAY } from '../../packages/utils';
import { Page } from '../../packages/core';
import Analytics from './Analytics';
import Data from './Data';
import ArraySelector from '../../components/ArraySelector';
import LoadingSpinner from '../../components/LoadingSpinner';

const Title = styled.h2`
  margin: 0 10px;
`;

const SpotifyQ = ({ settings, setSettings }) => {
  const [start, setStart] = useState(Math.round(new Date().getTime() / 1000) - 3 * ONE_EPOCH_DAY);
  const [end, setEnd] = useState(Math.round(new Date().getTime() / 1000));
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);
  const [feature, setFeature] = useState(<LoadingSpinner message="Loading SpotifyQ..." />);

  const features = () => [
    <Analytics title="Analytics" data={data} />,
    <Data title="Data" data={data} />,
  ];

  useEffect(() => {
    const fetchData = async () => {
      const query = { start, end, filter };
      const listens = await fetchDocuments({ collection: 'listens', query });
      console.log(listens.length)
      const saves = await fetchDocuments({ collection: 'saves', query });
      const combinedData = listens.concat(saves).sort((a, b) => a.timestamp - b.timestamp);
      setData(combinedData);
      setFeature(features()[settings.spotifyQ.idx]);
    };

    fetchData();
  }, [start, end, filter]);

  const saveIdx = (idx) => {
    settings.spotifyQ.idx = idx;
    saveSettings(settings);
    setSettings(settings);
    setFeature(features()[idx]);
  };

  const dateControls = ['Y', 'M', 'W', 'D'];

  return (
    <Page>
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
