import React from 'react'
import styled from 'styled-components'
import {LeftArrow, RightArrow} from "../styled-components";

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
        <LeftArrow onClick={() => this.movePageLeft()} />
        {this.props.title}
        <RightArrow onClick={() => this.movePageRight()} />
      </ArraySelectorContainer>
    )
  }

  movePageRight() {
    const nextIndex = this.state.index + 1;
    this.setState({
      index: nextIndex > this.props.array.length - 1 ? 0 : nextIndex
    });
    this.props.parent.setState({
      selectedIndex: nextIndex > this.props.array.length - 1 ? 0 : nextIndex,
      error: null
    })
  }

  movePageLeft() {
    const lastIndex = this.state.index - 1;
    this.setState({
      index: lastIndex < 0 ? this.props.array.length - 1 : lastIndex
    });
    this.props.parent.setState({
      selectedIndex: lastIndex < 0 ? this.props.array.length - 1 : lastIndex,
      error: null
    })
  }
}

export default ArraySelector