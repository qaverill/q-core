import axios from 'axios';

export function addToLibraryArchives(URIS){
  return axios({
    url: 'https://api.spotify.com/v1/users/qaverill15/playlists/0XnMSkmCPctn9mWZMkTNI6/tracks',
    data: {'uris': URIS},
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token'),
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}