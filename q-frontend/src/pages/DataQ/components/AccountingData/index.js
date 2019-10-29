import React, { Component } from 'react';
import styled from 'styled-components';
import { epochToString } from 'q-utils';
import { LoadingSpinner } from '../../../../components/components';
import { Button } from '../../../../components/styled-components';
import { tagTransaction } from './transactionTagger';

const { accountingQTheme, green, red, yellow } = require('q-colors');

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

const OrdinalColumn = styled.div`
  display: flex;
  width: 60px;
  flex-shrink: 0;
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
  flex-direction: row-reverse;
  flex-shrink: 0;
  width: 200px;
`;

const calculateTagButtonColor = tags => {
  if (tags.includes('NEEDS ORDINAL')) return yellow;
  if (tags.length > 0) return green;
  return red;
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
        tags: tagTransaction(transaction),
      })),
    });
  }

  tagTransaction(idx) {
    const newTag = 'test tag';
    const { parent } = this.props;
    const updatedTransactions = parent.state.unsaved.map((transaction, i) => {
      if (i === idx) {
        transaction.tags.push(newTag);
      }
      return transaction;
    });
    sessionStorage.setItem('dataQUnsaved', JSON.stringify(updatedTransactions));
    parent.setState({ unsaved: updatedTransactions });
  }

  render() {
    const { parent } = this.props;
    if (parent.state.unsaved.length === 0) {
      return <LoadingSpinner message="Tagging transaction data..." color={accountingQTheme.primary} />;
    }
    return (
      <AccountingDataContainer>
        {parent.state.unsaved.map((transaction, i) => (
          <Transaction>
            <OrdinalColumn><h2>{transaction.ordinal}</h2></OrdinalColumn>
            <DateColumn><h2>{epochToString(transaction.timestamp)}</h2></DateColumn>
            <AmountColumn><h2>{transaction.amount}</h2></AmountColumn>
            <DescriptionColumn><h2>{transaction.description}</h2></DescriptionColumn>
            <TagsColumn>
              <h2>{transaction.tags.length}</h2>
              <Button
                color={calculateTagButtonColor(transaction.tags)}
                onClick={() => this.tagTransaction(i)}
              >
                {transaction.tags.length === 0 ? 'TAG ME' : transaction.tags.join(' | ')}
              </Button>
            </TagsColumn>
          </Transaction>
        ))}
      </AccountingDataContainer>
    );
  }
}

export default AccountingData;
