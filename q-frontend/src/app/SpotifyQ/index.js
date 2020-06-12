/* eslint-disable no-undef */
import React, { useEffect } from 'react';

import Analytics from './Analytics';
import Albums from './Albums';
import PageSelector from '../../components/PageSelector';
import ChronologicalSearchBar from '../../components/ChronologicalSearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { actions, useStore } from '../../store';
import { selectSpotifyQStore, selectSettings } from '../../store/selectors';
import { spotifyQTheme } from '../../packages/colors';
import { fetchDocuments } from '../../api/mongodb';
import { Page } from '../../packages/core';
// ----------------------------------
// HELPERS
// ----------------------------------
const PAGES = ['Analytics', 'Albums'];
const DATE_CONTROLS = ['Y', 'M', 'W', 'D'];
// ----------------------------------
// STYLES
// ----------------------------------
// ----------------------------------
// COMPONENTS
// ----------------------------------
const Feature = ({ featureIdx }) => ([
  <Analytics />,
  <Albums />,
][featureIdx]);
const SpotifyQ = () => {
  const { state, dispatch } = useStore();
  const { spotifyQIdx } = selectSettings(state);
  const { data, start, end, filter } = selectSpotifyQStore(state);
  useEffect(() => {
    async function fetchSpotifyQData() {
      const query = { start, end, filter };
      const listens = await fetchDocuments({ collection: 'listens', query });
      const saves = await fetchDocuments({ collection: 'saves', query });
      const combinedData = listens.concat(saves).sort((a, b) => a.timestamp - b.timestamp);
      dispatch(actions.setSpotifyQData(combinedData));
    }
    fetchSpotifyQData();
  }, [start, end, filter]);

  function setFeature(featureIdx) {
    settings.spotifyQIdx = featureIdx;
    dispatch(actions.setSettings(settings));
  }

  return (
    <Page rimColor={spotifyQTheme.primary}>
      <ChronologicalSearchBar
        start={start}
        end={end}
        setStart={s => dispatch(actions.setSpotifyQStart(s))} // TODO: can remove the arrow fuinction here?
        setEnd={e => dispatch(actions.setSpotifyQEnd(e))}
        setFilter={f => dispatch(actions.setSpotifyQFilter(f))}
        dateControls={DATE_CONTROLS}
        colorTheme={spotifyQTheme}
      />
      <PageSelector
        pages={PAGES}
        idx={spotifyQIdx}
        onChange={setFeature}
      />
      {!data
        ? <LoadingSpinner message="Loading SpotifyQ..." />
        : <Feature featureIdx={spotifyQIdx} />}
    </Page>
  );
};

export default SpotifyQ;
