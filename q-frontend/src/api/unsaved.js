import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import React, { useState, useEffect } from 'react';
import SpotifyAPIErrorPage from '../components/spotify-error-page';

export const getUnsavedListens = ({ _this, root }, then) => {
  axios.get('/unsaved/listens').then(saves => {
    then(saves, _this);
  }).catch(error => {
    if (error.response.status === 401) root.setState({ error: <SpotifyAPIErrorPage /> });
  });
};

export const getUnsavedSaves = ({ _this, root }, then) => {
  axios.get('/unsaved/saves').then(saves => {
    then(saves, _this);
  }).catch(error => {
    if (error.response.status === 401) root.setState({ error: <SpotifyAPIErrorPage /> });
  });
};