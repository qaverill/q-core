import React from 'react'
import styled from 'styled-components'
import { bassQTheme } from "../../colors";
import { Page } from "../../components/styled-components";

const BassQPage = styled(Page)`
  border: 5px solid ${bassQTheme.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Controls = styled.div`
  width: 100%;
  margin: 2.5px;
  height: 50px;
  background-color: blue;
`;

const FretBoard = styled.div`
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  background-color: red;
  margin: 2.5px;
  border: 2.5px solid black;
`;

const String = styled.div`
  height: calc(100% / ${props => props.rows});
  width: 100%;
  display: flex;
`;

const Fret = styled.div`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  margin: 2.5px;
  background-color: gray;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class BassQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fretSize: 50,
      rows: 8,
      columns: 8
    }
  }

  render() {
    return (
      <BassQPage>
        <Controls>
          hey
        </Controls>
        <FretBoard>
          {this.generateStrings()}
        </FretBoard>
      </BassQPage>
    )
  }

  generateStrings() {
    let rows = [];
    for (let row = 0; row < this.state.rows; row++){
      rows.push(
        <String rows={this.state.rows} key={row}>
          {this.generateFrets(row)}
        </String>
      )
    }
    return rows;
  }

  generateFrets(row) {
    let columns = [];
    for (let col = 0; col < this.state.columns; col++){
      columns.push(
          <Fret size={this.state.fretSize} key={row + "-" + col}>
            {row + "-" + col}
          </Fret>
      )
    }
    return columns;
  }


}

export default BassQ