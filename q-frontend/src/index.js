/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { fetchDocuments } from './api/mongodb';

import LoadingSpinner from './components/LoadingSpinner';
import Pages from './Pages';

const AppRouter = styled(Router)`
  height: 100%;
  width: 100%;
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

  return (
    <AppRouter>
      <NotificationContainer />
      {settings != null
        ? <Pages settings={settings} setSettings={setSettings} />
        : <LoadingSpinner title="Loading..." message="Setting up app..." />}
    </AppRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
