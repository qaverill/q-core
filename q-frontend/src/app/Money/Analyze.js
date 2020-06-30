import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { formatAsMoney, averageArray } from '../../packages/utils';
import {
  moneyTheme,
  red,
  yellow,
  green,
} from '../../packages/colors';
import { H2 } from '../../packages/core';

import LoadingSpinner from '../../components/LoadingSpinner';

const AnalyzerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AnalyzerBody = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const Overview = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TagAnalysis = styled.div`
  width: 50%;
  height: 100%;
  overflow: auto;
`;

const Tag = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const TagTitle = styled(H2)`
  width: 150px;
`;

const TagTotal = styled(H2)`
  color: ${props => props.color};
`;

const TagAverage = styled(H2)`
  align-items: flex-end;
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

const getStartOfTimeframe = (timeframe, timestamp) => {
  if (timeframe === 'week') {
    const date = new Date(timestamp * 1000);
    const day = date.getDay();
    const monday = new Date(date.setDate(date.getDate() - day + (day === 0 ? -6 : 1)));
    return new Date(date.getFullYear(), date.getMonth(), monday.getDate()) / 1000;
  }
  if (timeframe === 'month') {
    const date = new Date(timestamp * 1000);
    return new Date(date.getFullYear(), date.getMonth(), 1) / 1000;
  }
  return 0;
};

const calculateAmountNeededToLiveForAMonth = tagAnalysis => {
  let total = 0;
  ['dinner', 'lunch', 'groceries', 'alcohol', 'travel', 'utilities', 'loans', 'rent'].forEach(tag => {
    total += tagAnalysis[tag].averages.month;
  });
  return total;
};

class Analyze extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagAnalysis: null,
      overview: null,
    };
  }

  componentDidMount() {
    this.calculateOverview();
    this.calculateTagAnalysis();
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

  calculateTagAnalysis() {
    const _this = this;
    const { start, end } = this.props;
    const tagAnalysis = {};
    axios.get('/mongodb/transactions').then(res => {
      const facts = res.data.sort((a, b) => b.timestamp - a.timestamp);
      const chunks = {
        week: { start: getStartOfTimeframe('week', facts[0].timestamp), idx: 0 },
        month: { start: getStartOfTimeframe('month', facts[0].timestamp), idx: 0 },
      };
      facts.forEach(fact => {
        const tag = fact.tags[0];
        const { timestamp, amount } = fact;
        if (tagAnalysis[tag] == null) {
          tagAnalysis[tag] = { total: 0, averages: { week: [], month: [] } };
        }
        if (timestamp <= end && timestamp >= start) {
          tagAnalysis[tag].total += amount;
        }
        Object.keys(chunks).forEach(timeframe => {
          const timeframeIdx = chunks[timeframe].idx;
          if (tagAnalysis[tag].averages[timeframe][timeframeIdx] == null) {
            tagAnalysis[tag].averages[timeframe][timeframeIdx] = 0;
          }
          if (timestamp >= chunks[timeframe].start) {
            tagAnalysis[tag].averages[timeframe][timeframeIdx] += amount;
          } else {
            chunks[timeframe].start = getStartOfTimeframe(timeframe, timestamp);
            chunks[timeframe].idx += 1;
            tagAnalysis[tag].averages[timeframe][timeframeIdx] += amount;
          }
        });
      });
      Object.keys(tagAnalysis).forEach(tag => {
        tagAnalysis[tag].averages.week = averageArray(tagAnalysis[tag].averages.week);
        tagAnalysis[tag].averages.month = averageArray(tagAnalysis[tag].averages.month);
      });
      _this.setState({ tagAnalysis });
    });
  }

  render() {
    const { tagAnalysis, overview } = this.state;
    if (tagAnalysis == null) {
      return <LoadingSpinner message="Calculating Analyzer..." color={moneyTheme.tertiary} />;
    }
    const { income, expense } = overview;
    return (
      <AnalyzerContainer>
        <AnalyzerBody>
          <Overview>
            <H2>{`In: ${formatAsMoney(income)}`}</H2>
            <H2>{`Out: ${formatAsMoney(expense)}`}</H2>
            <H2>{`Total: ${formatAsMoney(income + expense)}`}</H2>
            <H2>--------------------</H2>
            <H2>{`Total amount needed to live for a month: ${formatAsMoney(calculateAmountNeededToLiveForAMonth(tagAnalysis))}`}</H2>
          </Overview>
          <TagAnalysis>
            {Object.keys(tagAnalysis).filter(key => tagAnalysis[key].total !== 0).map(key => {
              const { total, averages } = tagAnalysis[key];
              return (
                <Tag>
                  <TagTitle>{`${key}:`}</TagTitle>
                  <TagTotal color={determineAmountColor(total, averages.month)}>{`${formatAsMoney(total)}`}</TagTotal>
                  <TagAverage>{`(${formatAsMoney(averages.week)}/w ${formatAsMoney(averages.month)}/m)`}</TagAverage>
                </Tag>
              );
            })}
          </TagAnalysis>
        </AnalyzerBody>
      </AnalyzerContainer>
    );
  }
}

export default Analyze;
