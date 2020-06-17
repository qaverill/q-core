import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import PageSelector from '../components/PageSelector';
import { useStore, actions } from '../store';
import { selectSettings } from '../store/selectors';
import SpotifyQ from './SpotifyQ';
import AccountingQ from './AccountingQ';
import DashboardQ from './DashboardQ';
// ----------------------------------
// HELPERS
// ----------------------------------
const PAGES = ['SpotifyQ', 'DashboardQ', 'AccountingQ'];
// ----------------------------------
// STYLES
// ----------------------------------
const AppContainer = styled.div`
  height: 100%;
`;
const AppHeader = styled.div`
  background-color: black;
  font-size: 20px;
  font-weight: bold;
  color: white;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  z-index: 100;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const App = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();
  const { appIdx } = selectSettings(state);
  useEffect(() => history.push(PAGES[appIdx]), [appIdx]);

  function setPage(pageIdx) {
    const { settings } = state;
    dispatch(actions.setSettings({ ...settings, appIdx: pageIdx }));
  }

  return (
    <AppContainer>
      <AppHeader>
        <PageSelector pages={PAGES} idx={appIdx} onChange={setPage} />
      </AppHeader>
      <Switch>
        <Route path="/SpotifyQ">
          <SpotifyQ />
        </Route>
        <Route path="/DashboardQ">
          <DashboardQ />
        </Route>
        <Route path="/AccountingQ">
          <AccountingQ />
        </Route>
      </Switch>
    </AppContainer>
  );
};

export default App;
