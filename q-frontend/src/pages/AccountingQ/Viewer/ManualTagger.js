/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { red } from '../../../packages/colors';
import { PopupContainer, TextInput, Button } from '../../../packages/core';

const Tag = styled.div`
  display: flex;
`;

const ManualTagger = ({ idx, transaction, closeModal, updateTransaction }) => {
  const updateTransactionTags = (newTag) => {
    if (newTag.replace(/ /g, '').length !== 0) {
      transaction.tags.push(newTag);
      updateTransaction(transaction, idx)
        .then(closeModal);
    }
  };

  const removeTag = ({ tagIdx }) => {
    const newTransaction = transaction;
    delete newTransaction.tags[tagIdx];
    newTransaction.tags = newTransaction.tags.filter(tag => tag != null);
    updateTransaction(newTransaction, idx);
  };

  return (
    <PopupContainer>
      {transaction.tags.map((tag, tagIdx) => (
        <Tag>
          <h2>{tag}</h2>
          <Button color={red} onClick={() => removeTag(tagIdx)}>X</Button>
        </Tag>
      ))}
      <TextInput
        onBlur={evt => updateTransactionTags(evt.target.value)}
        onKeyDown={evt => evt.keyCode === 13 && updateTransactionTags(evt.target.value)}
      />
    </PopupContainer>
  );
};

export default ManualTagger;
