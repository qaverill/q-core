import React from 'react'
import styled from 'styled-components'
import {LeftArrow, RightArrow} from "../styled-components";

const ArraySelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

class ArraySelector extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      iterator: this.props.array.indexOf(this.props.parent.state.selectedItem)
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
    const nextIterator = this.state.iterator + 1;
    this.setState({
      iterator: nextIterator > this.props.array.length - 1 ? 0 : nextIterator
    });
    this.props.parent.setState({
      selectedItem: this.props.array[nextIterator > this.props.array.length - 1 ? 0 : nextIterator],
      error: null
    })
  }

  movePageLeft() {
    const lastIterator = this.state.iterator - 1;
    this.setState({
      iterator: lastIterator < 0 ? this.props.array.length - 1 : lastIterator
    });
    this.props.parent.setState({
      selectedItem: this.props.array[lastIterator < 0 ? this.props.array.length - 1 : lastIterator],
      error: null
    })
  }
}

export default ArraySelector