/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BoldText, TextInput } from '@q/core';
import { epochToString } from '@q/utils';
import DateAdjuster from './DateAdjuster';
import SearchBar from '../search-bar';

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
  filter,
  setStart,
  setEnd,
  setFilter,
  dateControls,
  colorTheme,
}) => {
  useEffect(() => {
    document.getElementById('start').value = epochToString(start);
    document.getElementById('end').value = epochToString(end);
  }, [null]);

  return (
    <Controls colorTheme={colorTheme}>
      <Start>
        <BoldText>Start</BoldText>
        <DateInput id="start" onBlur={() => this.setTimeframeSide('start')} />
        {dateControls.map(control => <DateAdjuster side="start" amount={control} color={colorTheme.tertiary} parent={this} />)}
      </Start>
      <SearchBar parent={parent} />
      <End>
        {dateControls.map(control => <DateAdjuster side="end" amount={control} color={colorTheme.tertiary} parent={this} />).reverse()}
        <DateInput id="end" onBlur={() => this.setTimeframeSide('end')} />
        <BoldText>End</BoldText>
      </End>
    </Controls>
  );
};

export default ChronologicalSearchBar;
