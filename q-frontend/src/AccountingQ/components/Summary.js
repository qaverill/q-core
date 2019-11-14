import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import LoadingSpinner from '@q/loading-spinner';
import { accountingQTheme } from '@q/theme';
import { roundToTwoDecimalPlaces } from '@q/utils';

const SummaryContainer = styled.div`
  display: flex;
  width: 100%;
`;

const TagSummary = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Overview = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagSummary: null,
      overview: null,
    };
  }

  componentDidMount() {
    this.calculateTagSummary();
    this.calculateOverview();
  }

  calculateTagSummary() {
    const { start, end } = this.props;
    const tagSummary = {};
    const _this = this;
    axios.get('/mongodb/transactions').then(res => {
      const chunkInterval = end - start;
      const chunkTotals = {};
      let chunkStart = start;
      let chunkEnd = end;
      // Initialize objects used to summarize tags
      res.data.forEach(fact => {
        const tagKey = fact.tags[0];
        if (Object.keys(tagSummary).indexOf(tagKey) < 0) {
          tagSummary[tagKey] = { total: 0, average: [] };
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
            tagSummary[tagKey].total += fact.amount;
          }
          // Calculate totals for each chunk period
          if (fact.timestamp <= chunkEnd && fact.timestamp >= chunkStart) {
            chunkTotals[tagKey] += fact.amount;
          } else {
            Object.keys(chunkTotals).forEach(key => {
              tagSummary[key].average.push(chunkTotals[key]);
              chunkTotals[key] = 0;
            });
            chunkStart -= chunkInterval;
            chunkEnd -= chunkInterval;
          }
        });
      Object.keys(chunkTotals).forEach(key => {
        tagSummary[key].average.push(chunkTotals[key]);
        chunkTotals[key] = 0;
      });
      // Calculate averages
      Object.keys(tagSummary).forEach(key => {
        const totals = tagSummary[key].average;
        tagSummary[key].average = roundToTwoDecimalPlaces(totals.reduce((a, b) => a + b, 0) / totals.length);
        tagSummary[key].total = roundToTwoDecimalPlaces(tagSummary[key].total);
      });
      _this.setState({ tagSummary });
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
    const { tagSummary, overview } = this.state;
    if (tagSummary == null) {
      return <LoadingSpinner message="Calculating summary..." color={accountingQTheme.tertiary} />;
    }
    const { income, expense } = overview;
    return (
      <SummaryContainer>
        <TagSummary>
          {Object.keys(tagSummary).map(key => (
            <h2>{`${key}: ${tagSummary[key].total} (${tagSummary[key].average} avg)`}</h2>
          ))}
        </TagSummary>
        <Overview>
          <h2>{`In: $${roundToTwoDecimalPlaces(income)}`}</h2>
          <h2>{`Out: ${roundToTwoDecimalPlaces(expense)}`}</h2>
          <h2>{`Total: ${roundToTwoDecimalPlaces(income + expense)}`}</h2>
        </Overview>
      </SummaryContainer>
    );
  }
}

export default Summary;
