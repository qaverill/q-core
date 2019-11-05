/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ArraySelector from '@q/array-selector';
import TimeFrame from '@q/time-frame';
import LoadingSpinner from '@q/loading-spinner'
import { Page } from '@q/core';
import { epochToString } from '@q/utils';

const ExplorerPageContainer = styled(Page)`
  border: 5px solid ${props => props.color};
`;

const Results = styled.div`
  height: calc(100% - 105px);
  display: flex;
  margin: 7.5px;
`;

class ExplorePage extends React.PureComponent {
  componentDidMount() {
    const { start, end } = this.props;
    document.getElementById('start').value = epochToString(start);
    document.getElementById('end').value = epochToString(end);
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
      colorTheme,
      results,
      parent,
      displays,
      data,
      source,
    } = this.props;
    const resultsTitle = displays[parent.state.selectedIndex];
    return (
      <ExplorerPageContainer color={colorTheme.primary}>
        <TimeFrame parent={parent} colorTheme={colorTheme} />
        <ArraySelector array={displays} parent={parent} title={<h2>{resultsTitle}</h2>} />
        <Results>
          {data ? results : <LoadingSpinner message={`Exploring ${source}`} color={colorTheme.primary} />}
        </Results>
      </ExplorerPageContainer>
    );
  }
}

export default ExplorePage;
