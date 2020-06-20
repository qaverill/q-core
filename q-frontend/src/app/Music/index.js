/* eslint-disable no-undef */
import * as React from 'react';
import styled from 'styled-components';
import { Switch, Redirect, Route } from 'react-router-dom';
import Analytics from './Analytics';
import Albums from './Albums';
import ChronologicalSearchBar from '../../components/ChronologicalSearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { actions, useStore } from '../../store';
import { selectMusicStore, selectSettings } from '../../store/selectors';
import { musicTheme } from '../../packages/colors';
import { fetchDocuments } from '../../api/mongodb';
import { Slate, SlateContent } from '../../packages/core';
import SlateSelector from '../../components/SlateSelector';
// ----------------------------------
// HELPERS
// ----------------------------------
const SLATE_FEATURES = ['analytics', 'albums'];
const DATE_CONTROLS = ['Y', 'M', 'W', 'D'];
// ----------------------------------
// STYLES
// ----------------------------------
// ----------------------------------
// COMPONENTS
// ----------------------------------
const Music = () => {
  const { state, dispatch } = useStore();
  const { settings } = state;
  const { musicIdx } = selectSettings(state);
  const { data, start, end, filter } = selectMusicStore(state);
  const isLoading = data.length === 0;
  React.useEffect(() => {
    async function fetchMusicData() {
      const query = { start, end, filter };
      const listens = await fetchDocuments({ collection: 'listens', query });
      const saves = await fetchDocuments({ collection: 'saves', query });
      const combinedData = listens.concat(saves).sort((a, b) => a.timestamp - b.timestamp);
      dispatch(actions.setMusicData(combinedData));
    }
    dispatch(actions.setMusicData([]));
    fetchMusicData();
  }, [start, end, filter]);

  function setFeatureSlate(slateIdx) {
    dispatch(actions.setSettings({ ...settings, musicIdx: slateIdx }));
  }

  return (
    <Slate rimColor={musicTheme.primary} isFirst>
      <ChronologicalSearchBar
        start={start}
        end={end}
        setStart={s => dispatch(actions.setMusicStart(s))}
        setEnd={e => dispatch(actions.setMusicEnd(e))}
        setFilter={f => dispatch(actions.setMusicFilter(f))}
        dateControls={DATE_CONTROLS}
        colorTheme={musicTheme}
      />
      <SlateContent drops={1}>
        <SlateSelector pages={SLATE_FEATURES} idx={musicIdx} onChange={setFeatureSlate} />
        {isLoading && <LoadingSpinner message="Loading Music..." />}
        {!isLoading && (
          <Switch>
            <Route exact path="/music" render={() => <Redirect exact to={`/music/${SLATE_FEATURES[musicIdx]}`} />} />
            <Route exact path="/music/analytics">
              <Analytics />
            </Route>
            <Route exact path="/music/albums">
              <Albums />
            </Route>
          </Switch>
        )}
      </SlateContent>
    </Slate>
  );
};

export default Music;
