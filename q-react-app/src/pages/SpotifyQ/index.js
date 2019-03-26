import React from 'react'
import { Page, BoldText, TextInput, SearchBar, Button, Text } from "../../components/styled-components";
import styled from 'styled-components'
import axios from 'axios'
import {LoadingSpinner} from "../../components/components";
import {CharButton, DateAdjuster} from "./components/components";
import {dateToEpoch, epochToDate, epochToString, ONE_EPOCH_DAY, stringToEpoch} from "../../utils";
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
  overflow: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
`;

const End = styled.div`
  overflow: auto;
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
      start: Math.round(new Date().getTime() / 1000) - 3 * ONE_EPOCH_DAY,
      end: Math.round(new Date().getTime() / 1000),
      subject: null,
      data: null,
      loading: false,
      selectedItem: this.displays[1]
    }
  }

  render() {
    return (
      <SpotifyQPage>
        <Controls>
          <Start>
            <BoldText>Start</BoldText>
            <DateInput id="start" onBlur={() => this.setTimeframeSide("start")} />
            <DateAdjuster side="start" amount="day" color={spotifyQTheme.tertiary} parent={this} />
            <DateAdjuster side="start" amount="week" color={spotifyQTheme.tertiary} parent={this} />
            <DateAdjuster side="start" amount="month" color={spotifyQTheme.tertiary} parent={this} />
            <DateAdjuster side="start" amount="year" color={spotifyQTheme.tertiary} parent={this} />
          </Start>
          <TextInput />
          <End>
            <DateAdjuster side="end" amount="year" color={spotifyQTheme.tertiary} parent={this} />
            <DateAdjuster side="end" amount="month" color={spotifyQTheme.tertiary} parent={this} />
            <DateAdjuster side="end" amount="week" color={spotifyQTheme.tertiary} parent={this} />
            <DateAdjuster side="end" amount="day" color={spotifyQTheme.tertiary} parent={this} />
            <DateInput id="end" onBlur={() => this.setTimeframeSide("end")} />
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
    } else {
      switch(this.state.selectedItem){
        case "Overview":
          return <Overview data={this.state.data} root={this.props.root}/>;
        case "Detail":
          return <Detail data={this.state.data} totalTimeMs={(this.state.end - this.state.start) * 1000}/>
      }
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

  setTimeframeSide(side, value) {
    if (value == null) {
      const input = document.getElementById(side).value;
      value = input.length === 0 ? null : stringToEpoch(input);
    }

    if (value != null && isNaN(value)) {
      NotificationManager.error('Must be mm/dd/yyyy', 'Bad Date Format')
    } else if (side === "start" && value != null && value >= this.state.end) {
      NotificationManager.error(`Must be before the End`, "Impossible Range");
    } else if (side === "end" && value != null && value <= this.state.start) {
      NotificationManager.error(`Must be after the Start`, "Impossible Range");
    } else if (value !== this.state[side]) {
      document.getElementById(side).value = epochToString(value);
      this.setState({
        [side]: value,
        data: null
      });
    }
  }

  adjustTimeframe(side, amount, vector){
    const date = epochToDate(this.state[side]);
    switch(amount){
      case "day":
        date.setDate(date.getDate() + vector);
        break;
      case "week":
        date.setDate(date.getDate() + 7 * vector);
        break;
      case "month":
        date.setMonth(date.getMonth() + vector);
        break;
      case "year":
        date.setFullYear(date.getFullYear() + vector);
        break;
    }
    this.setTimeframeSide(side, dateToEpoch(date))
  }
}

export default SpotifyQ