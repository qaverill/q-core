import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import LoadingSpinner from '@q/loading-spinner';
import ArraySelector from '@q/array-selector';
import { Text } from '@q/core';
import { accountingQTheme, red, yellow, green } from '@q/theme';
import { formatAsMoney } from '@q/utils';

const AnalyzerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AnalyzerControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const AnalyzerBody = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const Overview = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TagAnalysis = styled.div`
  width: 40%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Tag = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const TagTitle = styled.h2`
  width: 200px;
`;

const TagTotal = styled.h2`
  color: ${props => props.color};
  width: 100px;
`;

const TagAverage = styled.h2`
  width: 300px;
`;

const determineAmountColor = (total, average) => {
  const percentage = total / average;
  if (total < 0) {
    if (percentage > 1) return red;
    if (percentage < 0.8) return green;
    return yellow;
  }
  if (percentage > 1) return green;
  return yellow;
};

const averageRanges = ['Monthly', 'Weekly'];

class Analyzer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagAnalysis: null,
      overview: null,
      selectedIndex: 0,
    };
  }

  componentDidMount() {
    this.calculateTagAnalysis();
    this.calculateOverview();
  }

  calculateTagAnalysis() {
    const { start, end } = this.props;
    const tagAnalysis = {};
    const _this = this;
    axios.get('/mongodb/transactions').then(res => {
      const chunkInterval = end - start;
      const chunkTotals = {};
      let chunkStart = start;
      let chunkEnd = end;
      // Initialize objects used to summarize tags
      res.data.forEach(fact => {
        const tagKey = fact.tags[0];
        if (Object.keys(tagAnalysis).indexOf(tagKey) < 0) {
          tagAnalysis[tagKey] = { total: 0, average: [] };
          chunkTotals[tagKey] = 0;
        }
      });
      // Calculate totals for every tag in both explore range / chunk range for averaging
      res.data
        .sort((a, b) => b.timestamp - a.timestamp)
        .forEach(fact => {
          const tagKey = fact.tags[0];
          // Calculate totals for transactions within the explore range
          if (fact.timestamp <= end && fact.timestamp >= start) {
            tagAnalysis[tagKey].total += fact.amount;
          }
          // Calculate totals for each chunk period
          if (fact.timestamp <= chunkEnd && fact.timestamp >= chunkStart) {
            chunkTotals[tagKey] += fact.amount;
          } else {
            Object.keys(chunkTotals).forEach(key => {
              tagAnalysis[key].average.push(chunkTotals[key]);
              chunkTotals[key] = 0;
            });
            chunkStart -= chunkInterval;
            chunkEnd -= chunkInterval;
          }
        });
      Object.keys(chunkTotals).forEach(key => {
        tagAnalysis[key].average.push(chunkTotals[key]);
        chunkTotals[key] = 0;
      });
      // Calculate averages
      Object.keys(tagAnalysis).forEach(key => {
        const totals = tagAnalysis[key].average;
        tagAnalysis[key].average = totals.reduce((a, b) => a + b, 0) / totals.length;
        tagAnalysis[key].total = tagAnalysis[key].total;
      });
      _this.setState({ tagAnalysis });
    });
  }

  calculateOverview() {
    const { data } = this.props;
    const overview = { income: 0, expense: 0 };
    data.forEach(fact => {
      overview.income += fact.amount > 0 ? fact.amount : 0;
      overview.expense += fact.amount < 0 ? fact.amount : 0;
    });
    this.setState({ overview });
  }

  render() {
    const { tagAnalysis, overview, selectedIndex } = this.state;
    if (tagAnalysis == null) {
      return <LoadingSpinner message="Calculating Analyzer..." color={accountingQTheme.tertiary} />;
    }
    const { income, expense } = overview;
    return (
      <AnalyzerContainer>
        <AnalyzerControls>
          <ArraySelector
            parent={this}
            array={averageRanges}
            title={<Text>{`Avg calculation: ${averageRanges[selectedIndex]}`}</Text>}
          />
        </AnalyzerControls>
        <AnalyzerBody>
          <Overview>
            <h2>{`In: ${formatAsMoney(income)}`}</h2>
            <h2>{`Out: ${formatAsMoney(expense)}`}</h2>
            <h2>{`Total: ${formatAsMoney(income + expense)}`}</h2>
          </Overview>
          <TagAnalysis>
            {Object.keys(tagAnalysis)
              .filter(key => tagAnalysis[key].total !== 0)
              .map(key => {
                const { total, average } = tagAnalysis[key];
                return (
                  <Tag>
                    <TagTitle>{`${key}:`}</TagTitle>
                    <TagTotal color={determineAmountColor(total, average)}>{`${formatAsMoney(total)}`}</TagTotal>
                    <TagAverage>{`(${formatAsMoney(average)} avg)`}</TagAverage>
                  </Tag>
                );
              })}
          </TagAnalysis>
        </AnalyzerBody>
      </AnalyzerContainer>
    );
  }
}

export default Analyzer;
