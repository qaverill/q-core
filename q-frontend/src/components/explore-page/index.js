/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Page } from '@q/core';
import { epochToString } from '@q/utils';
import ArraySelector from '../array-selector';
import TimeFrame from '../time-frame';
import LoadingSpinner from '../loading-spinner';

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
    const {
      start,
      end,
      parent,
      source,
    } = this.props;
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
      settingsKey,
      dateControls,
    } = this.props;
    const resultsTitle = displays[parent.state.selectedIndex];
    return (
      <ExplorerPageContainer color={colorTheme.primary}>
        <TimeFrame parent={parent} colorTheme={colorTheme} dateControls={dateControls} />
        <ArraySelector
          array={displays}
          parent={parent}
          title={<h2>{resultsTitle}</h2>}
          settingsKey={settingsKey}
        />
        <Results>
          {data ? results : <LoadingSpinner message={`Exploring ${source}`} color={colorTheme.primary} />}
        </Results>
      </ExplorerPageContainer>
    );
  }
}

export default ExplorePage;
