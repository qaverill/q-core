import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import React, { useState, useEffect } from 'react';
import SpotifyAPIErrorPage from '../components/spotify-error-page';

export const getLights = then => (
  axios.get('/lifx', { params: { url: 'https://api.lifx.com/v1/lights/all' } })
    .then(res => then(res.data))
);

export const toggleLightPower = (label, then) => (
  axios.post('/lifx', { url: `https://api.lifx.com/v1/lights/label:${label}/toggle` })
    .then(res => then(res.data.results))
);

export const ya = 1;
