/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { fetchDocuments, saveSettings } from './api/mongodb';

import SpotifyQ from './pages/SpotifyQ';
import AccountingQ from './pages/AccountingQ';
import DashboardQ from './pages/DashboardQ';
import ArraySelector from './sharedComponents/ArraySelector';
import LoadingSpinner from './sharedComponents/LoadingSpinner';

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

const App = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const newSettings = await fetchDocuments({ collection: 'metadata', _id: 'settings' });
      setSettings(newSettings);
    };

    fetchSettings();
  }, []);

  const saveIdx = (idx) => {
    settings.app.idx = idx;
    saveSettings(settings);
    setSettings(settings);
  };

  return (
    <AppContainer>
      <NotificationContainer />
      <AppHeader>
        {settings && (
          <ArraySelector
            array={['SpotifyQ', 'DashboardQ', 'AccountingQ']}
            idx={settings.app.idx}
            saveIdx={saveIdx}
          />
        )}
      </AppHeader>
      {settings != null
        ? [
          <SpotifyQ settings={settings} setSettings={setSettings} />,
          <DashboardQ />,
          <AccountingQ settings={settings} setSettings={setSettings} />,
        ][settings.app.idx]
        : <LoadingSpinner title="Loading..." message="Setting up app..." />}
    </AppContainer>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
