/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import styled from 'styled-components';
import { accountingQTheme } from '@q/colors';

import LoadingSpinner from '../../../components/loading-spinner';

const discreteTags = require('../../../transactionTags.json');

const AccountingDataContainer = styled.div`
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: stretch;
  margin-top: 2.5px;
`;

const autoTagTransaction = transaction => {
  const { tags, amount } = transaction;
  const description = transaction.description.toLowerCase();
  if (description.indexOf('venmo from') > -1) {
    return ['NEEDS ORDINAL'];
  }
  Object.keys(discreteTags).forEach(tagKey => {
    discreteTags[tagKey].forEach(tag => {
      if (description.toLowerCase().includes(tag.toLowerCase())) {
        tags.push(tagKey);
      }
    });
  });
  if (description.indexOf('check withdrawal') > -1 && amount === -1150) tags.push('rent');
  return [...new Set(tags)];
};

class AccountingData extends Component {
  componentDidMount() {
    this.attemptToTagData();
  }

  attemptToTagData() {
    const { parent } = this.props;
    parent.setState({
      unsaved: parent.state.unsaved.map(transaction => ({
        ...transaction,
        tags: autoTagTransaction(transaction),
      })),
    });
  }

  removeFact(i) {
    const { parent } = this.props;
    parent.state.unsaved.splice(i, 1);
    parent.setState({
      unsaved: parent.state.unsaved,
    });
  }

  render() {
    const { parent } = this.props;
    if (parent.state.unsaved.length !== 0 && parent.state.unsaved[0].tags == null) {
      return <LoadingSpinner message="Tagging transaction data..." color={accountingQTheme.primary} />;
    }
    return (
      <AccountingDataContainer>
        {/* {parent.state.unsaved.map((transaction, i) => (
          <TransactionFact
            transaction={transaction}
            idx={i}
            parent={parent}
            removeFact={(idx) => this.removeFact(idx)}
            editable
          />
        ))} */}
      </AccountingDataContainer>
    );
  }
}

export default AccountingData;
