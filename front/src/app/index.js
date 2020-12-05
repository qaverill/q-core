import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SlateContent } from '../common/elements';
import Music from './Music';
import Money from './Money';
import Dashboard from './Dashboard';
import { SlateSelector } from '../components/Selectors';
// ----------------------------------
// HELPERS
// ----------------------------------
const SLATES = ['music', 'dashboard', 'money'];
// ----------------------------------
// STYLES
// ----------------------------------
// ----------------------------------
// COMPONENTS
// ----------------------------------
const App = () => {
  return (
    <SlateContent drops={0}>
      <SlateSelector pages={SLATES} idx={appIdx} onChange={setSubSlate} />
      <Switch>
        <Route exact path="/" render={() => <Redirect to={`/${SLATES[appIdx]}`} />} />
        <Route path="/music">
          <Music />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/money">
          <Money />
        </Route>
      </Switch>
    </SlateContent>
  );
};

export default App;
