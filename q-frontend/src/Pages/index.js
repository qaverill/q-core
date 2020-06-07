import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';
import { actions, useStore } from '../store';
import 'react-notifications/lib/notifications.css';
import { saveSettings } from '../api/mongodb';
import SpotifyQ from './SpotifyQ';
import AccountingQ from './AccountingQ';
import DashboardQ from './DashboardQ';
import PageSelector from '../components/PageSelector';

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
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

const Pages = () => {
  const { state, dispatch } = useStore();
  const { settings } = state;
  const history = useHistory();
  const pages = ['SpotifyQ', 'DashboardQ', 'AccountingQ'];
  useEffect(() => history.push(pages[settings.app.idx]), []);

  function saveIdx(idx) {
    settings.app.idx = idx;
    saveSettings(settings);
    dispatch(actions.setSettings(settings));
  }

  return (
    <AppContainer>
      <NotificationContainer />
      <AppHeader>
        <PageSelector pages={pages} idx={settings.app.idx} onChange={saveIdx} />
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

export default Pages;
