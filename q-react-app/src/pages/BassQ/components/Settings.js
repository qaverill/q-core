import React from 'react'
import { TextInput } from "../../../components/styled-components";
import { dark, light } from "../../../colors";
import styled from 'styled-components'
import {setSettings} from "../../../utils";

const SettingsContainer = styled.div`
  border-radius: 15px;
  background-color: ${dark};
  disply: flex;
  flex-direction: column;
  border: 5px solid ${light};
  padding: 2.5px;
`;

const Setting = styled.div`
  display: flex;
`;

class settings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SettingsContainer>
        <Setting>
          <h2>Number of Frets: </h2>
          <TextInput id="numFrets" onBlur={() => this.setNumFrets()}/>
        </Setting>
        <Setting>
          <h2>Number of Strings: </h2>
          <TextInput id="numStrings" onBlur={() => this.setNumStrings()}/>
        </Setting>
        <Setting>
          <h2>Lowest String: </h2>
          <TextInput id="lowestString" onBlur={() => this.setLowestString()}/>
        </Setting>
      </SettingsContainer>
    )
  }

  componentDidMount() {
    document.getElementById("numFrets").value = this.props.parent.state.numFrets;
    document.getElementById("numStrings").value = this.props.parent.state.numStrings;
    document.getElementById("lowestString").value = this.props.parent.state.lowestString;
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