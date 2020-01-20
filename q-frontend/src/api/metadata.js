import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import React, { useState, useEffect } from 'react';
import SpotifyAPIErrorPage from '../components/spotify-error-page';

export const readSettings = (then) => {
  axios.get('/mongodb/metadata/settings')
    .then(res => then(res.data));
};

export const writeSettings = (settings) => {
  axios.put('/mongodb/metadata/settings', settings);
};
