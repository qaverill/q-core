import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';
import { StoreContext, reducer, initialState, actions } from './store';
import { selectSettings } from './store/selectors';
import { fetchDocuments } from './api/mongodb';
import LoadingSpinner from './components/LoadingSpinner';
import App from './app';
import 'react-notifications/lib/notifications.css';
// ----------------------------------
// HELPERS
// ----------------------------------
const collection = 'metadata';
const _id = 'settings';
// ----------------------------------
// STYLES
// ----------------------------------
const AppRouter = styled(Router)`
  height: 100%;
  width: 100%;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const Root = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState });
  const settings = selectSettings(state);
  useEffect(() => {
    async function fetchSettings() {
      dispatch(actions.storeSettings(await fetchDocuments({ collection, _id })));
    }
    fetchSettings();
  }, []);

  return (
    <AppRouter>
      <NotificationContainer />
      <StoreContext.Provider value={{ state, dispatch }}>
        {!settings
          ? <LoadingSpinner title="Loading..." message="Setting up app..." />
          : <App /> }
      </StoreContext.Provider>
    </AppRouter>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
