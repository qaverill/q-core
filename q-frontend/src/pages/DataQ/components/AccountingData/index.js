import React, { Component } from 'react';
import styled from 'styled-components';
import { epochToString } from 'q-utils';
import ManualTagger from './components/ManualTagger';
import { LoadingSpinner } from '../../../../components/components';
import { Button, StyledPopup } from '../../../../components/styled-components';
import { autoTagTransaction } from './autoTagger';

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

const craftTagButton = transaction => {
  const { tags } = transaction;
  let color = tags.length === 0 ? red : green;
  let label = tags.length === 0 ? 'TAG ME' : `${tags.length} ${tags.length === 1 ? 'Tag' : 'Tags'}`;
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
              <StyledPopup modal trigger={craftTagButton(transaction)}>
                <ManualTagger transaction={transaction} transactionIdx={i} parent={parent} />
              </StyledPopup>
            </TagsColumn>
          </Transaction>
        ))}
      </AccountingDataContainer>
    );
  }
}

export default AccountingData;
