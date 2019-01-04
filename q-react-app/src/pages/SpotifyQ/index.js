import React from 'react'
import { PageBorder, Page } from "../../components/styled-components";
import styled from 'styled-components'
import { errorPage } from "../../components/components";

const SpotifyQBorder = styled(PageBorder)`
  background-color: ${props => props.color}
`;

class SpotifyQ extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    if (sessionStorage.getItem('spotify_access_token').length === 0) {
      return errorPage("Not connected to the Spotify API")
    }
    return (
      <h1>Spotify Q</h1>
    )
  }
}

export default SpotifyQ