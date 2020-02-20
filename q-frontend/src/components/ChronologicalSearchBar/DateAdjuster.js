import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Button, Text } from '@q/core';

const SmallButton = styled(Button)`
  height: 20px;
  width: 20px;
  padding: 0px;
`;

const CenterText = styled.h2`
  margin: -2.5px;
  padding: 0;
  font-size: 16px;
  height: 20px;
  width: 20px;
`;

const DateAdjusterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  border-radius: 15px;
  background-color: white;
`;

const Line = styled.div`
  height: 2px;
  width: 10px;
  background-color: black;
  margin: 0 -2.5px;
`;

// TODO: make this a new design
const AdjustButton = props => {
  const { color, onClick, title } = props;
  return (
    <SmallButton color={color} onClick={onClick}>
      <CenterText>{title}</CenterText>
    </SmallButton>
  );
};

const DateAdjuster = ({ date, amount, color, adjustDate }) => {
  const subtractTime = () => adjustDate(`-${amount}`);
  const addTime = () => adjustDate(amount);

  return [
    date === 'start' ? <Line key="Line" /> : null,
    <DateAdjusterContainer key="DateAdjuster">
      <AdjustButton color={color} onClick={subtractTime} title="-" />
      <Text color="black">{amount}</Text>
      <AdjustButton color={color} onClick={addTime} title="+" />
    </DateAdjusterContainer>,
    date === 'end' ? <Line key="Line" /> : null,
  ];
};

export default DateAdjuster;
