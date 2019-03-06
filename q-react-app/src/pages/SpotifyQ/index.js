import React from 'react'
import { PageBorder, Page, BoldText, TextInput, SearchBar } from "../../components/styled-components";
import styled from 'styled-components'
import axios from 'axios'
import {LoadingSpinner} from "../../components/components";
import {epochToString, ONE_EPOCH_DAY, stringToDate} from "../../utils";
import { NotificationManager} from 'react-notifications'
import { spotifyQTheme } from "../../colors";
import ArraySelector from "../../components/ArraySelector";
import Overview from "./components/Overview";
import Detail from './components/Detail';

const SpotifyQBorder = styled(PageBorder)`
  background-color: ${spotifyQTheme.primary};
`;

const DateInput = styled(TextInput)`
  width: 100px;
`;

const Controls = styled.div`
  margin: 2.5px;
  padding: 2.5px
  height: 35px;
  background-color: ${spotifyQTheme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Results = styled.div`
  height: calc(100% - 82.5px);
  display: flex;
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
    this.displays = [
      "Overview",
      "Detail"
    ];
    this.state = {
      start: Math.round(new Date().getTime() / 1000) - 5 * ONE_EPOCH_DAY,
      end: null,
      subject: null,
      data: null,
      loading: false,
      selectedItem: this.displays[0]
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
          <ArraySelector array={this.displays} parent={this} title={<h2>{this.state.selectedItem}</h2>} />
          <Results>
            {this.displayResults()}
          </Results>
        </Page>
      </SpotifyQBorder>
    )
  }

  componentDidMount() {
    document.getElementById('start').value = epochToString(this.state.start);
    this.explore()
  }

  componentDidUpdate() {
    if (this.state.data == null){
      this.explore()
    }
  }

  displayResults(){
    if (this.state.data == null) {
      return <LoadingSpinner message={`Loading results...`} color={spotifyQTheme.tertiary}/>
    } else if (this.state.selectedItem === "Overview") {
      return <Overview data={this.state.data} root={this.props.root}/>
    } else if (this.state.selectedItem === "Detail") {
      return <Detail data={this.state.data} />
    }
  }

  setStart(){
    const input = document.getElementById('start').value;
    const start = input.length === 0 ? null : stringToDate(input);
    if (start != null && isNaN(start)){
      NotificationManager.error('Must be mm/dd/yyyy', 'Bad Date Format')
    } else if (start !== this.state.start) {
      this.setState({
        start: start,
        data: null
      });
    }
  }

  setEnd(){
    const input = document.getElementById('end').value;
    const end = input.length === 0 ? null : stringToDate(input);
    if (end != null && isNaN(end)){
      NotificationManager.error('Must be mm/dd/yyyy', 'Bad Date Format')
    } else if (end !== this.state.end) {
      this.setState({
        end: end,
        data: null
      });
    }
  }

  explore(){
    const _this = this;
    console.log(this.state.start)
    axios.get(`/mongodb/listens?start=${this.state.start}&end=${this.state.end}`)
      .then(res => {
        _this.setState({
          data: res.data,
        })
      })
  }
}

export default SpotifyQ