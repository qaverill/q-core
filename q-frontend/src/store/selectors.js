import * as R from 'ramda';
import { createSelector } from 'reselect';

export const selectSettings = state => {
  if (state == null) return null;
  return state.settings;
};

export const selectMusicStore = state => {
  const { musicFilters, musicData } = state;
  const { start, end, filter } = musicFilters;
  return { start, end, filter, data: musicData };
};
