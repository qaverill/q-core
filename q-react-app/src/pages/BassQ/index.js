import React from 'react'
import styled from 'styled-components'
import { bassQTheme } from "../../colors";
import {PageBorder, Page} from "../../components/styled-components";

const BassQBorder = styled(PageBorder)`
  background-color: ${bassQTheme.primary}
`;

class BassQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <BassQBorder>
        <Page>

        </Page>
      </BassQBorder>
    )
  }
}

export default BassQ