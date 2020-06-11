import * as R from 'ramda';
import { createSelector } from 'reselect';

export const selectSettings = state => {
  if (state == null) return null;
  return state.settings;
};

export const selectSpotifyQStore = state => {
  const { spotifyQStart, spotifyQEnd, spotifyQFilter, spotifyQData } = state;
  return { start: spotifyQStart, end: spotifyQEnd, filter: spotifyQFilter, data: spotifyQData };
};
