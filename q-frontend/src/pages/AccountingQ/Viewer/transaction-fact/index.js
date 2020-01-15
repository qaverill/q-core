/* eslint-disable no-alert */
import React from 'react';
import styled from 'styled-components';
import { red, green, yellow } from '@q/colors';
import { epochToString } from '@q/utils';
import { Button, StyledPopup } from '@q/core';
import ManualTagger from './ManualTagger';
import { removeTransaction } from '../../../../api/mongodb';

const Transaction = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
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
  align-items: center;
  flex-direction: row-reverse;
  flex-shrink: 0;
  width: 260px;
  white-space: nowrap;
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

class TransactionFact extends React.PureComponent {
  removeTransactionFact() {
    const { transaction, parent } = this.props;
    // eslint-disable-next-line no-undef
    if (window.confirm('Are you sure?')) {
      removeTransaction(transaction, () => {
        parent.setState({
          data: null,
        });
      });
    }
  }

  render() {
    const {
      transaction,
      parent,
    } = this.props;
    return (
      <Transaction>
        <Button color={red} onClick={() => this.removeTransactionFact()}>X</Button>
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
                parent={parent}
                closeModal={close}
              />
            )}
          </StyledPopup>
        </TagsColumn>
      </Transaction>
    );
  }
}

export default TransactionFact;
