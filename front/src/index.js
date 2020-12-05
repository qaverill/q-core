import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { NotificationContainer } from 'react-notifications';
import { StoreContext, reducer, initialState, actions } from './store';
import { SlateContent } from './common/elements';
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
  return (
    <Router>
      <NotificationContainer />
      <StoreContext.Provider value={{ state, dispatch }}>
        <SlateContent drops={0}>
          
        </SlateContent>
      </StoreContext.Provider>
    </Router>
  );
};

// eslint-disable-next-line no-undef
ReactDOM.render(<Root />, document.getElementById('root'));
