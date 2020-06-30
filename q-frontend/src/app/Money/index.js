/* eslint-disable no-undef */
import * as React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Analyze from './Analyze';
import Audit from './Audit';
import ChronologicalSearchBar from '../../components/ChronologicalSearchBar';
import { Slate, SlateContent } from '../../packages/core';
import SlateSelector from '../../components/SlateSelector';
import { moneyTheme } from '../../packages/colors';
import { actions, useStore } from '../../store';
import { selectSettings, selectMoneyStore } from '../../store/selectors';
// ----------------------------------
// HELPERS
// ----------------------------------
const DATE_CONTROLS = ['M', 'W'];
const SLATE_FEATURES = ['Analyze', 'Audit'];
// ----------------------------------
// STYLES
// ----------------------------------
// ----------------------------------
// COMPONENTS
// ----------------------------------
const Money = () => {
  const { state, dispatch } = useStore();
  const { settings } = state;
  const { moneyIdx } = selectSettings(state);
  const { start, end } = selectMoneyStore(state);
  function setFeatureSlate(slateIdx) {
    dispatch(actions.setSettings({ ...settings, moneyIdx: slateIdx }));
  }
  return (
    <Slate rimColor={moneyTheme.primary}>
      <ChronologicalSearchBar
        start={start}
        end={end}
        setFilters={filters => dispatch(actions.setMusicFilters(filters))}
        dateControls={DATE_CONTROLS}
        colorTheme={moneyTheme}
      />
      <SlateContent drops={1}>
        <SlateSelector pages={SLATE_FEATURES} idx={moneyIdx} onChange={setFeatureSlate} />
        <Switch>
          <Route exact path="/money" render={() => <Redirect exact to={`/music/${SLATE_FEATURES[moneyIdx]}`} />} />
          <Route exact path="/music/analytics">
            <Analyze />
          </Route>
          <Route exact path="/music/audi">
            <Audit />
          </Route>
        </Switch>
      </SlateContent>
    </Slate>
  );
};

export default Money;
