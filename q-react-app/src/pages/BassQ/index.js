import React from 'react'
import styled from 'styled-components'
import Select from 'react-select';
import Settings from "./components/Settings";
import { bassQTheme } from "../../colors";
import { Page, SettingsGear, StyledPopup, Text } from "../../components/styled-components";
import {getSettings} from "../../utils";
import {Iterator} from "../../objects";

const BassQPage = styled(Page)`
  border: 5px solid ${bassQTheme.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Controls = styled.div`
  width: calc(100% - 5px);
  margin: 2.5px;
  height: 50px;
  background-color: blue;
  display: flex;
  align-items: center;
`;

const RootSelector = styled(Select)`
  width: 100px;
`;

const ModeSelector = styled(Select)`
  width: 100px;
`;

const SettingsButton = styled(SettingsGear)`
  margin-left: auto;
`;

const FretBoard = styled.div`
  width: calc(100% - 10px);
  height: calc(100% - 50px);
  overflow: auto;
  background-color: black;
  margin: 2.5px;
  border: 2.5px solid black;
`;

const String = styled.div`
  height: calc(100% / ${props => props.numStrings});
  width: 100%;
  display: flex;
`;

const Fret = styled.div`
  height: calc(100% / 0);
  width: calc(100%);
  margin: 2.5px;
  background-color: gray;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class BassQ extends React.Component {
  notes = [];

  modes = [
    { value: "0", label: "maj" },
    { value: "1", label: "min" },
  ];

  rootsIterator = new Iterator([
      { value: "0", label: "C" },
      { value: "1", label: "C#" },
      { value: "2", label: "D" },
      { value: "3", label: "D#" },
      { value: "4", label: "E" },
      { value: "5", label: "F" },
      { value: "6", label: "F#" },
      { value: "7", label: "G" },
      { value: "8", label: "G#" },
      { value: "9", label: "A" },
      { value: "10", label: "A#" },
      { value: "11", label: "B" }
  ]);

  constructor(props) {
    super(props);
    this.state = {
      numStrings: getSettings() != null ? getSettings().numStrings : 8,
      numFrets: getSettings() != null ? getSettings().numFrets : 8,
      lowestString: getSettings() != null ? getSettings().lowestString : "B",
    };
  }

  render() {
    return (
      <BassQPage>
        <Controls>
          <RootSelector options={this.rootsIterator.list} placeholder={"Root..."}/>
          <ModeSelector options={this.modes} placeholder={"Mode..."}/>
          <StyledPopup trigger={<SettingsButton size="40px" />} modal>
            <Settings parent={this}/>
          </StyledPopup>
        </Controls>
        <FretBoard>
          {this.generateStrings()}
        </FretBoard>
      </BassQPage>
    )
  }

  generateStrings() {
    let strings = [];
    for (let string = 0; string < this.state.numStrings; string++){
      strings.push(
        <String numStrings={this.state.numStrings} key={string}>
          {this.generateFrets(string)}
        </String>
      )
    }
    return strings;
  }

  generateFrets(string) {
    let columns = [];
    for (let col = 0; col < this.state.numFrets; col++){
      const noteValue = col + (string * this.state.numFrets);
      this.notes.push(noteValue);
      columns.push(
          <Fret noteValue={noteValue} key={string + "-" + col}>
            {this.rootsIterator.next().label}
          </Fret>
      )
    }
    return columns;
  }
}

export default BassQ