/* eslint-disable no-undef */
import * as React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Analyze from './Analyze';
import Overview from './Overview';
import ChronologicalSearchBar from '../../components/ChronologicalSearchBar';
import { actions, useStore } from '../../store';
import { selectMusicStore, selectSettings } from '../../store/selectors';
import { musicTheme } from '../../packages/colors';
import { Slate, SlateContent } from '../../packages/core';
import SlateSelector from '../../components/SlateSelector';
import { searchSpotify } from '../../api/spotify';
// ----------------------------------
// HELPERS
// ----------------------------------
const SLATE_FEATURES = ['overview', 'analyze'];
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
  const { start, end } = selectMusicStore(state);
  function setFeatureSlate(slateIdx) {
    dispatch(actions.setSettings({ ...settings, musicIdx: slateIdx }));
  }
  return (
    <Slate rimColor={musicTheme.primary} isFirst>
      <ChronologicalSearchBar
        start={start}
        end={end}
        setFilters={filters => dispatch(actions.setMusicFilters(filters))}
        dateControls={DATE_CONTROLS}
        colorTheme={musicTheme}
        fetchData={searchSpotify}
      />
      <SlateContent drops={1}>
        <SlateSelector pages={SLATE_FEATURES} idx={musicIdx} onChange={setFeatureSlate} />
        <Switch>
          <Route exact path="/music" render={() => <Redirect exact to={`/music/${SLATE_FEATURES[musicIdx]}`} />} />
          <Route exact path="/music/overview">
            <Overview />
          </Route>
          <Route exact path="/music/analyze">
            <Analyze />
          </Route>
        </Switch>
      </SlateContent>
    </Slate>
  );
};

export default Music;
