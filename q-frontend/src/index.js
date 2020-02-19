/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { fetchDocuments, writeDocument } from './api/mongodb';

import SpotifyQ from './pages/SpotifyQ';
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

  const pages = (idx) => [
    <SpotifyQ title="SpotifyQ" root={this} settings={settings} />,
    <DashboardQ title="DashboardQ" />,
    <AccountingQ title="AccountingQ" settings={settings} />,
  ][idx];

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetchDocuments({ collection: 'metadata', _id: 'settings' });
      setSettings(response);
      setApp(pages(response.app.idx));
    };

    fetchSettings();
  }, []);

  const saveIdx = (idx) => {
    settings.app.idx = idx;
    writeDocument({ collection: 'metadata', _id: 'settings', document: settings });
    setApp(pages(idx));
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
