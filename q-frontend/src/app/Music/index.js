/* eslint-disable no-undef */
import * as React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Charts from './Charts';
import Graphs from './Graphs';
import Albums from './Albums';
import ChronologicalSearchBar from '../../components/ChronologicalSearchBar';
import { actions, useStore } from '../../store';
import { selectMusicStore, selectSettings } from '../../store/selectors';
import { musicTheme } from '../../packages/colors';
import { Slate, SlateContent } from '../../packages/core';
import SlateSelector from '../../components/SlateSelector';
// ----------------------------------
// HELPERS
// ----------------------------------
const SLATE_FEATURES = ['charts', 'graphs', 'albums'];
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
        setStart={s => dispatch(actions.setMusicStart(s))}
        setEnd={e => dispatch(actions.setMusicEnd(e))}
        setFilter={f => dispatch(actions.setMusicFilter(f))}
        dateControls={DATE_CONTROLS}
        colorTheme={musicTheme}
      />
      <SlateContent drops={1}>
        <SlateSelector pages={SLATE_FEATURES} idx={musicIdx} onChange={setFeatureSlate} />
        <Switch>
          <Route exact path="/music" render={() => <Redirect exact to={`/music/${SLATE_FEATURES[musicIdx]}`} />} />
          <Route exact path="/music/charts">
            <Charts />
          </Route>
          <Route exact path="/music/graphs">
            <Graphs />
          </Route>
          <Route exact path="/music/albums">
            <Albums />
          </Route>
        </Switch>
      </SlateContent>
    </Slate>
  );
};

export default Music;
