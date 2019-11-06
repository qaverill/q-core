/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import styled from 'styled-components';
import ManualTagger from '../components/manual-tagger/build/index';
import { Button, StyledPopup } from '@q/core';
import LoadingSpinner from '@q/loading-spinner';
import { epochToString } from '@q/utils';
import {
  accountingQTheme,
  green,
  red,
  yellow,
} from '@q/theme';

const discreteTags = require('../components/discreteTags.json');

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

const craftTagButton = transaction => {
  const { tags } = transaction;
  let color = tags.length === 0 ? red : green;
  let label = tags.length === 0 ? 'TAG ME' : tags.join(' | ');
  if (tags.includes('NEEDS ORDINAL')) {
    color = yellow;
    label = 'NEEDS ORDINAL';
  }
  return (
    <Button color={color} data-tip={tags.join(' | ')}>
      {label}
    </Button>
  );
};

const autoTagTransaction = transaction => {
  const { tags, amount } = transaction;
  const description = transaction.description.toLowerCase();
  if (description.indexOf('venmo from') > -1) {
    return ['NEEDS ORDINAL'];
  }
  Object.keys(discreteTags).forEach(tagKey => {
    discreteTags[tagKey].forEach(tag => {
      if (description.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
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

  render() {
    const { parent, ordinalStart } = this.props;
    if (parent.state.unsaved.length !== 0 && parent.state.unsaved[0].tags == null) {
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
              <StyledPopup modal trigger={craftTagButton(transaction)}>
                {close => (
                  <ManualTagger
                    transaction={transaction}
                    transactionIdx={i}
                    parent={parent}
                    closeModal={close}
                    ordinalStart={ordinalStart}
                  />
                )}
              </StyledPopup>
            </TagsColumn>
          </Transaction>
        ))}
      </AccountingDataContainer>
    );
  }
}

export default AccountingData;
