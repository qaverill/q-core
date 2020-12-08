import { createContext, useContext } from 'react';
import { writeSettings } from '../api/mongodb';
import { ONE_EPOCH_DAY, times } from '../common/time';
// ----------------------------------
// HELPERS
// ----------------------------------
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const MUSIC_START = Math.round(startOfDay.getTime() / 1000) - 2 * ONE_EPOCH_DAY;
const MUSIC_END = Math.round(new Date().getTime() / 1000);
const MONEY_START = 1558061295; // times.firstOfCurrentMonth();
const MONEY_END = times.now();
const createAction = type => payload => ({ type, payload });
const persistSettingsAction = type => payload => {
  writeSettings(payload);
  return ({ type, payload });
};
// ----------------------------------
// ACTIONS
// ----------------------------------
export const actionTypes = {
  STORE_SETTINGS: 'STORE_SETTINGS',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_MUSIC_FILTERS: 'SET_MUSIC_FILTERS',
  SET_MONEY_FILTERS: 'SET_MONEY_FILTERS',
};
export const actions = {
  storeSettings: createAction(actionTypes.STORE_SETTINGS),
  setSettings: persistSettingsAction(actionTypes.SET_SETTINGS),
  setMusicFilters: createAction(actionTypes.SET_MUSIC_FILTERS),
  setMoneyFilters: createAction(actionTypes.SET_MONEY_FILTERS),
};
export function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.STORE_SETTINGS:
    case actionTypes.SET_SETTINGS:
      return { ...state, settings: payload };
    case actionTypes.SET_MUSIC_FILTERS:
      return { ...state, musicFilters: payload };
    case actionTypes.SET_MONEY_FILTERS:
      return { ...state, moneyFilters: payload };
    default:
      return state;
  }
}
// ----------------------------------
// STORE
// ----------------------------------
export const initialState = {
  musicFilters: {
    start: MUSIC_START,
    end: MUSIC_END,
    filter: null,
  },
  moneyFilters: {
    start: MONEY_START,
    end: MONEY_END,
    filter: null,
  },
};
export const StoreContext = createContext({
  state: {},
  dispatch: () => {},
});
export const useStore = () => useContext(StoreContext);
