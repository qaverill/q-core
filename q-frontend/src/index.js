/* eslint-disable no-undef */
import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';
import { StoreContext, reducer, initialState, actions } from './store';
import 'react-notifications/lib/notifications.css';

import { fetchDocuments } from './api/mongodb';

import LoadingSpinner from './components/LoadingSpinner';
import Pages from './Pages';

const AppRouter = styled(Router)`
  height: 100%;
  width: 100%;
`;

const App = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState });
  const { settings } = state;
  useEffect(() => {
    const fetchSettings = async () => {
      const newSettings = await fetchDocuments({ collection: 'metadata', _id: 'settings' });
      dispatch(actions.setSettings(newSettings));
    };

    fetchSettings();
  }, []);

  return (
    <AppRouter>
      <NotificationContainer />
      <StoreContext.Provider value={{ state, dispatch }}>
        {settings
          ? <Pages />
          : <LoadingSpinner title="Loading..." message="Setting up app..." />}
      </StoreContext.Provider>
    </AppRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
