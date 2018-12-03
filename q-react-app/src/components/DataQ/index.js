import React from 'react'
import SpotifyHistory from './components/SpotifyHistory/index'
import { PageBorder, Page } from "../styled-components";
import styled from 'styled-components'
import theme from './theme.jpg'
import './dataQ.css'

const DataQBorder = styled(PageBorder)`
  background-image: url(${theme});
`;

class DataQ extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    const spotifyAuthToken = sessionStorage.getItem('spotify_access_token');
    return (
      <DataQBorder>
        <Page>
          {spotifyAuthToken != null && spotifyAuthToken.length > 0
            ? <SpotifyHistory/>
            : <h2>Missing Spotify Auth</h2>
          }
        </Page>
      </DataQBorder>
    )
  }
}

export default DataQ