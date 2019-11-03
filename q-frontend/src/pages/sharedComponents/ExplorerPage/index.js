/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ArraySelector from '../../../components/ArraySelector';
import TimeFrame from '../../../components/TimeFrame';
import { Page } from '../../../components/styled-components';
import { LoadingSpinner } from '../../../components/components';


const q_utils = require('q-utils');

const ExplorerPageContainer = styled(Page)`
  border: 5px solid ${props => props.color};
`;

const Results = styled.div`
  height: calc(100% - 105px);
  display: flex;
  margin: 7.5px;
`;

class ExplorerPage extends React.PureComponent {
  componentDidMount() {
    const { start, end } = this.props;
    document.getElementById('start').value = q_utils.epochToString(start);
    document.getElementById('end').value = q_utils.epochToString(end);
    this.explore();
  }

  componentDidUpdate() {
    const { data } = this.props;
    if (data == null) {
      this.explore();
    }
  }

  explore() {
    const { start, end, parent, source } = this.props;
    axios.get(`/mongodb/${source}?start=${start}&end=${end}`).then(res => {
      parent.setState({
        data: res.data,
      });
    });
  }

  render() {
    const {
      color,
      results,
      parent,
      displays,
      data,
      source,
    } = this.props;
    const resultsTitle = displays[parent.state.selectedIndex];
    return (
      <ExplorerPageContainer color={color}>
        <TimeFrame parent={parent} color={color} />
        <ArraySelector array={displays} parent={parent} title={<h2>{resultsTitle}</h2>} />
        <Results>
          {data ? results : <LoadingSpinner message={`Exploring ${source}`} color={color} />}
        </Results>
      </ExplorerPageContainer>
    );
  }
}

export default ExplorerPage;
