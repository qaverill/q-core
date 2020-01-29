import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import React, { useState, useEffect } from 'react';
import SpotifyAPIErrorPage from '../components/spotify-error-page';

export const pushTracksOntoQPlaylist = data => {
  const url = 'https://api.spotify.com/v1/playlists/6d2V7fQS4CV0XvZr1iOVXJ/tracks';
  const body = { position: 0, uris: data.map(d => `spotify:track:${d.track}`) };
  axios.post('/spotify', { url, body })
    .then(() => NotificationManager.success('Wrote saves to Q playlist'));
};

export const getCurrentlyPlayingTrack = then => {
  const url = 'https://api.spotify.com/v1/me/player/currently-playing';
  axios.get('/spotify', { params: { url } })
    .then((res) => then(res.data));
};
