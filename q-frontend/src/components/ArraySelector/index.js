import React from 'react'
import styled from 'styled-components'
import {LeftArrow, RightArrow} from "../styled-components";

const q_settings = require('q-settings');

const ArraySelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 35px;
`;

class ArraySelector extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      index: this.props.parent.state.selectedIndex
    }
  }

  render() {
    return (
      <ArraySelectorContainer key={this.props.title}>
        <LeftArrow onClick={() => this.moveSelectorLeft()} />
        {this.props.title}
        <RightArrow onClick={() => this.moveSelectorRight()} />
      </ArraySelectorContainer>
    )
  }

  moveSelectorRight() {
    this.saveSelectedIndex(this.state.index + 1 > this.props.array.length - 1 ? 0 : this.state.index + 1)
  }

  moveSelectorLeft() {
    this.saveSelectedIndex(this.state.index - 1 < 0 ? this.props.array.length - 1 : this.state.index - 1)
  }

  saveSelectedIndex(selectedIndex) {
    this.setState({
      index: selectedIndex
    });
    this.props.parent.setState({
      selectedIndex: selectedIndex,
      error: null
    });
    if (this.props.settingsKey != null) {
      q_settings.set(this.props.settingsKey, selectedIndex)
    }
  }
}

export default ArraySelector