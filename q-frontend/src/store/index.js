import { createContext, useContext } from 'react';
import { saveSettings } from '../api/mongodb';
import { ONE_EPOCH_DAY } from '../packages/utils';
// ----------------------------------
// HELPERS
// ----------------------------------
const SPOTIFYQ_START = Math.round(new Date().getTime() / 1000) - 3 * ONE_EPOCH_DAY;
const SPOTIFYQ_END = Math.round(new Date().getTime() / 1000);
const createAction = type => payload => ({ type, payload });
const persistSettingsAction = type => payload => {
  saveSettings(payload);
  return ({ type, payload });
};
// ----------------------------------
// ACTIONS
// ----------------------------------
export const actionTypes = {
  STORE_SETTINGS: 'STORE_SETTINGS',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_SPOTIFYQ_START: 'SET_SPOTIFYQ_START',
  SET_SPOTIFYQ_END: 'SET_SPOTIFYQ_END',
  SET_SPOTIFYQ_FILTER: 'SET_SPOTIFYQ_FILTER',
  SET_SPOTIFYQ_DATA: 'SET_SPOTIFYQ_DATA',
};
export const actions = {
  storeSettings: createAction(actionTypes.STORE_SETTINGS),
  setSettings: persistSettingsAction(actionTypes.SET_SETTINGS),
  setSpotifyQStart: createAction(actionTypes.SET_SPOTIFYQ_START),
  setSpotifyQEnd: createAction(actionTypes.SET_SPOTIFYQ_END),
  setSpotifyQFilter: createAction(actionTypes.SET_SPOTIFYQ_FILTER),
  setSpotifyQData: createAction(actionTypes.SET_SPOTIFYQ_DATA),
};
export function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.STORE_SETTINGS:
    case actionTypes.SET_SETTINGS:
      return { ...state, settings: payload };
    case actionTypes.SET_SPOTIFYQ_START:
      return { ...state, spotifyQStart: payload };
    case actionTypes.SET_SPOTIFYQ_END:
      return { ...state, spotifyQEnd: payload };
    case actionTypes.SET_SPOTIFYQ_FILTER:
      return { ...state, spotifyQFilter: payload };
    case actionTypes.SET_SPOTIFYQ_DATA:
      return { ...state, spotifyQData: payload };
    default:
      return state;
  }
}
// ----------------------------------
// STORE
// ----------------------------------
export const initialState = {
  spotifyQStart: SPOTIFYQ_START,
  spotifyQEnd: SPOTIFYQ_END,
};
export const StoreContext = createContext({
  state: {},
  dispatch: () => {},
});
export const useStore = () => useContext(StoreContext);
