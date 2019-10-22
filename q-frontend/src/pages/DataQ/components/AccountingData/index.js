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

const DateColumn = styled.div`
  display: flex;
  width: 110px;
  flex-shrink: 0;
`;

const AmountColumn = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 90px;
  flex-shrink: 0;
`;

const DescriptionColumn = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
`;

const TagsColumn = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 200px;
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
              <DateColumn><h2>{epochToString(timestamp)}</h2></DateColumn>
              <AmountColumn><h2>{amount}</h2></AmountColumn>
              <DescriptionColumn><h2>{description}</h2></DescriptionColumn>
              <TagsColumn><h2>{tags}</h2></TagsColumn>
            </Transaction>
          );
        })}
      </AccountingDataContainer>
    );
  }
}

export default AccountingData;
