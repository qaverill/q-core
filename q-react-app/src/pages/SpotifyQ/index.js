import React from 'react'
import { Page, BoldText, TextInput, SearchBar, Button } from "../../components/styled-components";
import styled from 'styled-components'
import axios from 'axios'
import {LoadingSpinner} from "../../components/components";
import {epochToString, ONE_EPOCH_DAY, stringToDate} from "../../utils";
import { NotificationManager} from 'react-notifications'
import { spotifyQTheme } from "../../colors";
import ArraySelector from "../../components/ArraySelector";
import Overview from "./components/Overview";
import Detail from './components/Detail';

const SpotifyQPage = styled(Page)`
  border: 5px solid ${spotifyQTheme.primary};
`;

const Controls = styled.div`
  margin: 7.5px;
  padding: 2.5px 5px;
  height: 35px;
  border-radius: 15px;
  background-color: ${spotifyQTheme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateInput = styled(TextInput)`
  width: 105px;
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

const Results = styled.div`
  height: calc(100% - 105px);
  display: flex;
  margin: 7.5px;
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
      end: Math.round(new Date().getTime() / 1000),
      subject: null,
      data: null,
      loading: false,
      selectedItem: this.displays[0]
    }
  }

  render() {
    return (
      <SpotifyQPage>
        <Controls>
          <Start>
            <BoldText>Start</BoldText>
            <DateInput id="start" onBlur={() => this.setStart()} />
            <Button color={spotifyQTheme.tertiary} onClick={() => this.removeFromStart(ONE_EPOCH_DAY)}>Back 1 Day</Button>
            <Button color={spotifyQTheme.tertiary} onClick={() => this.removeFromStart(ONE_EPOCH_DAY) * 7}>Back 1 Week</Button>
            <Button color={spotifyQTheme.tertiary} onClick={() => this.removeFromStart("month")}>Back 1 Month</Button>
            <Button color={spotifyQTheme.tertiary} onClick={() => this.removeFromStart("year")}>Back 1 Year</Button>

          </Start>
          <TextInput />
          <End>
            <Button color={spotifyQTheme.secondary} onClick={() => this.removeFromEnd("year")}>Back 1 Year</Button>
            <Button color={spotifyQTheme.secondary} onClick={() => this.removeFromEnd("month")}>Back 1 Month</Button>
            <Button color={spotifyQTheme.secondary} onClick={() => this.removeFromEnd(ONE_EPOCH_DAY * 7)}>Back 1 Week</Button>
            <Button color={spotifyQTheme.secondary} onClick={() => this.removeFromEnd(ONE_EPOCH_DAY)}>Back 1 Day</Button>
            <DateInput id="end" onBlur={() => this.setEnd()} />
            <BoldText>End</BoldText>
          </End>
        </Controls>
        <ArraySelector array={this.displays} parent={this} title={<h2>{this.state.selectedItem}</h2>} />
        <Results>
          {this.displayResults()}
        </Results>
      </SpotifyQPage>
    )
  }

  componentDidMount() {
    document.getElementById('start').value = epochToString(this.state.start);
    document.getElementById('end').value = epochToString(this.state.end);
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
    } else if(start != null && start === this.state.end){
      NotificationManager.error("Cannot be the same date as End")
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
    } else if(end != null && end === this.state.start){
      NotificationManager.error("Cannot be the same date as Start")
    } else if (end !== this.state.end) {
      this.setState({
        end: end,
        data: null
      });
    }
  }

  explore(){
    const _this = this;
    axios.get(`/mongodb/listens?start=${this.state.start}&end=${this.state.end}`)
      .then(res => {
        _this.setState({
          data: res.data,
        })
      })
  }

  removeFromStart(amount){
    let newStart = null;
    if (amount === "month"){
      let adjustedDate = new Date(this.state.start * 1000);
      adjustedDate.setMonth(adjustedDate.getMonth() - 1);
      newStart = Math.round(adjustedDate.getTime() / 1000)
    } else if (amount === "year"){
      let adjustedDate = new Date(this.state.start * 1000);
      adjustedDate.setFullYear(adjustedDate.getFullYear() - 1);
      newStart = Math.round(adjustedDate.getTime() / 1000)
    } else {
      newStart = this.state.start - amount
    }
    document.getElementById('start').value = epochToString(newStart);
    this.setState({
      start: newStart, 
      data: null
    })
  }

  removeFromEnd(amount){
    let newEnd = null;
    if (amount === "month"){
      let adjustedDate = new Date(this.state.end * 1000);
      adjustedDate.setMonth(adjustedDate.getMonth() - 1);
      newEnd = Math.round(adjustedDate.getTime() / 1000)
    } else if (amount === "year"){
      let adjustedDate = new Date(this.state.end * 1000);
      adjustedDate.setFullYear(adjustedDate.getFullYear() - 1);
      newEnd = Math.round(adjustedDate.getTime() / 1000)
    } else {
      newEnd = this.state.end - amount
    }
    document.getElementById('end').value = epochToString(newEnd);
    this.setState({
      end: newEnd,
      data: null
    })
  }
}

export default SpotifyQ