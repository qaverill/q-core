import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';

import ManualTagger from './ManualTagger';
import { deleteDocument } from '../../../api/mongodb';
import { red, green, yellow, accountingQTheme } from '../../../packages/colors';
import { epochToString, copyStringToClipboard } from '../../../packages/utils';
import { Button, StyledPopup } from '../../../packages/core';

const Transaction = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
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

const Viewer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const TransactionFact = ({ fact, getData }) => {
  const { _id, timestamp, amount, description, tags } = fact;

  const removeTransactionFact = () => {
    deleteDocument({ collection: 'transactions', _id })
      .then(() => {
        getData();
        NotificationManager.success('Successfully deleted transaction fact', `_id: ${_id}`);
      });
  };

  const craftTagButton = () => {
    let color = tags.length === 0 ? red : green;
    let label = tags.length === 0 ? 'TAG ME' : tags.join(' | ');
    if (tags.includes('payBack')) {
      color = yellow;
      label = 'payBack';
    }
    return (
      <Button color={color} data-tip={tags.join(' | ')}>
        {label}
      </Button>
    );
  };

  const copyIdToClipboard = () => {
    copyStringToClipboard(_id);
    NotificationManager.success('Copied transaction to clipboard', _id);
  };

  return (
    <Transaction>
      <Button color={accountingQTheme.tertiary} onClick={copyIdToClipboard}>_id</Button>
      <DateColumn><h2>{epochToString(timestamp)}</h2></DateColumn>
      <AmountColumn><h2>{amount}</h2></AmountColumn>
      <DescriptionColumn><h2>{description}</h2></DescriptionColumn>
      <TagsColumn>
        <h2>{tags.length}</h2>
        <StyledPopup modal trigger={craftTagButton(fact)}>
          {close => <ManualTagger fact={fact} closeModal={close} />}
        </StyledPopup>
      </TagsColumn>
      <Button color={red} onClick={removeTransactionFact}>X</Button>
    </Transaction>
  );
};

export default ({ data, getData }) => (
  <Viewer>
    {data.map(fact => (
      <TransactionFact
        fact={fact}
        getData={getData}
      />
    ))}
  </Viewer>
);
