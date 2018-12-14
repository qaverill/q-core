import React from 'react'
import SpotifyCollector from './components/SpotifyCollector'
import { PageBorder, Page, Button } from "../styled-components";
import styled from 'styled-components'
import theme from './theme.jpg'
import ErrorPage from '../ErrorPage'
import Select from 'react-select'

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

const SelectOptions = [
  { value: SpotifyListensCollector, label: 'Listens' },
  { value: SpotifySavesCollector, label: 'Saves'}
];

const SelectContainer = styled.div`
  width: 100px;
  margin: auto;
  padding: 10px 0;
`;

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
          <SelectContainer>
            <Select
              options={SelectOptions}
              onChange={(selectedOption) => {this.setState({currentCollector: selectedOption.value})}}
              value={this.getSelectedOption()} />
          </SelectContainer>
          <SpotifyCollector collector={this.state.currentCollector}/>
        </Page>
      </DataQBorder>
    )
  }

  getSelectedOption(){
    let selectedOption = null;
    SelectOptions.forEach(option => {
      if (option.value === this.state.currentCollector){
        selectedOption = option
      }
    });
    return selectedOption
  }
}

export default DataQ