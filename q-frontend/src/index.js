import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { NotificationContainer } from 'react-notifications';
import { StoreContext, reducer, initialState, actions } from './store';
import { selectSettings } from './store/selectors';
import WaitSpinner from './components/WaitSpinner';
import { readSettings } from './api/mongodb';
import App from './app';
import 'react-notifications/lib/notifications.css';
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// STYLES
// ----------------------------------
// ----------------------------------
// COMPONENTS
// ----------------------------------
const Root = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState });
  const settings = selectSettings(state);
  useEffect(() => {
    async function fetchSettings() {
      dispatch(actions.storeSettings(await readSettings()));
    }
    fetchSettings();
  }, []);

  return (
    <Router>
      <NotificationContainer />
      <StoreContext.Provider value={{ state, dispatch }}>
        {!settings && <WaitSpinner />}
        {settings && <App />}
      </StoreContext.Provider>
    </Router>
  );
};

// eslint-disable-next-line no-undef
ReactDOM.render(<Root />, document.getElementById('root'));
