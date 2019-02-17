import React from 'react'
import { PageBorder, Page, BoldText, TextInput, SearchBar, Button } from "../../components/styled-components";
import styled from 'styled-components'
import axios from 'axios'
import ExploreAll from './components/ExploreAll'
import { loadingSpinner } from "../../components/components";
import {epochToString, stringToDate} from "../../utils";
import { NotificationManager } from 'react-notifications'
import { errorPage } from "../../components/components";
import {green} from "../../colors";

const SpotifyQBorder = styled(PageBorder)`
  background-color: ${green};
`;

const DateInput = styled(TextInput)`
  width: 100px;
`;

const ExploreButton = styled.div`
  width: 100%;
  margin: 2.5px
  display: flex;
  justify-content: center;
`;

const Results = styled.div`
  height: calc(100% - 35px);
  margin: 2.5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  margin: 2.5px;
  padding: 2.5px
  height: 35px;
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
    return (
      <SpotifyQBorder>
        <Page>
          <Controls>
            <Start>
              <BoldText>Start</BoldText>
              <DateInput id="start" onBlur={() => this.setStart()} />
            </Start>
            <SearchBar/>
            <End>
              <DateInput id="end" onBlur={() => this.setEnd()} />
              <BoldText>End</BoldText>
            </End>
          </Controls>
          <ExploreButton>
            <Button color={green} onClick={() => this.explore()}>
              Explore {this.state.subject}
              from {this.state.start == null ? 'start ' : epochToString(this.state.start) + " "}
              to {this.state.end == null ? 'end ' : epochToString(this.state.end) + " "}
            </Button>
          </ExploreButton>
          <Results>
            {this.state.results}
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