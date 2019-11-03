/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';
import DateAdjuster from './components/DateAdjuster';
import { BoldText, TextInput } from '../styled-components';

const q_utils = require('q-utils');
const { spotifyQTheme } = require('q-colors');

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

class TimeFrame extends React.Component {
  setTimeframeSide(side, value) {
    const { parent } = this.props;
    const { end, start } = parent.state;
    let date = value;
    if (date == null) {
      const input = document.getElementById(side).value;
      date = input.length === 0 ? null : q_utils.stringToEpoch(input);
    }
    if (date != null && isNaN(date)) {
      NotificationManager.error('Must be mm/dd/yyyy', 'Bad Date Format');
    } else if (side === 'start' && date != null && date >= end) {
      NotificationManager.error('Must be before the End', 'Impossible Range');
    } else if (side === 'end' && date != null && date <= start) {
      NotificationManager.error('Must be after the Start', 'Impossible Range');
    } else if (date !== parent.state[side]) {
      document.getElementById(side).value = q_utils.epochToString(date);
      parent.setState({
        [side]: date,
        data: null,
      });
    }
  }

  adjustTimeframe(side, amount, vector) {
    const { parent } = this.props;
    const date = q_utils.epochToDate(parent.state[side]);
    switch (amount) {
      case 'd':
        date.setDate(date.getDate() + vector);
        break;
      case 'w':
        date.setDate(date.getDate() + 7 * vector);
        break;
      case 'm':
        date.setMonth(date.getMonth() + vector);
        break;
      case 'y':
        date.setFullYear(date.getFullYear() + vector);
        break;
      default:
        break;
    }
    this.setTimeframeSide(side, q_utils.dateToEpoch(date));
  }

  render() {
    const { color } = this.props;
    return (
      <Controls>
        <Start>
          <BoldText>Start</BoldText>
          <DateInput id="start" onBlur={() => this.setTimeframeSide('start')} />
          <DateAdjuster side="start" amount="d" color={color} parent={this} />
          <DateAdjuster side="start" amount="w" color={color} parent={this} />
          <DateAdjuster side="start" amount="m" color={color} parent={this} />
          <DateAdjuster side="start" amount="y" color={color} parent={this} />
        </Start>
        <TextInput />
        <End>
          <DateAdjuster side="end" amount="y" color={color} parent={this} />
          <DateAdjuster side="end" amount="m" color={color} parent={this} />
          <DateAdjuster side="end" amount="w" color={color} parent={this} />
          <DateAdjuster side="end" amount="d" color={color} parent={this} />
          <DateInput id="end" onBlur={() => this.setTimeframeSide('end')} />
          <BoldText>End</BoldText>
        </End>
      </Controls>
    );
  }
}

export default TimeFrame;
