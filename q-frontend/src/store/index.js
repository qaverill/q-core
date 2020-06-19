import { createContext, useContext } from 'react';
import { saveSettings } from '../api/mongodb';
import { ONE_EPOCH_DAY } from '../packages/utils';
// ----------------------------------
// HELPERS
// ----------------------------------
const MUSIC_START = Math.round(new Date().getTime() / 1000) - 3 * ONE_EPOCH_DAY;
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
  SET_MUSIC_START: 'SET_MUSIC_START',
  SET_MUSIC_END: 'SET_MUSIC_END',
  SET_MUSIC_FILTER: 'SET_MUSIC_FILTER',
  SET_MUSIC_DATA: 'SET_MUSIC_DATA',
};
export const actions = {
  storeSettings: createAction(actionTypes.STORE_SETTINGS),
  setSettings: persistSettingsAction(actionTypes.SET_SETTINGS),
  setMusicStart: createAction(actionTypes.SET_MUSIC_START),
  setMusicEnd: createAction(actionTypes.SET_MUSIC_END),
  setMusicFilter: createAction(actionTypes.SET_MUSIC_FILTER),
  setMusicData: createAction(actionTypes.SET_MUSIC_DATA),
};
export function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.STORE_SETTINGS:
    case actionTypes.SET_SETTINGS:
      return { ...state, settings: payload };
    case actionTypes.SET_MUSIC_START:
      return { ...state, musicStart: payload };
    case actionTypes.SET_MUSIC_END:
      return { ...state, musicEnd: payload };
    case actionTypes.SET_MUSIC_FILTER:
      return { ...state, musicFilter: payload };
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
  musicData: [],
  musicStart: MUSIC_START,
  musicEnd: MUSIC_END,
};
export const StoreContext = createContext({
  state: {},
  dispatch: () => {},
});
export const useStore = () => useContext(StoreContext);
