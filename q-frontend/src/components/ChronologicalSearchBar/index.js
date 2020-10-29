/* eslint-disable no-undef */
import * as React from 'react';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';

import DateAdjuster from './DateAdjuster';
import SearchBar from './SearchBar';
import { BoldText, TextInput, DROP_SIZE, GAP_SIZE } from '../../common/elements';
import { epochToString, epochToDate, stringToEpoch } from '../../common/time';
// ----------------------------------
// HELPERS
// ----------------------------------
const START = 'start';
const END = 'end';
const validateInputDate = (date, side) => {
  if (date != null && isNaN(date)) {
    NotificationManager.error('Must be mm/dd/yyyy', 'Bad Date Format');
    return false;
  } if (side === START && date != null && date > end) {
    NotificationManager.error('Must be before the End', 'Impossible Range');
    return false;
  } if (side === END && date != null && date < start) {
    NotificationManager.error('Must be after the Start', 'Impossible Range');
    return false;
  } if (side === END && date != null && date > new Date().getTime() / 1000) {
    NotificationManager.error('Must not be in the future', 'Impossible Range');
    return false;
  }
  return true;
};
const adjustDate = (timestamp, adjustment) => {
  const date = epochToDate(timestamp);
  const amount = adjustment.includes('-') ? -1 : 1;
  if (adjustment.includes('D')) return date.setDate(date.getDate() + amount) / 1000;
  if (adjustment.includes('W')) return date.setDate(date.getDate() + 7 * amount) / 1000;
  if (adjustment.includes('M')) return date.setMonth(date.getMonth() + amount) / 1000;
  if (adjustment.includes('Y')) return date.setFullYear(date.getFullYear() + amount) / 1000;
};
const setDateInput = (sideId, timestamp) => {
  document.getElementById(sideId).value = epochToString(timestamp);
};
// ----------------------------------
// STYLES
// ----------------------------------
const Controls = styled.div`
  height: ${DROP_SIZE - (2 * GAP_SIZE)}px;
  padding-bottom: ${GAP_SIZE}px;
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
// ----------------------------------
// COMPONENTS
// ----------------------------------
const ChronologicalSearchBar = ({
  start,
  end,
  setFilters,
  dateControls,
  colorTheme,
  fetchData,
}) => {
  const filters = { start, end, filter: null };
  React.useEffect(() => {
    setDateInput(START, start);
    setDateInput(END, end);
  }, [start, end]);

  function adjustStart(adjustment) {
    filters.start = adjustDate(start, adjustment);
    setFilters(filters);
  }

  function adjustEnd(adjustment) {
    filters.end = adjustDate(end, adjustment);
    setFilters(filters);
  }

  function setFilter(filter, type) {
    filters.filter = filter && `${type}=${filter}`;
    setFilters(filters);
  }

  function handleOnBlur(side) {
    return () => {
      const input = document.getElementById(side).value;
      const date = input.length === 0 ? null : stringToEpoch(input);
      if (!validateInputDate(date, side)) return;
      filters[side] = date;
      setFilters(filters);
    };
  }

  return (
    <Controls colorTheme={colorTheme}>
      <Start>
        <BoldText>Start</BoldText>
        <DateInput id="start" onBlur={handleOnBlur(START)} />
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
      <SearchBar setFilter={setFilter} fetchData={fetchData} />
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
        <DateInput id="end" onBlur={handleOnBlur(END)} />
        <BoldText>End</BoldText>
      </End>
    </Controls>
  );
};

export default ChronologicalSearchBar;
