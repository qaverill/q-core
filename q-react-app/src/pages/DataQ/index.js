import React from 'react'
import SpotifyCollector from './components/SpotifyCollector'
import { PageBorder, Page } from "../../components/styled-components";
import styled from 'styled-components'
import { errorPage } from "../../components/components";
import { purple, green } from "../../colors";

const DataQBorder = styled(PageBorder)`
  background-color: ${props => props.color}
`;

const Collectors = [
  {
    name: "listens",
    spotifyPath: "/spotify/recently-played",
    mongodbPath: "/mongodb/listens",
    timeParam: "played_at",
    color: purple
  },
  {
    name: "saves",
    spotifyPath: "/spotify/saved-tracks",
    mongodbPath: "/mongodb/saves",
    timeParam: "added_at",
    color: green
  }
];

class DataQ extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      collectorIndex: 0
    }
  }

  render() {
    if (sessionStorage.getItem('spotify_access_token').length === 0) {
      return errorPage("Not connected to the Spotify API")
    }
    return (
      <DataQBorder color={Collectors[this.state.collectorIndex].color}>
        <Page>
          <SpotifyCollector collector={Collectors[this.state.collectorIndex]} parent={this} />
        </Page>
      </DataQBorder>
    )
  }

  increaseCollectorIndex() {
    const increasedIndex = this.state.collectorIndex + 1;
    this.setState({
      collectorIndex: (increasedIndex > Collectors.length - 1 ? 0 : increasedIndex)
    })
  }

  decreaseCollectorIndex() {
    const decreasedIndex = this.state.collectorIndex - 1;
    this.setState({
      collectorIndex: (decreasedIndex < 0 ? Collectors.length - 1 : decreasedIndex)
    })
  }
}

export default DataQ