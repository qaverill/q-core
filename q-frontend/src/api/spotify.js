import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import React from 'react';
import SpotifyAPIErrorPage from '../components/spotify-error-page';

export const pushTracksOntoQPlaylist = ({ data, root }) => {
  const url = 'https://api.spotify.com/v1/playlists/6d2V7fQS4CV0XvZr1iOVXJ/tracks';
  const body = { position: 0, uris: data.map(d => `spotify:track:${d.track}`) };
  axios.post('/spotify', { url, body })
    .then(() => NotificationManager.success('Wrote saves to Q playlist'))
    .catch(() => root.setState({ error: <SpotifyAPIErrorPage /> }));
};

export const getTracks = () => {

};
