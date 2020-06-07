/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';

import Analytics from './Analytics';
import Albums from './Albums';
import PageSelector from '../../components/PageSelector';
import ChronologicalSearchBar from '../../components/ChronologicalSearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { actions, useStore } from '../../store';
import { fetchDocuments, saveSettings } from '../../api/mongodb';
import { spotifyQTheme } from '../../packages/colors';
import { Page } from '../../packages/core';
import { ONE_EPOCH_DAY } from '../../packages/utils';

const SpotifyQ = () => {
  const { state, dispatch } = useStore();
  const { settings } = state;
  const [start, setStart] = useState(Math.round(new Date().getTime() / 1000) - 3 * ONE_EPOCH_DAY);
  const [end, setEnd] = useState(Math.round(new Date().getTime() / 1000));
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);
  const pages = ['Analytics', 'Albums'];

  useEffect(() => {
    const fetchData = async () => {
      const query = { start, end, filter };
      const listens = await fetchDocuments({ collection: 'listens', query });
      const saves = await fetchDocuments({ collection: 'saves', query });
      const combinedData = listens.concat(saves).sort((a, b) => a.timestamp - b.timestamp);
      setData(combinedData);
    };

    fetchData();
  }, [start, end, filter]);

  const saveIdx = (idx) => {
    settings.spotifyQ.idx = idx;
    saveSettings(settings);
    dispatch(actions.setSettings(settings));
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
      <PageSelector
        pages={pages}
        idx={settings.spotifyQ.idx}
        onChange={saveIdx}
      />
      {data
        ? [
          <Analytics data={data} />,
          <Albums data={data} />,
        ][settings.spotifyQ.idx]
        : <LoadingSpinner message="Loading SpotifyQ..." />}
    </Page>
  );
};

export default SpotifyQ;
