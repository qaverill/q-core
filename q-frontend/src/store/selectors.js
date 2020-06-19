import * as R from 'ramda';
import { createSelector } from 'reselect';

export const selectSettings = state => {
  if (state == null) return null;
  return state.settings;
};

export const selectMusicStore = state => {
  const { musicStart, musicEnd, musicFilter, musicData } = state;
  return { start: musicStart, end: musicEnd, filter: musicFilter, data: musicData };
};
