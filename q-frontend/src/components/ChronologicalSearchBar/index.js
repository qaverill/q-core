/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';

import DateAdjuster from './DateAdjuster';
import SearchBar from './SearchBar';
import { BoldText, TextInput } from '../../packages/core';
import { epochToString, epochToDate } from '../../packages/utils';

import { searchSpotify } from '../../api/spotify';

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

const ChronologicalSearchBar = ({
  start,
  end,
  setStart,
  setEnd,
  setFilter,
  dateControls,
  colorTheme,
}) => {
  useEffect(() => {
    document.getElementById('start').value = epochToString(start);
    document.getElementById('end').value = epochToString(end);
  }, [start, end]);

  const validateInputDate = date => {
    if (date != null && isNaN(date)) {
      NotificationManager.error('Must be mm/dd/yyyy', 'Bad Date Format');
      return false;
    } if (side === 'start' && date != null && date > end) {
      NotificationManager.error('Must be before the End', 'Impossible Range');
      return false;
    } if (side === 'end' && date != null && date < start) {
      NotificationManager.error('Must be after the Start', 'Impossible Range');
      return false;
    } if (side === 'end' && date != null && date > new Date().getTime() / 1000) {
      NotificationManager.error('Must not be in the future', 'Impossible Range');
      return false;
    }
    return true;
  };

  const inputStart = () => {
    const input = document.getElementById('start');
    const date = input.length === 0 ? null : stringToEpoch(input);
    if (validateInputDate(date) && date !== start) setStart(date);
  };

  const inputEnd = () => {
    const input = document.getElementById('end');
    const date = input.length === 0 ? null : stringToEpoch(input);
    if (validateInputDate(date)) setEnd(date);
  };

  const adjustDate = (date, adjustment) => {
    const amount = adjustment.includes('-') ? -1 : 1;
    if (adjustment.includes('D')) return date.setDate(date.getDate() + amount) / 1000;
    if (adjustment.includes('W')) return date.setDate(date.getDate() + 7 * amount) / 1000;
    if (adjustment.includes('M')) return date.setMonth(date.getMonth() + amount) / 1000;
    if (adjustment.includes('Y')) return date.setFullYear(date.getFullYear() + amount) / 1000;
  };

  const adjustStart = (adjustment) => {
    const originalStart = epochToDate(start);
    setStart(adjustDate(originalStart, adjustment));
  };

  const adjustEnd = (adjustment) => {
    const originalEnd = epochToDate(end);
    setEnd(adjustDate(originalEnd, adjustment));
  };

  return (
    <Controls colorTheme={colorTheme}>
      <Start>
        <BoldText>Start</BoldText>
        <DateInput id="start" onBlur={inputStart} />
        {dateControls.flatMap(control => (
          <DateAdjuster
            date="start"
            amount={control}
            color={colorTheme.tertiary}
            adjustDate={adjustStart}
            key={`${control}-start`}
          />
        ))}
      </Start>
      <SearchBar setFilter={setFilter} search={searchSpotify} />
      <End>
        {dateControls.map(control => (
          <DateAdjuster
            date="end"
            amount={control}
            color={colorTheme.tertiary}
            adjustDate={adjustEnd}
            key={`${control}-end`}
          />
        )).reverse()}
        <DateInput id="end" onBlur={inputEnd} />
        <BoldText>End</BoldText>
      </End>
    </Controls>
  );
};

export default ChronologicalSearchBar;
