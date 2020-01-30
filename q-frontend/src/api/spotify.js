import axios from 'axios';
import { NotificationManager } from 'react-notifications';

export const pushTracksOntoQPlaylist = data => {
  const url = 'https://api.spotify.com/v1/playlists/6d2V7fQS4CV0XvZr1iOVXJ/tracks';
  const body = { position: 0, uris: data.map(d => `spotify:track:${d.track}`) };
  axios.post('/spotify', { url, body })
    .then(() => NotificationManager.success('Wrote saves to Q playlist'));
};

export const getCPT = async () => {
  const url = 'https://api.spotify.com/v1/me/player/currently-playing';
  return (await axios.get('/spotify', { params: { url } })).data;
};
