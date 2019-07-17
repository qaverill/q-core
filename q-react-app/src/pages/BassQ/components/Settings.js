import React from 'react'
import { TextInput } from "../../../components/styled-components";
import { dark, light } from "../../../colors";
import styled from 'styled-components'
import {setSettings} from "../../../utils";

const SettingsContainer = styled.div`
  border-radius: 15px;
  background-color: ${dark};
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 5px solid ${light};
  padding: 20% 2.5px;
`;

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
      <SettingsContainer>
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
      </SettingsContainer>
    )
  }

  setNumFrets() {
    setSettings("numFrets", parseInt(document.getElementById("numFrets").value));
    this.props.parent.setState({
      numFrets: parseInt(document.getElementById("numFrets").value)
    })
  }

  setNumStrings() {
    setSettings("numStrings", parseInt(document.getElementById("numStrings").value));
    this.props.parent.setState({
      numStrings: parseInt(document.getElementById("numStrings").value)
    })
  }

  setLowestString() {
    setSettings("lowestString", document.getElementById("lowestString").value);
    this.props.parent.setState({
      lowestString: document.getElementById("lowestString").value
    })
  }
}

export default settings