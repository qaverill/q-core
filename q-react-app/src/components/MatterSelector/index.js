import React from 'react'
import {Button, Page} from "../styled-components";
import { capitolFirstLetter } from "../../utils";
import styled from 'styled-components'

const MatterContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

class MatterSelector extends React.Component {
  // <MatterSelector matter={[SpotifyListensCollector, SpotifySavesCollector]} parent={this} />
  render() {
    return (
      <MatterContainer>
        {this.props.matter.map(matter =>
          <div key={matter.name}>
            {this.circle(this.props.parent.state.selectedMatter === matter)}
            <Button onClick={() => this.props.parent.setState({selectedMatter: matter})}>
              {capitolFirstLetter(matter.name)}
            </Button>
          </div>
        )}
      </MatterContainer>
    )
  }

  circle(visible) {
    return (
      <svg height="10" width="10">
        {visible ? <circle cx="5" cy="5" r="5" fill="white" /> : null}
      </svg>
    )
  }
}

export default MatterSelector