import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Settings from "./components/Settings";
import { setSettings, getSettings } from '@q/utils';
import { bassQTheme } from '@q/colors';
import { Page, SettingsGear, StyledPopup, Selector, Button } from '@q/core';

const BassQPage = styled(Page)`
  border: 5px solid ${bassQTheme.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CreatorBar = styled.div`
  margin: 2.5px;
  height: 60px;
  background-color: black;
  padding: 5px;
  display: flex;
  align-items: center;
`;

const FretBoard = styled.div`
  width: calc(100% - 10px);
  overflow: auto;
  background-color: black;
  height: calc(100% - 50px);
  margin: 2.5px;
  border: 2.5px solid black;
`;

const RootSelector = styled(Selector)`
  width: 110px;
`;

const ModeSelector = styled(Selector)`
  width: 120px;
`;

const SettingsButton = styled(SettingsGear)`
  margin-left: auto;
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
  background-color: ${props => props.color};
`;

const modes = [
  { value: [0, 4, 7, 11], label: "maj" },
  { value: [0, 3, 7, 10], label: "min" },
];

const roots = [
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
];

class BassQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numStrings: getSettings() != null ? getSettings().numStrings : 8,
      numFrets: getSettings() != null ? getSettings().numFrets : 8,
      lowestString: getSettings() != null ? getSettings().lowestString : "B",
      root: getSettings() != null ? getSettings().root : null,
      mode: getSettings() != null ? getSettings().mode : null,
    };
  }

  render() {
    return (
      <BassQPage>
        <CreatorBar>
          <RootSelector options={roots} placeholder={"Root..."} onChange={this.setRoot} value={this.state.root}/>
          <ModeSelector options={modes} placeholder={"Mode..."} onChange={this.setMode} value={this.state.mode}/>
          <Button color={"red"} onClick={this.clearFretColors}>
            Clear
          </Button>
          <StyledPopup trigger={<SettingsButton size="40px" />} modal>
            <Settings parent={this}/>
          </StyledPopup>
        </CreatorBar>
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
    for (let fret = 0; fret < this.state.numFrets; fret++){
      const note = this.getNoteFromValue(string, fret, this.state.lowestString);
      columns.push(
          <Fret color={this.getNoteColor(note)} onClick={() => this.colorFret(note)}>
            {note}
          </Fret>
      )
    }
    return columns;
  }

  getNoteFromValue(string, fret, lowestString) {
    const notes = roots.map(root => root.label);
    return notes[(notes.indexOf(lowestString) + fret + (string * 7)) % 12]
  }

  getNoteColor(note) {
    const notes = roots.map(root => root.label);
    let color = null;
    if (this.state.mode !== null) {
      this.state.mode.value.forEach((interval, rank) => {
        if ((note === notes[((notes.indexOf(this.state.root.label) + interval) % 12)])) {
          color = ["green", "yellow", "orange", "red", "purple", "blue"][rank];
        }
      });
    }
    return color;
  };

  colorFret(note) {
    this.setState({
      root: roots.find(root => root.label === note)
    })
  }

  setRoot(root) {
    setSettings("root", root);
    this.setState({
      root: root
    })
  };

  setMode(mode) {
    setSettings("mode", mode);
    this.setState({
      mode: mode
    })
  };

  clearFretColors() {
    this.setState({
      root: null,
      mode: null
    })
  }
}

export default BassQ