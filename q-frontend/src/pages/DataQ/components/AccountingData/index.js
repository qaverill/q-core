import React, { Component } from 'react';
import styled from 'styled-components';
import { epochToString } from 'q-utils';
import { LoadingSpinner } from '../../../../components/components';
import { tagTransaction } from './transactionTagger';

const { accountingQTheme } = require('q-colors');

const AccountingDataContainer = styled.div`
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: stretch;
  margin-top: 2.5px;
`;

const Transaction = styled.div`
  width: 100%;
  display: flex;
`;

const SmallProp = styled.h2`
  display: flex;
  flex-grow: 1;
`;

const BigProp = styled.h2`
  display: flex;
  flex-grow: 2;
`;

class AccountingData extends Component {
  constructor(props) {
    super(props);
    this.state = { transactions: [] };
  }

  componentDidMount() {
    this.attemptToTagData();
  }

  attemptToTagData() {
    const { items } = this.props;
    this.setState({
      transactions: items.map(transaction => ({
        ...transaction,
        tags: tagTransaction(transaction),
      })),
    });
  }

  render() {
    const { transactions } = this.state;
    if (transactions.length === 0) {
      return <LoadingSpinner message="Tagging transaction data..." color={accountingQTheme.primary} />;
    }
    return (
      <AccountingDataContainer>
        {transactions.map(transaction => {
          const { timestamp, amount, description, tags } = transaction;
          return (
            <Transaction>
              <SmallProp>{epochToString(timestamp)}</SmallProp>
              <SmallProp>{amount}</SmallProp>
              <BigProp>{description}</BigProp>
              <SmallProp>{tags}</SmallProp>
            </Transaction>
          );
        })}
      </AccountingDataContainer>
    );
  }
}

export default AccountingData;
