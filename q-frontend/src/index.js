/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import SpotifyErrorPage from './components/spotify-error-page';

import { readSettings, writeSettings } from './api/metadata';
import { getTokenStatus } from './api/tokens';

import DataQ from './pages/DataQ';
import SpotifyQ from './pages/SpotifyQ';
import BassQ from './pages/BassQ';
import AccountingQ from './pages/AccountingQ';
import DashboardQ from './pages/DashboardQ';
import ArraySelector from './components/array-selector';
import LoadingSpinner from './components/loading-spinner';

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: black;
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

const Title = styled.h2`
  margin: 0 10px;
`;

const App = () => {
  const [settings, setSettings] = useState(null);
  const [app, setApp] = useState(<LoadingSpinner message="Setting up app..." />);

  const pages = () => [
    <DataQ title="DataQ" settings={settings} setSettings={setSettings} needsSpotifyToken />,
    <SpotifyQ title="SpotifyQ" root={this} needsSpotifyToken />,
    // <BassQ title="BassQ" />,
    <DashboardQ title="DashboardQ" needsSpotifyToken />,
    <AccountingQ title="AccountingQ" />,
  ];

  useEffect(() => {
    const processSettings = async () => {
      const response = await readSettings();
      setSettings(response);
      const page = pages()[response.app.idx];
      if (page.props.needsSpotifyToken) {
        const status = await getTokenStatus();
        setApp(status.valid ? page : <SpotifyErrorPage title="ERROR" />);
      } else {
        setApp(page);
      }
    };

    processSettings();
  }, []);

  const saveIdx = (idx) => {
    settings.app.idx = idx;
    writeSettings(settings);
    setApp(pages()[idx]);
  };

  return (
    <AppContainer>
      <NotificationContainer />
      <AppHeader>
        {settings && (
          <ArraySelector
            array={pages()}
            idx={settings.app.idx}
            title={<Title>{app.props.title}</Title>}
            saveIdx={saveIdx}
          />
        )}
      </AppHeader>
      {app}
    </AppContainer>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
