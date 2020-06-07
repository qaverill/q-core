import { createContext, useContext } from 'react';
import { createAction } from '../packages/utils';
import * as selectors from './selectors';

export { selectors };

export const actionTypes = {
  SET_SETTINGS: 'SET_SETTINGS',
};

export const actions = {
  setSettings: createAction(actionTypes.SET_SETTINGS),
};

export const initialState = {};

export function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_SETTINGS: {
      return { ...state, settings: payload };
    }
    default:
      return state;
  }
}

export const StoreContext = createContext({
  state: {},
  dispatch: () => {},
});

export const useStore = () => useContext(StoreContext);
