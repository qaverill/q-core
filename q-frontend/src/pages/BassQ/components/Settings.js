import React from 'react';
import styled from 'styled-components';
import { q_styledComponts, q_settings } from 'q-lib';

const { TextInput, PopupContainer } = q_styledComponts;

const Setting = styled.div`
  display: flex;
`;

const SettingTitle= styled.h2`
`;

const SettingInput = styled(TextInput)`
  width: 50px;
`;

class settings extends React.Component {
  render() {
    return (
      <PopupContainer>
        <Setting>
          <SettingTitle>Number of Frets: </SettingTitle>
          <SettingInput id="numFrets" onBlur={() => this.setNumFrets()} defaultValue={this.props.parent.state.numFrets}/>
        </Setting>
        <Setting>
          <SettingTitle>Number of Strings: </SettingTitle>
          <SettingInput id="numStrings" onBlur={() => this.setNumStrings()} defaultValue={this.props.parent.state.numStrings}/>
        </Setting>
        <Setting>
          <SettingTitle>Lowest String: </SettingTitle>
          <SettingInput id="lowestString" onBlur={() => this.setLowestString()} defaultValue={this.props.parent.state.lowestString}/>
        </Setting>
      </PopupContainer>
    )
  }

  setNumFrets() {
    q_settings.set("numFrets", parseInt(document.getElementById("numFrets").value));
    this.props.parent.setState({
      numFrets: parseInt(document.getElementById("numFrets").value)
    })
  }

  setNumStrings() {
    q_settings.set("numStrings", parseInt(document.getElementById("numStrings").value));
    this.props.parent.setState({
      numStrings: parseInt(document.getElementById("numStrings").value)
    })
  }

  setLowestString() {
    q_settings.set("lowestString", document.getElementById("lowestString").value);
    this.props.parent.setState({
      lowestString: document.getElementById("lowestString").value
    })
  }
}

export default settings