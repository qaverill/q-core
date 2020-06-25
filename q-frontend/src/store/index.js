import { createContext, useContext } from 'react';
import { saveSettings } from '../api/mongodb';
import { ONE_EPOCH_DAY } from '../packages/utils';
// ----------------------------------
// HELPERS
// ----------------------------------
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const MUSIC_START = Math.round(startOfDay.getTime() / 1000) - 3 * ONE_EPOCH_DAY;
const MUSIC_END = Math.round(new Date().getTime() / 1000);
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
  SET_MUSIC_FILTERS: 'SET_MUSIC_FILTERS',
  SET_MUSIC_DATA: 'SET_MUSIC_DATA',
};
export const actions = {
  storeSettings: createAction(actionTypes.STORE_SETTINGS),
  setSettings: persistSettingsAction(actionTypes.SET_SETTINGS),
  setMusicFilters: createAction(actionTypes.SET_MUSIC_FILTERS),
  setMusicData: createAction(actionTypes.SET_MUSIC_DATA),
};
export function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.STORE_SETTINGS:
    case actionTypes.SET_SETTINGS:
      return { ...state, settings: payload };
    case actionTypes.SET_MUSIC_FILTERS:
      return { ...state, musicFilters: payload };
    case actionTypes.SET_MUSIC_DATA:
      return { ...state, musicData: payload };
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
  musicData: [],
};
export const StoreContext = createContext({
  state: {},
  dispatch: () => {},
});
export const useStore = () => useContext(StoreContext);
