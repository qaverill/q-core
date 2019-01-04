import React from 'react'
import { PageBorder, Page, BoldText, TextInput, SearchBar, Button } from "../../components/styled-components";
import styled from 'styled-components'
import axios from 'axios'
import ExploreAll from './components/ExploreAll'
import { loadingSpinner } from "../../components/components";
import { stringToDate } from "../../utils";
import { NotificationManager } from 'react-notifications'
import { errorPage } from "../../components/components";
import {green} from "../../colors";

const SpotifyQBorder = styled(PageBorder)`
  background-color: ${green};
`;

const DateInput = styled(TextInput)`
  width: 100px;
`;

const Results = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  margin: 2.5px;
  padding: 2.5px
  background-color: ${green};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Start = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;
`;

const End = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

class SpotifyQ extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      start: null,
      end: null,
      subject: null,
      results: null
    }
  }

  render() {
    if (sessionStorage.getItem('spotify_access_token').length === 0) {
      return errorPage("Not connected to the Spotify API")
    }
    return (
      <SpotifyQBorder>
        <Page>
          <Controls>
            <Start>
              <BoldText>Start</BoldText>
              <DateInput id="start" value={this.state.start} onBlur={() => this.setStart()} />
            </Start>
            <SearchBar/>
            <End>
              <DateInput id="end" value={this.state.end} onBlur={() => this.setEnd()} />
              <BoldText>End</BoldText>
            </End>
          </Controls>
          <Results>
            {this.state.results}
            <Button onClick={() => this.explore()}>Explore</Button>
          </Results>
        </Page>
      </SpotifyQBorder>
    )
  }

  setStart(){
    const input = document.getElementById('start').value;
    if (input.length === 0){
      this.setState({ start: null });
    } else if (isNaN(stringToDate(input))){
      NotificationManager.error('Must be mm/dd/yyyy', 'Bad Date Format')
    } else {
      this.setState({ start: stringToDate(input) })
    }
  }

  setEnd(){
    const input = document.getElementById('end').value;
    if (input.length === 0){
      this.setState({ start: null });
    } else if (isNaN(stringToDate(input))){
      NotificationManager.error('Must be mm/dd/yyyy', 'Bad Date Format')
    } else {
      this.setState({ end: stringToDate(input) })
    }
  }

  explore(){
    const _this = this;
    this.setState({ results: loadingSpinner(`Loading results...`, green)});
    axios.get(`/mongodb/listens?start=${this.state.start}&end=${this.state.end}`)
      .then(res => {
        _this.setState({ results: <ExploreAll data={res.data} /> })
      })
  }
}

export default SpotifyQ