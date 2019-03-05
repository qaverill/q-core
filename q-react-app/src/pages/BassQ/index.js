import React from 'react'
import styled from 'styled-components'
import { bassQTheme } from "../../colors";
import { Page } from "../../components/styled-components";

const BassQPage = styled(Page)`
  border: 5px solid ${bassQTheme.primary};
`;

class BassQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <BassQPage>

      </BassQPage>
    )
  }
}

export default BassQ