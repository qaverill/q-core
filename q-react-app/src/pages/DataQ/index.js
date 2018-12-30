import React from 'react'
import SpotifyCollector from './components/SpotifyCollector'
import { PageBorder, Page } from "../../components/styled-components";
import MatterSelector from '../../components/MatterSelector/index'
import styled from 'styled-components'
import theme from './theme.jpg'
import { errorPage } from "../../components/components";

const DataQBorder = styled(PageBorder)`
  background-image: url(${theme});
`;

const SpotifyListensCollector = {
  name: "listens",
  spotifyPath: "/spotify/recently-played",
  mongodbPath: "/mongodb/listens",
  timeParam: "played_at"
};

const SpotifySavesCollector = {
  name: "saves",
  spotifyPath: "/spotify/saved-tracks",
  mongodbPath: "/mongodb/saves",
  timeParam: "added_at"
};

class DataQ extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedMatter: SpotifyListensCollector
    }
  }

  render() {
    if (sessionStorage.getItem('spotify_access_token').length === 0) {
      return errorPage("Not connected to the Spotify API")
    }
    return (
      <DataQBorder>
        <Page>
          <MatterSelector matter={[SpotifyListensCollector, SpotifySavesCollector]} parent={this} />
          <SpotifyCollector collector={this.state.selectedMatter}/>
        </Page>
      </DataQBorder>
    )
  }
}

export default DataQ