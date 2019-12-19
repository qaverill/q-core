/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';

import { BoldText, TextInput } from '@q/core';
import {
  stringToEpoch,
  epochToString,
  epochToDate,
  dateToEpoch,
} from '@q/utils';

import DateAdjuster from './components/DateAdjuster';

const Controls = styled.div`
  margin: 7.5px;
  padding: 2.5px 5px;
  height: 35px;
  border-radius: 15px;
  background-color: ${props => props.colorTheme.primary};
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
      date = input.length === 0 ? null : stringToEpoch(input);
    }
    if (date != null && isNaN(date)) {
      NotificationManager.error('Must be mm/dd/yyyy', 'Bad Date Format');
    } else if (side === 'start' && date != null && date > end) {
      NotificationManager.error('Must be before the End', 'Impossible Range');
    } else if (side === 'end' && date != null && date < start) {
      NotificationManager.error('Must be after the Start', 'Impossible Range');
    } else if (side === 'end' && date != null && date > new Date().getTime() / 1000) {
      NotificationManager.error('Must not be in the future', 'Impossible Range');
    } else if (date !== parent.state[side]) {
      document.getElementById(side).value = epochToString(date);
      parent.setState({
        [side]: date,
        data: null,
      });
    }
  }

  setFilter(input) {
    const { parent } = this.props;
    parent.setState({
      filter: input.substring(input.lastIndexOf(':') + 1),
    });
  }

  adjustTimeframe(side, amount, vector) {
    const { parent } = this.props;
    const date = epochToDate(parent.state[side]);
    switch (amount) {
      case 'D':
        date.setDate(date.getDate() + vector);
        break;
      case 'W':
        date.setDate(date.getDate() + 7 * vector);
        break;
      case 'M':
        date.setMonth(date.getMonth() + vector);
        break;
      case 'Y':
        date.setFullYear(date.getFullYear() + vector);
        break;
      default:
        break;
    }
    this.setTimeframeSide(side, dateToEpoch(date));
  }

  render() {
    const { colorTheme, dateControls } = this.props;
    return (
      <Controls colorTheme={colorTheme}>
        <Start>
          <BoldText>Start</BoldText>
          <DateInput id="start" onBlur={() => this.setTimeframeSide('start')} />
          {dateControls.map(control => <DateAdjuster side="start" amount={control} color={colorTheme.tertiary} parent={this} />)}
        </Start>
        <TextInput
          onBlur={evt => this.setFilter(evt.target.value)}
          onKeyDown={evt => evt.keyCode === 13 && this.setFilter(evt.target.value)}
          placeholder="Filter Data"
        />
        <End>
          {dateControls.map(control => <DateAdjuster side="end" amount={control} color={colorTheme.tertiary} parent={this} />).reverse()}
          <DateInput id="end" onBlur={() => this.setTimeframeSide('end')} />
          <BoldText>End</BoldText>
        </End>
      </Controls>
    );
  }
}

export default TimeFrame;
