import React from 'react'
import SpotifyCollector from './components/SpotifyCollector'
import { PageBorder, Page } from "../styled-components";
import Select from '../../components/Select'
import styled from 'styled-components'
import theme from './theme.jpg'
import ErrorPage from "../ErrorPage";

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
      currentCollector: SpotifyListensCollector
    }
  }

  render() {
    if (sessionStorage.getItem('spotify_access_token').length === 0) {
      return <ErrorPage />
    }
    return (
      <DataQBorder>
        <Page>
          <Select onChange={(item) => this.getSelectedOption(item)} id="option" width="200px;"/>
          <SpotifyCollector collector={this.state.currentCollector}/>
        </Page>
      </DataQBorder>
    )
  }

  getSelectedOption(optionSelect){
    console.log('ahhh')
    switch (optionSelect) {
      case "Listens":
        this.setState({ currentCollector: SpotifyListensCollector });
        return;
      case "Saves":
        this.setState({ currentCollector: SpotifySavesCollector });
        return;
      default:
        this.setState({ currentCollector: null });
        return;
    }
  }
}

export default DataQ