import React from 'react';
import styled from 'styled-components';
import { q_styledComponents, q_settings } from 'q-lib';

const { LeftArrow, RightArrow } = q_styledComponents;

const ArraySelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 35px;
`;

class ArraySelector extends React.Component {
  moveSelectorRight() {
    const { array, parent } = this.props;
    const { selectedIndex } = parent.state;
    this.saveSelectedIndex(selectedIndex + 1 > array.length - 1 ? 0 : selectedIndex + 1);
  }

  moveSelectorLeft() {
    const { array, parent } = this.props;
    const { selectedIndex } = parent.state;
    this.saveSelectedIndex(selectedIndex - 1 < 0 ? array.length - 1 : selectedIndex - 1);
  }

  saveSelectedIndex(selectedIndex) {
    const { parent, settingsKey } = this.props;
    parent.setState({
      selectedIndex,
      error: null,
    });
    if (settingsKey) {
      q_settings.set(settingsKey, selectedIndex);
    }
  }

  render() {
    const { title } = this.props;
    return (
      <ArraySelectorContainer key={title}>
        <LeftArrow onClick={() => this.moveSelectorLeft()} />
        {title}
        <RightArrow onClick={() => this.moveSelectorRight()} />
      </ArraySelectorContainer>
    );
  }
}

export default ArraySelector;
