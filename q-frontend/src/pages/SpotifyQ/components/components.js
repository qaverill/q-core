import styled from "styled-components";
import {Button, Text} from "../../../components/styled-components";
import React from "react";
const { capitolFirstLetter } = require('q-utils');

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

class AdjustButton extends React.PureComponent {
  render() {
    return (
      <SmallButton color={this.props.color} onClick={this.props.onClick}>
        <CenterText>{this.props.title}</CenterText>
      </SmallButton>
    )
  }
}

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

export class DateAdjuster extends React.PureComponent {
  render() {
    return [
      this.props.side === "start" ? <Line key="Line" /> : null,
      <DateAdjusterContainer key="DateAdjuster">
        <AdjustButton
          color={this.props.color}
          onClick={() => this.props.parent.adjustTimeframe(this.props.side, this.props.amount, -1)}
          title="-" />
        <Text color="black">{capitolFirstLetter(this.props.amount)}</Text>
        <AdjustButton
          color={this.props.color}
          onClick={() => this.props.parent.adjustTimeframe(this.props.side, this.props.amount, 1)}
          title="+" />
      </DateAdjusterContainer>,
      this.props.side === "end" ? <Line key="Line" /> : null,
    ]
  }
}