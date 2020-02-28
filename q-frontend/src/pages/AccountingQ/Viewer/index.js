import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';

import ManualTagger from './ManualTagger';
import { red, green, yellow, accountingQTheme } from '../../../packages/colors';
import { epochToString, copyStringToClipboard, numberToPrice } from '../../../packages/utils';
import { Button, StyledPopup } from '../../../packages/core';

const Viewer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Transaction = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background-color: ${props => props.amount < 0 ? `rgba(255, 0, 0, ${props.opacity})` : `rgba(0, 255, 0, ${props.opacity})`};
  border-radius: 15px;
  margin: 5px;
`;

const DateColumn = styled.div`
  display: flex;
  flex-shrink: 0;
`;

const AmountColumn = styled.div`
  display: flex;
  width: 100px;
  flex-direction: row-reverse;
  flex-shrink: 0;
`;

const DescriptionColumn = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  white-space: pre;
`;

const TagsColumn = styled.div`
  display: flex;
  width: 255px;
  align-items: center;
  flex-direction: row-reverse;
  flex-shrink: 1;
  white-space: nowrap;
`;

const TransactionFact = ({ fact }) => {
  const { _id, timestamp, amount, description, tags } = fact;

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

  const opacity = 0.1;

  return (
    <Transaction amount={amount} opacity={opacity}>
      <Button color={accountingQTheme.tertiary} onClick={copyIdToClipboard}>_id</Button>
      <DateColumn><h2>{epochToString(timestamp)}</h2></DateColumn>
      <AmountColumn><h2>{numberToPrice(amount)}</h2></AmountColumn>
      <DescriptionColumn><h2>{description}</h2></DescriptionColumn>
      <TagsColumn>
        <h2>{tags.length}</h2>
        <StyledPopup modal trigger={craftTagButton(fact)}>
          {close => <ManualTagger fact={fact} closeModal={close} />}
        </StyledPopup>
      </TagsColumn>
    </Transaction>
  );
};

export default ({ data }) => <Viewer>{data.map(fact => <TransactionFact fact={fact} />)}</Viewer>;
